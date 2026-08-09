---
id: index
title: Policies
sidebar_position: 1
---

# Policies

JellyCloud orchestrates workload placement automatically, using built-in algorithms and best practices to select the most suitable remote nodes for each workload. In most cases, no configuration is needed - the platform handles scheduling decisions transparently.

For teams that need more control, Policies let you fine-tune how JellyCloud selects and places workloads across nodes. Policies are expressed as labels on your workload manifests - no new API to learn.

JellyCloud defines two families of labels:

- `schedule.jellycloud.io` - controls whether and how JellyCloud's scheduler is involved
- `node-selector.jellycloud.io` - fine-tunes which remote nodes a workload is placed on

## `schedule.jellycloud.io`

This family drives in-cluster scheduler decisions related to JellyCloud functionality. These labels are not forwarded to the server - they are evaluated locally within the cluster.

| Label | Values | Description |
|---|---|---|
| `schedule.jellycloud.io/allow` | `true` (default), `false` | Set to `false` to block a workload from JellyCloud scheduling entirely. |
| `schedule.jellycloud.io` | `preferred` (default), `required` | `required` forces the workload onto a Jelly node. `preferred` allows it to fall back to non-Jelly nodes. |
| `schedule.jellycloud.io/autoscaler` | `true` (default), `false` | Set to `false` to restrict scheduling to already-available resources, without triggering autoscaling. |

## `node-selector.jellycloud.io`

This family controls workload placement on Jelly Nodes - which provider, region, pool, or individual node a workload lands on, and how the scheduler balances across them.

| Label | Values | Description |
|---|---|---|
| `node-selector.jellycloud.io/node-id` | Specific node ID | Schedule only on the specified node. |
| `node-selector.jellycloud.io/node-name` | Specific node name | Schedule only on the named static node. |
| `node-selector.jellycloud.io/node-pool` | Node pool name | Restrict scheduling to nodes belonging to the specified node pool. |
| `node-selector.jellycloud.io/provider` | Cloud provider name | Restrict scheduling to the given cloud provider. |
| `node-selector.jellycloud.io/region` | Region name | Restrict scheduling to nodes in the specified region of the specific provider. |
| `node-selector.jellycloud.io/category` | Node category | Restrict scheduling to nodes with the specified category. |
| `node-selector.jellycloud.io/accelerator` | Unified GPU model name | Restrict scheduling to nodes with the specified GPU model. |


## Namespace-level policies

Policy labels can be applied directly to a Kubernetes namespace. When JellyCloud sees a label on a namespace, it treats it as a default for every workload in that namespace — no changes to individual pod manifests required.

Labels in scope for namespace-level policy:
- `node-selector.jellycloud.io/provider`
- `node-selector.jellycloud.io/region`

Apply a label to a namespace with `kubectl`:

```bash
kubectl label namespace team-a node-selector.jellycloud.io/provider=GCP
kubectl label namespace team-a node-selector.jellycloud.io/region=us-east1
```

From that point on, every workload deployed into `team-a` is automatically targeted to the labeled provider and region, without any changes to the workload manifests.

**Precedence:** if a pod's own labels include the same key, the pod-level label wins. Namespace labels are applied only when the pod has no label for that key.

This is especially useful in multi-tenant clusters where each namespace belongs to a team or customer and should always run on a designated location.

## Annotations

In addition to labels, JellyCloud supports pod template annotations for controlling storage and volume behavior. Annotations go under `spec.template.metadata.annotations`, alongside any other pod annotations.

| Annotation | Values | Description |
|---|---|---|
| `volume.jellycloud.io/shared-storage` | `preferred` (default), `required` | Controls placement enforcement when multiple pods share a PVC. `required` prevents any pod from falling back to a non-JellyCloud node outside the PVC's bound location. See [Shared PVC across pods and replicas](/core-concepts/persistent-volumes#shared-pvc-across-pods-and-replicas) for details. |
| `volume.jellycloud.io/passthrough` | JSON object | Maps volume names to physical host paths on self-hosted nodes. See [PVC Passthrough](/core-concepts/persistent-volumes#pvc-passthrough-self-hosted-nodes) for details. |

## Example

JellyCloud labels are placed under `spec.template.metadata.labels` in your workload manifest — the same location as any other pod label. This is distinct from `metadata.labels` at the top level, which labels the Deployment object itself.

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: data-processing
  namespace: data
spec:
  replicas: 1
  selector:
    matchLabels:
      app: loadjob
  template:
    metadata:
      labels:
        app: loadjob
        # JellyCloud policy labels go here, alongside your existing pod labels

        # Uncomment to block JellyCloud scheduling for this workload:
        # schedule.jellycloud.io/allow: "false"

        # Uncomment to target a specific provider:
        # node-selector.jellycloud.io/provider: "Crusoe"
        # node-selector.jellycloud.io/provider: "GCP"
        # node-selector.jellycloud.io/provider: "CIVO"

        # Uncomment to restrict to a specific region within the cloud provider:
        # node-selector.jellycloud.io/region: "us-east-1"
```
