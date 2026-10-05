---
id: nodes-and-node-pools
title: Nodes and Node Pools
sidebar_position: 2
---

# Nodes and Node Pools

JellyCloud runs workloads on two kinds of compute:

- **Self-hosted nodes:** machines you already have, such as on-premises servers or existing cloud VMs, registered with the JellyCloud agent.
- **Node Pools:** compute that JellyCloud provisions and scales for you in a connected cloud provider.

The [Quick Start](/quick-start#2-add-instances-aka-nodes) covers the basic setup for both. This page describes the additional options.

## Self-hosted nodes

To get the installation command, click **Add** in the top-right corner of the Console and select **Add Node**. Run it on each machine with elevated privileges (as `root` or via `sudo`). Check [Supported Platforms](/supported-platforms) first to confirm your OS and hardware are supported.

```bash
curl -sSLf 'https://api.prod.jellycloud.io/agent/install.sh' | sudo env JELLY_API_KEY=<API-Key> sh
```

### Run as a startup script

To register VMs automatically when they boot, use the command as a VM startup script or a cloud-init script. Prepend `#!/bin/bash` so the shell interprets it correctly:

```bash
#!/bin/bash
<paste the installation command here>
```

### Override provider information

By default, the agent detects the instance's provider information (provider name, region, zone, and so on) automatically. To set these values yourself, add any of the following variables to the command, after `JELLY_API_KEY`:

| Variable | Description |
|---|---|
| `JELLY_PROVIDER_NAME` | Provider name |
| `JELLY_PROVIDER_REGION` | Node region |
| `JELLY_PROVIDER_ZONE` | Node zone |
| `JELLY_PROVIDER_GROUP` | Node group |
| `JELLY_PROVIDER_TAGS` | Node tags, as an object (e.g. `{team: ml, env: prod}`). Use `{}` to set an empty tag list. |

Each variable behaves as follows:

- **Not set:** the value is detected automatically.
- **Set to a value:** the detected value is overridden.
- **Set to an empty value** (e.g. `JELLY_PROVIDER_ZONE=`): the field is left empty in the provider information.

For example, to register an on-premises server with a custom provider name, region, and tags:

```bash
curl -sSLf 'https://api.prod.jellycloud.io/agent/install.sh' | sudo env \
  JELLY_API_KEY=<API-Key> \
  JELLY_PROVIDER_NAME=onprem \
  JELLY_PROVIDER_REGION=eu-west \
  JELLY_PROVIDER_TAGS='{team: ml, env: prod}' \
  sh
```

## Node Pools

Node Pools let JellyCloud provision and scale compute in your connected cloud providers. You can create as many Node Pools as you need, and each pool can use a different cloud provider, project, or subscription. To target a specific pool from your workloads, use `nodePools` in a [WorkloadConfig](/configuration/workload-policies#workloadconfig).

### Location

- **Subscription, compartment, or project:** each Node Pool provisions into one subscription (Azure), compartment (Oracle), or project (GCP and other providers). Pick an existing entry or add a new one inline. Entries are managed in the provider's settings, and an entry cannot be deleted while a Node Pool uses it.
- **Regions and zones:** choose one or more regions and availability zones, ordered by priority. JellyCloud provisions new instances in that order, starting with the first region and moving to the next only when the previous one cannot fulfill the request.

### Capacity type

- **On-Demand:** stable, always-available capacity. Instances are not reclaimed by the provider.
- **Spot:** significantly lower cost, with the trade-off that instances can be reclaimed by the cloud provider. JellyCloud handles revocation automatically: when a spot instance is about to be terminated, JellyCloud drains the node and reschedules affected pods before the instance is lost.
- **Spot First:** JellyCloud hunts for spot availability across all selected regions. If no spot capacity is found in any region, it falls back to On-Demand automatically. This gives you the cost savings of spot when available, without sacrificing availability.

### Advanced Settings

Open **Advanced Settings** when creating or editing a Node Pool to fine-tune its nodes. All settings apply to every node the pool provisions.

- **OS Image:** a default is pre-selected based on your workload type: Ubuntu 24.04 and up for General Compute nodes, and an Ubuntu image with CUDA drivers for GPU nodes. You can change it from the list of images supported by your chosen cloud provider. On Azure, NVIDIA drivers are provided automatically. See [Node Pools on Azure](/cloud-providers/azure#node-pools-on-azure).
- **OS Disk:** set the disk size that fits your needs, or leave it empty for JellyCloud to calculate it based on the selected image.
- **Custom labels:** key and value pairs added to each node, so your existing `nodeSelector` and `nodeAffinity` rules match the pool's nodes without changes (e.g. `gpu: true` or `nvidia.com/product: L40S`). You can add multiple labels.
- **Taints:** standard Kubernetes [taints](https://kubernetes.io/docs/concepts/scheduling-eviction/taint-and-toleration/) added to each node, so only workloads with a matching toleration are scheduled there. Each taint has a key, an optional value, and an effect: `NoSchedule`, `PreferNoSchedule`, or `NoExecute`. You can add multiple taints, and the same key can appear more than once with different effects (e.g. `dedicated=gpu:NoSchedule` and `dedicated=gpu:NoExecute`). This is useful for keeping workloads apart across node types, such as A10 and H100 nodes.

Label and taint keys and values follow the standard Kubernetes format.

### Manage a Node Pool

After creation, you can enable, disable, rename, or delete a Node Pool from its card menu in the Console. Disabling a Node Pool stops autoscaling for that pool. Existing nodes continue running, but no new nodes are provisioned until the pool is re-enabled.

### Scale-down behavior

The Autoscaler removes nodes that are no longer needed. General Compute nodes are consolidated when their CPU and memory utilization drops below 30%. GPU nodes are removed once they have no running workloads.
