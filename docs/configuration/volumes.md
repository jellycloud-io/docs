---
id: volumes
title: Volumes
sidebar_position: 3
---

# Volumes

Standard dynamic PVCs work on JellyCloud with no configuration. This page covers the options for controlling where volumes and the pods that use them are placed, using static or existing storage, storage on self-hosted nodes, and what happens to volumes when a cluster disconnects. For how volumes work and which storage each cloud uses, see [Persistent Volumes](/core-concepts/persistent-volumes).

:::note
Each pod can currently use one PVC.
:::

## Shared PVC across pods and replicas

When multiple pods or replicas reference the same PVC, JellyCloud decides where to place each one based on where the PVC's volumes already exist. A single PVC can be backed by more than one cloud volume, each in its own provider and zone. You control how strictly pods stay with the existing volume using the `volume.jellycloud.io/shared-storage` label on the pod template:

```yaml
template:
  metadata:
    labels:
      volume.jellycloud.io/shared-storage: required
```

| Value | Behavior |
|---|---|
| `preferred` (default) | JellyCloud first places the pod on a node that already has one of this PVC's volumes attached, so several pods can share a zone. If no such node is available, JellyCloud places the pod elsewhere and creates a new volume for the PVC in that zone or cloud. |
| `required` | Pods are placed only in the zone where the PVC's volume already exists. No new volume is created. If no node is available in that zone, the pod stays unscheduled rather than running elsewhere. |

To set this for a whole namespace or for specific workloads without changing their manifests, use the `scheduling.volumeSharedStorage` field of a [WorkloadConfig](/configuration/workload-policies#workloadconfig) instead of the label.

:::caution New volumes start empty
With `preferred`, a volume created in a new zone or cloud is a fresh, empty volume. Data is not copied or replicated between the volumes of the same PVC. If every replica must see the same data, use `required`, or use a shared file system or object storage instead.
:::

When the PVC is deleted, JellyCloud cleans up all of its volumes across every provider and zone.

## Static PVCs

A static PVC is a `PersistentVolumeClaim` that binds to a specific, pre-provisioned `PersistentVolume` by name. Rather than relying on a provisioner to create a volume on demand, the PV must already exist in the cluster before the claim is applied.

You can identify a static PVC by `storageClassName` set to an explicit empty string (`""`). This opts out of dynamic provisioning entirely: Kubernetes will not invoke a provisioner and will only bind to a pre-existing PV. Note that omitting `storageClassName` altogether is different: in that case Kubernetes falls back to the cluster's default storage class and may still trigger dynamic provisioning.

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: data-volume
spec:
  accessModes:
    - ReadWriteOnce
  storageClassName: ""         # explicit empty string disables dynamic provisioning
  volumeName: my-existing-pv  # optional: bind to a specific pre-created PV by name
  resources:
    requests:
      storage: 20Gi
```

Because a static PVC references a PV that already exists locally in the cluster, JellyCloud assumes the data resides on local infrastructure. Creating a remote volume in its place could result in data loss, so by default JellyCloud does not provision or migrate the volume remotely, and workloads with static PVCs are not scheduled on JellyCloud nodes.

### Running static PVCs on JellyCloud

You can opt a static PVC in to JellyCloud in one of two ways. Both are set on the `PersistentVolumeClaim` itself.

**Let JellyCloud manage the volume:** add the `jellycloud.io/managed: "true"` label to tell JellyCloud it may handle the claim like a dynamic PVC and provision the volume remotely.

```yaml
metadata:
  name: data-volume
  labels:
    jellycloud.io/managed: "true"
```

:::caution
With `jellycloud.io/managed`, JellyCloud provisions a new remote volume. Data in the local PV is not copied to it.
:::

**Use a Nebius shared file system:** if your data already lives in a Nebius Shared File System that is configured for your Nebius provider in JellyCloud, add the `volume.jellycloud.io/existing` annotation with the file system ID. JellyCloud mounts that file system instead of creating a volume. The ID must match the shared file system configured for the provider, and this option is available on Nebius only.

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: shared-data
  annotations:
    volume.jellycloud.io/existing: "computefilesystem-e00x23k4njh04yz1js"
spec:
  accessModes:
    - ReadWriteOnce
  storageClassName: ""
  resources:
    requests:
      storage: 10Gi
```

## Shared file systems (ReadWriteMany)

On Nebius, a PVC with access mode `ReadWriteMany` (RWX) or `ReadOnlyMany` (ROX) is provisioned as a Nebius [Shared File System](https://docs.nebius.com/kubernetes/storage/filesystem-over-csi) instead of a disk, and mounted on every node that runs a pod using the claim. Unlike a disk, a shared file system can be mounted by many pods at once, so all replicas see the same data. The mount path comes from the `volumeMounts` in your workload manifest, as with any other volume.

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: shared-models
spec:
  accessModes:
    - ReadWriteMany
  storageClassName: standard
  resources:
    requests:
      storage: 100Gi
```

## PVC Passthrough (self-hosted nodes)

PVC passthrough lets workloads running on self-hosted nodes use storage that is physically attached to the machine, for example a locally mounted disk or NFS share you have already set up. JellyCloud ensures that the volume defined in the workload is mounted to the storage on the self-hosted node.

### How it works

The passthrough annotation goes on the **pod template** of your `Deployment` or `StatefulSet`. The annotation value is a JSON object that maps each volume name (as declared in `spec.template.spec.volumes`) to the physical path where that storage is mounted on the self-hosted machine.

```yaml
volume.jellycloud.io/passthrough: '{"<volume-name>": {"path": "<host-path>"}}'
```

### Single volume example

In this example, the volume `data-volume` is mounted at `/mnt/data` on the self-hosted node:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: data-processor
spec:
  replicas: 1
  selector:
    matchLabels:
      app: data-processor
  template:
    metadata:
      labels:
        app: data-processor
      annotations:
        volume.jellycloud.io/passthrough: '{"data-volume": {"path": "/mnt/data"}}'
    spec:
      containers:
        - name: processor
          image: my-image:latest
          volumeMounts:
            - name: data-volume
              mountPath: /data
      volumes:
        - name: data-volume
          hostPath:
            path: /mnt/data
```

### Multiple volumes example

List all passthrough volumes in the same JSON object, one entry per volume:

```yaml
annotations:
  volume.jellycloud.io/passthrough: |
    {
      "model-weights": {"path": "/mnt/models"},
      "scratch-disk":  {"path": "/mnt/scratch"}
    }
```

The corresponding `volumes` section must declare each named volume:

```yaml
volumes:
  - name: model-weights
    hostPath:
      path: /mnt/models
  - name: scratch-disk
    hostPath:
      path: /mnt/scratch
```

### Storage must be present on every eligible node

The physical path specified in the annotation must be mounted and accessible on **every self-hosted node that the workload could be scheduled to**. JellyCloud does not provision or verify the storage. It only passes the reference through. If the path is absent on the target node, the node agent rejects the pod and the failure propagates back to the cluster as a scheduling error.

To avoid this, either ensure the path exists on all candidate nodes, or use node selectors or affinity rules to pin the workload to the specific nodes where the storage is present.

## Block device volumes

Kubernetes supports block devices as local volumes (`volumeMode: Block`). JellyCloud passes these through to the node agent. No additional configuration is needed. Use standard Kubernetes block volume definitions and JellyCloud will handle them alongside file-based volumes.

## Volume lifecycle on cluster disconnect

When a cluster is disconnected from JellyCloud, the Operator cleans up workloads, controllers, services, and internal state. Persistent Volumes are explicitly excluded from this cleanup.

JellyCloud-managed volumes are not deleted when the cluster disconnects. They are retained and remain accessible to the cluster. If the cluster is permanently disconnected and never reconnects, JellyCloud cleans up the orphaned volumes after a 24-hour window.

This means you can safely disconnect and reconnect a cluster without losing data attached to PVCs managed by JellyCloud.
