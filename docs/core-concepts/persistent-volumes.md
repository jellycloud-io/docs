---
id: persistent-volumes
title: Persistent Volumes
sidebar_position: 5
---

# Persistent Volumes

JellyCloud automates the handling of Persistent Volume Claims (PVCs) defined for workloads and pods deployed on the platform. Volumes follow the pods: they are always provisioned on the same physical location as the pods that use them. JellyCloud follows standard Kubernetes principles, so you continue managing PVCs the same way you always have, using standard `PersistentVolumeClaim` manifests, storage classes, and lifecycle rules. No changes to your existing workflows are required.

## Dynamic PVC

A dynamic PVC is a `PersistentVolumeClaim` that references a `storageClassName`. When the claim is created, Kubernetes hands it to the storage provisioner associated with that class, which automatically creates a matching `PersistentVolume` and binds it to the claim. No pre-provisioned volume needs to exist: the provisioner creates it on demand. If a suitable unbound PV already exists in the cluster, Kubernetes may bind to that instead.

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

A volume must reside in the same location as the pod that uses it: the same cloud provider and zone. The JellyCloud Operator detects workloads with a dynamic PVC and places their pods where a volume for the claim exists or can be created.

:::note
JellyCloud can run pods with PVCs on supported cloud providers only. See the [Cloud Providers](/cloud-providers) page for the current list.
:::

Whether all pods that share a claim must stay with one volume, or may get a volume of their own in another zone, is controlled by the [shared storage](/configuration/volumes#shared-pvc-across-pods-and-replicas) setting. Pods that share a claim are not split between JellyCloud and non-JellyCloud nodes.

To implement this, JellyCloud creates a corresponding internal PVC and PV pair in the cluster. These objects are named after the original claim with a `-jc` suffix appended. Their lifecycle is tied to the original objects and managed entirely by the JellyCloud Operator. You do not need to interact with them directly.

The original PVC submitted by the user remains in the cluster and continues to represent the user's intent. The `-jc` objects are the binding layer that connects it to the remote volume.

#### Deleting a PVC

JellyCloud adds a finalizer to the original PVC. The finalizer prevents the original PVC from being removed while its `-jc` counterpart still exists. When you delete the original PVC:

1. The `-jc` PVC is deleted automatically through its owner reference.
2. The `-jc` PV is deleted along with it.
3. JellyCloud removes the finalizer and the original PVC is deleted.

Because of this sequence, a deleted PVC may briefly show as `Terminating`. This is expected and needs no action.

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

In this example, `vllm-models` is the user-submitted PVC. It remains `Pending` intentionally, as local storage allocation is bypassed with the actual volume provisioned remotely by JellyCloud. `vllm-models-jc` is the JellyCloud-managed object that is `Bound` to the remotely provisioned volume.

## Static PVC

A static PVC binds to a specific, pre-provisioned `PersistentVolume` instead of having one created on demand. You can identify it by `storageClassName` set to an explicit empty string (`""`). Because a static PVC usually points at data on local infrastructure, JellyCloud does not schedule workloads that use one on JellyCloud nodes by default. To opt a static PVC in, see [Static PVCs](/configuration/volumes#static-pvcs).

## Volume types by cloud

When a pod with a dynamic PVC lands on a JellyCloud node, JellyCloud creates a general-purpose block volume in the same cloud and zone as the node, and attaches it to that node.

| Cloud | Volume created |
|---|---|
| AWS | EBS `gp3` |
| Microsoft Azure | Managed Disk, Premium SSD (`Premium_LRS`) |
| Google Cloud | Persistent Disk `pd-balanced`, or Hyperdisk Balanced on machine families that require Hyperdisk (for example, C4, N4, and A3) |
| Oracle Cloud | Block Volume, Balanced performance |
| Nebius | Network SSD disk |
| Crusoe | Persistent SSD |
| DigitalOcean | Block Storage Volume |
| Civo | Civo Volume |
| Hetzner | Hetzner Cloud Volume |

Volumes are zonal: a volume can be attached only to a node in the same zone. Very small requests may be rounded up to the cloud provider's minimum volume size.

## Access modes and attachment

**Single attachment (`ReadWriteOnce`):** block volumes on every supported cloud attach to one node at a time. Pods that share the same claim are placed with the node where the volume lives, or get a volume of their own, depending on the [shared storage](/configuration/volumes#shared-pvc-across-pods-and-replicas) setting.

**Multiple attachment (`ReadWriteMany`, `ReadOnlyMany`):** a claim that many nodes mount at once needs a shared file system rather than a block volume. JellyCloud supports this where the cloud provides a shared file system storage option, currently Nebius Shared File Systems. See [Shared file systems](/configuration/volumes#shared-file-systems-readwritemany).

## Object Storage

Object storage is accessed via SDK rather than mounted as a filesystem. The AWS S3 SDK is the most common example, but the same pattern applies to other providers such as GCS or Azure Blob Storage.

Unlike block or file volumes, object storage remains in its original location. Pods running on remote JellyCloud nodes access it directly over the network, the same way they would from any other environment. JellyCloud handles the underlying connectivity between the remote nodes and the object storage endpoint, and preserves the original identity and access management configuration. No changes are required to your application code, SDK calls, or IAM policies. The experience is seamless from the workload's perspective.

This applies to private object storage as well. The storage endpoint does not need to be publicly accessible. JellyCloud routes traffic through its secure transport layer, so private buckets and endpoints work without any changes to their access or network configuration.
