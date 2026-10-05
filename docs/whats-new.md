---
id: whats-new
title: What's New
sidebar_position: 3
---

# What's New

A summary of notable JellyCloud features and improvements, newest first. Follow the links for full details.

## September 2026

### New

- **Central policy management:** define scheduling policies with the new `ClusterConfig` and `WorkloadConfig` resources, for the whole cluster, a namespace, or specific workloads selected by name or label. Manage them in one place, for example in Git with Argo CD, without changing workload manifests. See [Workload Policies](/configuration/workload-policies).
- **Oracle Cloud and Nebius:** connect two more cloud providers. See [Oracle Cloud](/cloud-providers/oracle) and [Nebius](/cloud-providers/nebius).
- **Node Pools 2.0:** create as many Node Pools as you need, each with its own subscription, project, or compartment. Pools can now be renamed and deleted. See [Node Pools](/configuration/nodes-and-node-pools#node-pools).
- **Custom labels and taints on Node Pools:** apply Kubernetes labels and taints to every node a pool provisions, so existing `nodeSelector` rules and tolerations work unchanged. See [Node Pools](/configuration/nodes-and-node-pools#node-pools).
- **Simpler agent install:** a shorter installation command, with optional variables to override the detected provider, region, zone, group, and tags. See [Self-Install](/configuration/nodes-and-node-pools#self-hosted-nodes).
- **Static PVCs on JellyCloud:** run workloads with static PVCs by binding them to an existing cloud volume or letting JellyCloud manage the volume. See [Running static PVCs on JellyCloud](/configuration/volumes#running-static-pvcs-on-jellycloud).
- **Shared file systems on Nebius:** `ReadWriteMany` and `ReadOnlyMany` PVCs are provisioned as Nebius Shared File Systems. See [Shared file systems](/configuration/volumes#shared-file-systems-readwritemany).
- **Amazon ECR and EKS:** pull private images from Amazon ECR, and connect EKS clusters, including clusters with Karpenter-managed nodes. See [EKS](/configuration/cluster-setup#eks-amazon-elastic-kubernetes-service).

### Improved

- **Shared storage placement:** a PVC can now be backed by several volumes, and pods prefer nodes where a volume already exists. See [Shared PVC across pods and replicas](/configuration/volumes#shared-pvc-across-pods-and-replicas).
- **Volumes survive cluster disconnect:** persistent volumes are retained when a cluster disconnects. See [Volume lifecycle on cluster disconnect](/configuration/volumes#volume-lifecycle-on-cluster-disconnect).
- **Selective mode without restarts:** namespace access changes apply automatically, and the Console warns you before removing a namespace with running pods. See [Selective mode](/configuration/cluster-setup#selective-rbac).
- **GPU Node Pools on Azure:** NVIDIA drivers are provided automatically. You only choose the Linux distribution. See [Node Pools on Azure](/cloud-providers/azure#node-pools-on-azure).
- **Simpler GCP onboarding:** three predefined roles, with clear prerequisites. See [Google Cloud](/cloud-providers/gcp).
- **Richer node details:** the Console shows each node's VM type, Spot or On Demand capacity, and GPU model and VRAM. See [Viewing remote nodes](/core-concepts/jelly-nodes#viewing-remote-nodes).

## August 2026

### New

- **AWS:** connect your AWS account using an IAM role that JellyCloud assumes. No long-lived access keys are stored. See [AWS](/cloud-providers/aws).
- **Namespace-level policies:** label a namespace once to set scheduling defaults for every workload in it. See [Scheduling labels](/configuration/workload-policies#scheduling-labels).
- **Mode of operation:** choose whether JellyCloud schedules workloads by default (`allowed`) or only on request (`forbidden`), at cluster, namespace, or workload level. See [Mode of operation](/configuration/workload-policies#mode-of-operation).
- **Private registries:** service account `imagePullSecrets`, Google Artifact Registry through GCP Workload Identity, and AKS clusters with multiple managed identities. See [Private registry](/configuration/cluster-setup#private-registry).
- **Disconnecting a cluster:** a documented way to remove JellyCloud from a cluster. See [Disconnecting a cluster](/configuration/cluster-setup#disconnecting-a-cluster).

### Improved

- **Policies v2:** a unified label schema with the `schedule.jellycloud.io` and `node-selector.jellycloud.io` families. See [Workload Policies](/configuration/workload-policies).
- **Least-privilege custom roles:** the minimum permissions for GCP and Azure custom roles. See [Google Cloud](/cloud-providers/gcp#custom-role-minimum-required-permissions) and [Microsoft Azure](/cloud-providers/azure#custom-role-minimum-required-permissions).

## July 2026

### New

- **Microsoft Azure and DigitalOcean:** two new cloud providers. See [Microsoft Azure](/cloud-providers/azure) and [DigitalOcean](/cloud-providers/digitalocean).
- **Spot and Spot First capacity:** run Node Pools on Spot instances, with automatic draining before revocation, or let JellyCloud find Spot capacity and fall back to On-Demand. See [Node Pools](/configuration/nodes-and-node-pools#node-pools).
- **Multi-region Node Pools:** select several regions and zones in priority order. See [Node Pools](/configuration/nodes-and-node-pools#node-pools).
- **Deployment methods:** install with the automated Supervisor, or manage the Helm charts yourself with ArgoCD or CI pipelines. See [Deployment methods](/configuration/cluster-setup#deployment-methods).
- **Node-to-node connectivity control:** enable or disable direct S2S connections between nodes. See [Security](/core-concepts/security#node-to-node-connectivity-s2s).

### Improved

- **Block device volumes:** `volumeMode: Block` volumes are supported. See [Block device volumes](/configuration/volumes#block-device-volumes).
- **Enable and disable Node Pools:** pause autoscaling for a pool without deleting it.
- **Selective mode setup:** a dedicated Helm chart for granting namespace access. See [Selective mode](/configuration/cluster-setup#selective-rbac).

## June 2026

### New

- **Hetzner:** a new cloud provider. See [Hetzner](/cloud-providers/hetzner).
- **Node Pools (Autoscaler):** JellyCloud provisions and scales compute for you. See [Node Pools](/configuration/nodes-and-node-pools#node-pools).
- **Selective access mode:** limit JellyCloud to the namespaces you choose. See [Cluster Setup](/configuration/cluster-setup#access-modes) and [Security](/core-concepts/security).
- **PVC passthrough:** mount storage that is already attached to self-hosted nodes. See [PVC Passthrough](/configuration/volumes#pvc-passthrough-self-hosted-nodes).

## May 2026

### New

- **Cloud providers:** Google Cloud, Civo, and Crusoe. See [Cloud Providers](/cloud-providers).
- **Persistent volumes:** dynamic PVCs follow your pods to remote nodes, and object storage works without changes. See [Persistent Volumes](/core-concepts/persistent-volumes).
- **Scheduling policies:** control where workloads run with `schedule.jellycloud.io` and `node-selector.jellycloud.io` labels. See [Workload Policies](/configuration/workload-policies).
