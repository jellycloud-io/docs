---
id: index
title: Policies
sidebar_position: 1
---

# Policies

JellyCloud orchestrates workload placement automatically, using built-in algorithms and best practices to select the most suitable remote nodes for each workload. In most cases, no configuration is needed - the platform handles scheduling decisions transparently.

For teams that need more control, Policies let you fine-tune how JellyCloud selects and places workloads across nodes. Policies are expressed as labels on your workload manifests - no new API to learn.

## Mode of operation

The mode of operation controls whether JellyCloud schedules workloads by default or only when explicitly instructed. It can be configured at three levels, each overriding the one above:

1. **Cluster level:** applies to all workloads across the cluster unless overridden
2. **Namespace level:** overrides the cluster-level setting for all workloads in that namespace
3. **Deployment level:** overrides namespace and cluster settings for that specific workload (Deployment, StatefulSet, or Job)

The two cluster-level modes are:

- **`allowed` (default):** JellyCloud attempts to schedule any workload in the cluster. To exclude specific workloads or namespaces, set `schedule.jellycloud.io/mode: forbidden` at the namespace or deployment level.
- **`forbidden`:** JellyCloud does not schedule any workload by default. Only workloads or namespaces explicitly labeled `schedule.jellycloud.io/mode: allowed` or `required` will be scheduled on JellyCloud nodes.

### Configure cluster-level mode

Confirm the JellyCloud Operator is deployed and all pods in the `jelly` namespace are in `Running` state, then run:

```bash
kubectl patch clusterconfig.controller.jellycloud.io cluster-config --type merge \
  --patch '{"spec": {"scheduling": {"mode": "allowed"}}}'
```

Replace `allowed` with `forbidden` to switch modes.

:::note
`allowed` is the default mode. You only need to run this command to switch to `forbidden`, or to revert back to `allowed` after previously setting `forbidden`.
:::

JellyCloud defines two families of labels for workload- and namespace-level overrides:

- `schedule.jellycloud.io` - controls whether and how JellyCloud's scheduler is involved
- `node-selector.jellycloud.io` - fine-tunes which remote nodes a workload is placed on

## `schedule.jellycloud.io`

This family drives in-cluster scheduler decisions related to JellyCloud functionality. These labels are not forwarded to the server - they are evaluated locally within the cluster.

| Label | Values | Description |
|---|---|---|
| `schedule.jellycloud.io/mode` | `forbidden` \| `allowed` (default) \| `required` | **`forbidden`:** pods will not be scheduled on JellyCloud nodes. **`allowed`:** pods are scheduled on JellyCloud or regular nodes depending on priority. **`required`:** pods are scheduled only on JellyCloud nodes. |
| `schedule.jellycloud.io/priority` | `first` (default) \| `last` | Scheduling priority when mode is `allowed`. **`first`:** JellyCloud nodes are preferred. **`last`:** JellyCloud nodes are used only if no regular node is available. |
| `schedule.jellycloud.io/autoscaler` | `forbidden` \| `undesirable` \| `allowed` (default) | **`forbidden`:** pod will not run on a node that requires autoscaling. **`undesirable`:** autoscaling nodes are used only if no already-available node exists. **`allowed`:** pod may run on a node that requires autoscaling. |

## `node-selector.jellycloud.io`

This family controls workload placement on Jelly Nodes - which provider, region, pool, or individual node a workload lands on.

| Label | Values | Description |
|---|---|---|
| `node-selector.jellycloud.io/provider` | Cloud provider name | Restrict scheduling to the given cloud provider. |
| `node-selector.jellycloud.io/region` | Region name | Restrict scheduling to nodes in the specified region. |
| `node-selector.jellycloud.io/node-pool` | Node pool name | Restrict scheduling to nodes belonging to the specified node pool. |
| `node-selector.jellycloud.io/node-id` | Specific node ID | Schedule only on the specified node. |
| `node-selector.jellycloud.io/node-name` | Specific node name | Schedule only on the named static node. |
| `node-selector.jellycloud.io/accelerator` | GPU model name | Restrict scheduling to nodes with the specified GPU model. |

## Namespace-level policies

Policy labels can be applied directly to a Kubernetes namespace. When JellyCloud sees a label on a namespace, it treats it as a default for every workload in that namespace — no changes to individual pod manifests required.

Labels in scope for namespace-level policy:
- `schedule.jellycloud.io/mode`
- `schedule.jellycloud.io/priority`
- `node-selector.jellycloud.io/provider`
- `node-selector.jellycloud.io/region`

Apply labels to a namespace with `kubectl`:

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

        # Require JellyCloud-only scheduling:
        # schedule.jellycloud.io/mode: "required"

        # Prevent JellyCloud scheduling for this workload:
        # schedule.jellycloud.io/mode: "forbidden"

        # Uncomment to target a specific provider:
        # node-selector.jellycloud.io/provider: "Crusoe"
        # node-selector.jellycloud.io/provider: "GCP"
        # node-selector.jellycloud.io/provider: "CIVO"

        # Uncomment to restrict to a specific region within the cloud provider:
        # node-selector.jellycloud.io/region: "us-east-1"
```
