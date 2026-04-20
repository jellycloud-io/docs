---
id: persistent-volumes
title: Persistent Volumes
sidebar_position: 5
---

# Persistent Volumes

JellyCloud automates the handling of Persistent Volume Claims (PVCs) defined for workloads and pods deployed on the platform. Volumes follow the pods: they are always provisioned on the same physical location as the pods that use them. JellyCloud follows standard Kubernetes principles, so you continue managing PVCs the same way you always have — using standard `PersistentVolumeClaim` manifests, storage classes, and lifecycle rules. No changes to your existing workflows are required.

## Dynamic PVC

A dynamic PVC is a `PersistentVolumeClaim` that references a `storageClassName`. When the claim is created, Kubernetes hands it to the storage provisioner associated with that class, which automatically creates a matching `PersistentVolume` and binds it to the claim. No pre-provisioned volume needs to exist — the provisioner creates it on demand. If a suitable unbound PV already exists in the cluster, Kubernetes may bind to that instead.

You can identify a dynamic PVC by the presence of `storageClassName` in the spec:

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: data-volume
spec:
  accessModes:
    - ReadWriteOnce
  storageClassName: standard   # presence of this field makes it dynamic
  resources:
    requests:
      storage: 20Gi
```

When a `Deployment` or `StatefulSet` referencing a dynamic PVC is applied, the volume is provisioned automatically and bound before the pods start. It exists for the lifetime of the claim and is deleted when the PVC is deleted, following the standard Kubernetes PV lifecycle.

### JellyCloud internals

Since the volume must reside on the same physical location as the pods, the JellyCloud Operator detects the presence of a dynamic PVC and ensures all pods of the workload are scheduled at the same location — same cloud provider and region.

:::note
JellyCloud can run pods with PVCs on supported cloud providers only. See the [Cloud Providers](/cloud-providers) page for the current list.
:::

Because of this co-location requirement, JellyCloud applies an all-or-nothing rule: either all pods of a deployment with a PVC run on JellyCloud at the same location, or none of them do. Splitting pods across locations or between JellyCloud and non-JellyCloud nodes is not permitted when a PVC is involved.

To implement this, JellyCloud creates a corresponding internal PVC and PV pair in the cluster. These objects are named after the original claim with a `-jc` suffix appended. Their lifecycle is tied to the original objects and managed entirely by the JellyCloud Operator — you do not need to interact with them directly.

The original PVC submitted by the user remains in the cluster and continues to represent the user's intent. The `-jc` objects are the binding layer that connects it to the remote volume.

You can observe both sets of objects with `kubectl`:

```
$ kubectl get pvc -A
NAMESPACE   NAME              STATUS    VOLUME                    CAPACITY   ACCESS MODES   STORAGECLASS
vllm        vllm-models       Pending                                                       gp2-storage
vllm        vllm-models-jc    Bound     vllm-vllm-models-jc      50Gi       RWO            jelly-storage

$ kubectl get pv
NAME                      CAPACITY   ACCESS MODES   RECLAIM POLICY   STATUS   CLAIM                    STORAGECLASS
vllm-vllm-models-jc      50Gi       RWO            Delete           Bound    vllm/vllm-models-jc      jelly-storage
```

In this example, `vllm-models` is the user-submitted PVC — it remains `Pending` intentionally, as local storage allocation is bypassed with the actual volume provisioned remotely by JellyCloud. `vllm-models-jc` is the JellyCloud-managed object that is `Bound` to the remotely provisioned volume.

## Static PVC

A static PVC is a `PersistentVolumeClaim` that binds to a specific, pre-provisioned `PersistentVolume` by name. Rather than relying on a provisioner to create a volume on demand, the PV must already exist in the cluster before the claim is applied.

You can identify a static PVC by `storageClassName` set to an explicit empty string (`""`). This opts out of dynamic provisioning entirely — Kubernetes will not invoke a provisioner and will only bind to a pre-existing PV. Note that omitting `storageClassName` altogether is different: in that case Kubernetes falls back to the cluster's default storage class and may still trigger dynamic provisioning.

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

Because a static PVC references a PV that already exists locally in the cluster, JellyCloud assumes the data resides on local infrastructure. Creating a remote volume in its place would result in data loss, so JellyCloud does not attempt to provision or migrate the volume remotely. Workloads with static PVCs will not be scheduled on JellyCloud nodes.

:::caution Coming soon
Support for data replication based on user intent — enabling static PVC workloads to run on JellyCloud nodes — is planned and will be documented here when available.
:::

## Object Storage

Object storage is accessed via SDK rather than mounted as a filesystem. The AWS S3 SDK is the most common example, but the same pattern applies to other providers such as GCS or Azure Blob Storage.

Unlike block or file volumes, object storage remains in its original location. Pods running on remote JellyCloud nodes access it directly over the network, the same way they would from any other environment. JellyCloud handles the underlying connectivity between the remote nodes and the object storage endpoint, and preserves the original identity and access management configuration. No changes are required to your application code, SDK calls, or IAM policies — the experience is seamless from the workload's perspective.

This applies to private object storage as well. The storage endpoint does not need to be publicly accessible. JellyCloud routes traffic through its secure transport layer, so private buckets and endpoints work without any changes to their access or network configuration.
