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

To get the installation link, click **Add** in the top-right corner and select **Add Node**. Copy the generated link and run it on the target machine. JellyCloud will install the required agent and register the instance automatically.

If you plan to use the link as a VM startup script or a cloud-init script, prepend `#!/bin/bash` before the link so the shell interprets it correctly:

```bash
#!/bin/bash
<paste the installation link here>
```

:::warning Keep your installation link private
The link contains a token unique to your tenant. Do not share it publicly or commit it to version control.
:::

You can reuse the same link to register as many instances as you need. Make sure the installation script runs with elevated privileges (e.g. as `root` or via `sudo`), as it needs to install system-level components.

Before running the script, check the [Supported Platforms](/supported-platforms) page to confirm your OS is supported and your instance meets the minimum hardware requirements.

### Node Pools (Autoscaler)

Node Pools let JellyCloud automatically provision and scale compute on your behalf. Set your desired instance types, minimum and maximum node counts, and the Autoscaler handles the rest, scaling up when demand grows and back down when it subsides.

To create a Node Pool:

1. Click **Add** in the top-right corner and select **Add NodePool**.
2. Give it a name (e.g. `h100-eu-sovereign`). The name must be unique across your node pools and can be used as a node selector in workload manifests.
3. Select the cloud provider you want to provision into. If the provider is not yet connected, you will be prompted to provide connection details at this step. See the [Cloud Providers](/cloud-providers) section for provider-specific instructions.
4. Select the region(s): choose one or more regions and availability zones within the cloud. Order them by priority. When multiple regions or zones are selected, JellyCloud provisions new instances in that order, starting with the first region and moving to the next only when the previous one cannot fulfill the request.
5. Choose the workload type: **GPU** for GPU-accelerated workloads, or **General Compute** for CPU-based workloads.
6. Select the machine configuration:
   - **General Compute:** choose a machine family, then select the specific machine size.
   - **GPU:** choose the GPU model, then select the instance with the number of GPU slots you need.
7. Select the capacity type:
   - **On-Demand:** stable, always-available capacity. Instances are not reclaimed by the provider.
   - **Spot:** significantly lower cost, with the trade-off that instances can be reclaimed by the cloud provider. JellyCloud handles revocation automatically: when a spot instance is about to be terminated, JellyCloud drains the node and reschedules affected pods before the instance is lost.
   - **Spot First:** JellyCloud hunts for spot availability across all selected regions. If no spot capacity is found in any region, it falls back to On-Demand automatically. This gives you the cost savings of spot when available, without sacrificing availability.
8. Select the OS image. A default is pre-selected based on your workload type: Ubuntu 24.04 and up for General Compute nodes, and an Ubuntu image with CUDA drivers for GPU nodes. You can change this from the list of images supported by your chosen cloud provider.

   :::tip GPU startup time
   For GPU-accelerated nodes, choose an OS image that includes GPU drivers. Pre-installed drivers eliminate driver setup on first boot and reduce node startup time.
   :::
   
   :::tip Enable or disable a NodePool
   After creation, you can enable or disable a NodePool from its card menu in the Console. Disabling a NodePool stops autoscaling for that pool. Existing nodes continue running but no new nodes will be provisioned until the pool is re-enabled.
   :::

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

3. The Operator takes a couple of minutes to initialize. Watch the rollout:

   ```bash
   kubectl -n jelly get pods --watch
   ```

   Wait until all pods show `Running`, then verify the cluster nodes:

   ```bash
   kubectl get nodes
   ```

   You'll see virtual nodes added by JellyCloud alongside your existing ones. Each node represents a group of instances sharing the same architecture. Run `kubectl describe node <node-name>` to inspect a node — allocatable capacity reflects the actual resources of the instances you connected.

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
- **[Policies](/policies):** Fine-tune workload placement and node selection rules
- **[AI Serving](/ai-serving):** Deploy LLMs and ML models with GPU-aware scheduling
- **[jelly-bites](https://github.com/jellycloud-io/jelly-bites):** Ready-to-run sample applications
- **[Support](/support):** Contact the JellyCloud team
