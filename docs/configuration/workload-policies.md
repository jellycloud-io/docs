---
id: workload-policies
title: Workload Policies
sidebar_position: 4
---

# Workload Policies

JellyCloud orchestrates workload placement automatically, using built-in algorithms and best practices to select the most suitable remote nodes for each workload. In most cases, no configuration is needed.

For teams that need more control, Workload Policies let you fine-tune how JellyCloud selects and places workloads. Policies are defined with two JellyCloud custom resources:

- **`ClusterConfig`:** cluster-wide defaults, one per cluster. See [Cluster-wide defaults](/configuration/cluster-setup#cluster-wide-defaults-clusterconfig) in Cluster Setup.
- **`WorkloadConfig`:** overrides for a namespace or for specific workloads in it, described on this page.

Because policies live in their own resources, you can manage them centrally, for example in Git with Argo CD, without changing your workload manifests.

:::note Labels are still supported
The same settings can also be set as labels on a namespace or directly on a workload. This works, but is not recommended, because it spreads placement rules across many manifests. See [Labels and annotations](#labels-and-annotations).
:::

## How policies are applied

Settings are resolved field by field. Each level overrides only the fields it sets, and every unset field is inherited from the level before it. From lowest to highest precedence:

1. [`ClusterConfig`](/configuration/cluster-setup#cluster-wide-defaults-clusterconfig)
2. A `WorkloadConfig` without a `target` in the workload's namespace
3. Policy labels on the namespace
4. A `WorkloadConfig` that targets the workload (for example, its `Deployment`), then policy labels on that workload
5. A `WorkloadConfig` that targets the pod, then policy labels on the pod

When several `WorkloadConfig` resources match the same workload, a match by `name` wins over a match by `selector`. If there is still more than one, the one whose name comes first alphabetically is used.

## Mode of operation

The mode of operation controls whether JellyCloud schedules workloads by default or only when explicitly instructed:

- **`allowed` (default):** JellyCloud attempts to schedule any workload in the cluster. To exclude a namespace or workload, set `mode: forbidden` in a `WorkloadConfig` for it.
- **`forbidden`:** JellyCloud does not schedule any workload by default. Only namespaces or workloads with `mode: allowed` or `mode: required` in a `WorkloadConfig` are scheduled on JellyCloud nodes.

Set the cluster-wide mode in the [`ClusterConfig`](/configuration/cluster-setup#cluster-wide-defaults-clusterconfig), and override it per namespace or workload with a `WorkloadConfig`.

## WorkloadConfig

A `WorkloadConfig` is a namespaced resource. It applies to workloads in its own namespace only.

### Apply to a whole namespace

Leave out `target` to set defaults for every workload in the namespace. This example runs all workloads in the `data` namespace only on JellyCloud nodes in GCP:

```yaml
apiVersion: controller.jellycloud.io/v1alpha1
kind: WorkloadConfig
metadata:
  name: data-defaults
  namespace: data
spec:
  scheduling:
    mode: required
    providers: [ "GCP" ]
```

### Apply to specific workloads

Add a `target` with the workload `kind` and exactly one of `name` or `selector`. Supported kinds are `Deployment`, `StatefulSet`, `DaemonSet`, `ReplicaSet`, `Job`, `CronJob`, and `Pod`.

By name, this example places the `data-aws` Deployment in the `aws-compute` Node Pool:

```yaml
apiVersion: controller.jellycloud.io/v1alpha1
kind: WorkloadConfig
metadata:
  name: data-aws
  namespace: data
spec:
  target:
    kind: Deployment
    name: data-aws
  scheduling:
    mode: required
    autoscaler: allowed
    nodePools: [ "aws-compute" ]
```

By label selector, this example keeps every Deployment labeled `tier: batch` off JellyCloud nodes:

```yaml
apiVersion: controller.jellycloud.io/v1alpha1
kind: WorkloadConfig
metadata:
  name: batch-local-only
  namespace: data
spec:
  target:
    kind: Deployment
    selector:
      matchLabels:
        tier: batch
  scheduling:
    mode: forbidden
```

## Settings reference

The following fields are available under `spec.scheduling` and `spec.network` in both `ClusterConfig` and `WorkloadConfig`.

| Field | Values | Description |
|---|---|---|
| `scheduling.mode` | `allowed` (default) \| `required` \| `forbidden` | **`allowed`:** pods run on JellyCloud or regular nodes, depending on `priority`. **`required`:** pods run only on JellyCloud nodes. **`forbidden`:** pods never run on JellyCloud nodes. |
| `scheduling.priority` | `first` (default) \| `last` | Applies when `mode` is `allowed`. **`first`:** JellyCloud nodes are preferred. **`last`:** JellyCloud nodes are used only if no regular node can take the pod. |
| `scheduling.autoscaler` | `allowed` (default) \| `undesirable` \| `forbidden` | **`allowed`:** pods may run on nodes the Autoscaler provisions. **`undesirable`:** autoscaled nodes are used only if no existing node is available. **`forbidden`:** pods never trigger or use autoscaled nodes. |
| `scheduling.volumeSharedStorage` | `preferred` (default) \| `required` | Placement of pods that share a PVC. See [Shared PVC across pods and replicas](/configuration/volumes#shared-pvc-across-pods-and-replicas). |
| `scheduling.allowGPUNodes` | `true` \| `false` (default) | Allows pods that do not request GPUs to run on GPU nodes. |
| `scheduling.providers` | List of provider names | Run only on JellyCloud nodes from these cloud providers. |
| `scheduling.regions` | List of region names | Run only on JellyCloud nodes in these regions. |
| `scheduling.nodePools` | List of Node Pool names | Run only on JellyCloud nodes from these Node Pools. |
| `network.privateHostDetection` | `true` (default) \| `false` | Detects private hosts referenced in the pod definition. |
| `network.customPrivateHosts` | List of host names | Additional private hosts to add to the detected ones. |

:::note
`providers`, `regions`, and `nodePools` currently support a single value each.
:::

## Labels and annotations

Every scheduling setting can also be set with a label, on a namespace or on a workload. JellyCloud reads labels from the workload object (for example, the `Deployment` under `metadata.labels`) and from its pods (`spec.template.metadata.labels`). Labels override any `WorkloadConfig` at the same level, as described in [How policies are applied](#how-policies-are-applied).

:::caution Not recommended
Labels are supported for compatibility and quick tests. For anything long-lived, prefer a `WorkloadConfig`, so placement rules stay in one place and do not require changes to workload manifests.
:::

### Scheduling labels

| Label | Equivalent field | Values |
|---|---|---|
| `schedule.jellycloud.io/mode` | `scheduling.mode` | `allowed` \| `required` \| `forbidden` |
| `schedule.jellycloud.io/priority` | `scheduling.priority` | `first` \| `last` |
| `schedule.jellycloud.io/autoscaler` | `scheduling.autoscaler` | `allowed` \| `undesirable` \| `forbidden` |
| `volume.jellycloud.io/shared-storage` | `scheduling.volumeSharedStorage` | `preferred` \| `required` |
| `node-selector.jellycloud.io/provider` | `scheduling.providers` | Cloud provider name |
| `node-selector.jellycloud.io/region` | `scheduling.regions` | Region name |
| `node-selector.jellycloud.io/node-pool` | `scheduling.nodePools` | Node Pool name |
| `node-selector.jellycloud.io/node-id` | None | Schedule only on the specified node ID. |
| `node-selector.jellycloud.io/node-name` | None | Schedule only on the named static node. |
| `node-selector.jellycloud.io/accelerator` | None | Restrict scheduling to nodes with the specified GPU model. |

For example, to target a provider and region for every workload in a namespace:

```bash
kubectl label namespace team-a node-selector.jellycloud.io/provider=GCP
kubectl label namespace team-a node-selector.jellycloud.io/region=us-east1
```

### Annotations

| Annotation | Set on | Description |
|---|---|---|
| `schedule.jellycloud.io/allow-gpu-nodes` | Workload or pod | Equivalent to `scheduling.allowGPUNodes`. |
| `network.jellycloud.io/private-host-detection` | Workload or pod | Equivalent to `network.privateHostDetection`. |
| `network.jellycloud.io/custom-private-hosts` | Workload or pod | Equivalent to `network.customPrivateHosts`. Separate hosts with commas or spaces. |
| `volume.jellycloud.io/passthrough` | Pod template | Maps volume names to physical host paths on self-hosted nodes. See [PVC Passthrough](/configuration/volumes#pvc-passthrough-self-hosted-nodes). |
| `volume.jellycloud.io/existing` | `PersistentVolumeClaim` | Binds a static PVC to an existing cloud volume or shared file system. See [Running static PVCs on JellyCloud](/configuration/volumes#running-static-pvcs-on-jellycloud). |

### Storage labels

| Label | Set on | Description |
|---|---|---|
| `jellycloud.io/managed` | `PersistentVolumeClaim` | Set to `"true"` on a static PVC to let JellyCloud provision the volume remotely. See [Running static PVCs on JellyCloud](/configuration/volumes#running-static-pvcs-on-jellycloud). |
