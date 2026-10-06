---
id: quick-start
title: Quick Start
sidebar_position: 2
---

# Quick Start

Get your first workload running on JellyCloud in minutes.

## 1. Create your account

Start by signing up for a JellyCloud account through the Console.

<ConsoleButton path="/signup">Open Console →</ConsoleButton>

Fill in the sign-up form and click **Create Account**.

:::tip Fields worth noting
- **Tenant name:** a tenant corresponds to a cloud account. If you operate multiple tenants (e.g. dev and prod), each gets its own name.
- **Tenant color:** a visual label to help distinguish between tenants at a glance, handy when you're working across more than one account.
- **Country:** select the country where your organization is based. This is used for billing and compliance purposes.
:::

JellyCloud will send a confirmation code to your email. Enter it to activate your account. Once your account is activated, you will be redirected to the Console and are ready to connect your infrastructure.

### Enable MFA (recommended for production)

JellyCloud supports optional multi-factor authentication using an authenticator app or email verification. MFA is not required, but it is strongly recommended for any account running production workloads.

You can enable it at any time in **Settings** within the Console.

## 2. Add instances (aka Nodes)

To run your workloads, you need to connect instances. Use the **Add** button in the top-right corner to connect compute. You have two options:

### Self-Install

Self-install is the right option when you have existing compute that you want to bring into JellyCloud. This includes on-premises servers, existing cloud VMs, or any cloud provider not yet natively supported by JellyCloud.

1. Check the [Supported Platforms](/supported-platforms) page to confirm your OS is supported and your instance meets the minimum hardware requirements.
2. In the Console, click **Add** in the top-right corner and select **Add Node**. Copy the installation command. It includes your tenant's API key and looks like this:

   ```bash
   curl -sSLf 'https://api.prod.jellycloud.io/agent/install.sh' | sudo env JELLY_API_KEY=<API-Key> sh
   ```

3. Run the command on the target machine with elevated privileges (as `root` or via `sudo`). JellyCloud installs the agent and registers the instance automatically. You can reuse the same command for as many instances as you need.

:::warning Keep your installation command private
The command contains an API key unique to your tenant. Do not share it publicly or commit it to version control.
:::

To run the command as a VM startup script, or to override the detected provider information, see [Self-hosted nodes](/configuration/nodes-and-node-pools#self-hosted-nodes).

### Node Pools (Autoscaler)

Node Pools let JellyCloud automatically provision and scale compute on your behalf. Set your desired instance types, minimum and maximum node counts, and the Autoscaler handles the rest, scaling up when demand grows and back down when it subsides.

To create a Node Pool:

1. Click **Add** in the top-right corner and select **Add NodePool**.
2. Give it a name (e.g. `h100-eu-sovereign`). The name must be unique across your node pools.
3. Select the cloud provider you want to provision into. If the provider is not yet connected, you will be prompted to provide connection details at this step. See the [Cloud Providers](/cloud-providers) section for provider-specific instructions.
4. Select the subscription (Azure), compartment (Oracle), or project (GCP and other providers) to provision into.
5. Select one or more regions and zones, in priority order.
6. Choose the workload type: **GPU** for GPU-accelerated workloads, or **General Compute** for CPU-based workloads.
7. Select the machine configuration:
   - **General Compute:** choose a machine family, then select the specific machine size.
   - **GPU:** choose the GPU model, then select the instance with the number of GPU slots you need.
8. Select the capacity type: **On-Demand**, **Spot**, or **Spot First**.

For capacity types, Advanced Settings (OS image, OS disk, labels, and taints), and managing pools, see [Node Pools](/configuration/nodes-and-node-pools#node-pools).


## 3. Connect a Cluster

With your instances connected, you're ready to extend your Kubernetes cluster to run on JellyCloud-managed infrastructure.

**Requirements:** Your cluster needs at least one node with **2 vCPUs** and **4 GB memory** available to run the JellyCloud Operator. No network or firewall configuration is required.

:::tip Multiple clusters
You can connect any number of Kubernetes clusters to JellyCloud. All of them share the same pool of connected instances. Workloads across clusters remain fully isolated from one another.
:::

1. In the Console, click **Add** in the top-right corner, and select **Add Cluster**. JellyCloud will generate a Helm command with an auto-generated secret unique to your tenant.


   :::warning Keep your Helm command private
   The generated Helm command contains secrets unique to your tenant. Do not share it publicly, commit it to version control, or expose it in logs.
   :::

2. Copy the Helm command from the Console and run it on your cluster. The command installs the JellyCloud Operator into the `jelly` namespace and authenticates it using the embedded token. No extra configuration is needed.

   This sets up the cluster in seamless mode, where JellyCloud can schedule workloads in every namespace. To restrict JellyCloud to specific namespaces or change cluster-wide defaults, see [Cluster Setup](/configuration/cluster-setup).

3. The Operator takes a couple of minutes to initialize. Watch the rollout:

   ```bash
   kubectl -n jelly get pods --watch
   ```

   Wait until all pods show `Running`, then verify the cluster nodes:

   ```bash
   kubectl get nodes
   ```

   You'll see virtual nodes added by JellyCloud alongside your existing ones. Each node represents a group of instances sharing the same architecture. Run `kubectl describe node <node-name>` to inspect a node. Allocatable capacity reflects the actual resources of the instances you connected.

4. Your cluster is now ready. Run any standard Kubernetes `Deployment` or `StatefulSet` and JellyCloud will schedule it across the nodes and cloud providers of your choice. No changes to your manifests are required.

   ```bash
   kubectl apply -f my-deployment.yaml
   ```

   Don't have a deployment handy? Browse the [jelly-bites](https://github.com/jellycloud-io/jelly-bites) sample repository for ready-to-run sample applications.

5. Use your existing tools to manage workloads as you normally would:

   - **kubectl:** full CLI access to your cluster
   - **Kubernetes Dashboard:** standard dashboard works without modification
   - **JellyCloud Console:** provides additional observability for your workloads, including cross-cluster visibility, resource utilization, and instance health

## What's next

- **[Core Concepts](/core-concepts):** Understand workloads, networking, and storage primitives
- **[Supported Platforms](/supported-platforms):** See which cloud providers and runtimes are supported
- **[Cluster Setup](/configuration/cluster-setup):** Namespace-scoped access, cluster-wide defaults, and private registries
- **[Nodes and Node Pools](/configuration/nodes-and-node-pools):** Startup scripts, provider overrides, and advanced Node Pool settings
- **[Workload Policies](/configuration/workload-policies):** Fine-tune workload placement and node selection rules
- **[AI Serving](/ai-serving):** Deploy LLMs and ML models with GPU-aware scheduling
- **[jelly-bites](https://github.com/jellycloud-io/jelly-bites):** Ready-to-run sample applications
- **[Support](/support):** Contact the JellyCloud team
