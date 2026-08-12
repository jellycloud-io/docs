---
id: cluster-deployment
title: Cluster Deployment
sidebar_position: 2
---

# Cluster Deployment

Connecting a cluster installs the JellyCloud Operator, which bridges your Kubernetes control plane with JellyCloud-managed infrastructure. Once connected, you choose how broadly the Operator can interact with your workloads: cluster-wide (seamless) or restricted to specific namespaces (selective).

**On this page:**
- [Connect your cluster](#connect-your-cluster)
- [Deployment methods](#deployment-methods)
- [Access modes](#access-modes) — [Seamless](#seamless-mode-default) · [Selective](#selective-mode-namespace-scoped-rbac)
- [Disconnecting a cluster](#disconnecting-a-cluster)

## Connect your cluster

**Requirements:** Your cluster needs at least one node with **2 vCPUs** and **4 GB memory** available to run the JellyCloud Operator. No network or firewall configuration is required.

:::tip Multiple clusters
You can connect any number of Kubernetes clusters to JellyCloud. All of them share the same pool of connected instances. Workloads across clusters remain fully isolated from one another.
:::

1. In the Console, click **Add** in the top-right corner and select **Add Cluster**. JellyCloud will generate a Helm command with an auto-generated secret unique to your tenant.

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

   You will see virtual nodes added by JellyCloud alongside your existing ones. Each node represents a group of instances sharing the same architecture. Run `kubectl describe node <node-name>` to inspect a node. Allocatable capacity reflects the actual resources of the instances you connected.

4. Your cluster is now ready. Run any standard Kubernetes `Deployment` or `StatefulSet` and JellyCloud will schedule it across your connected nodes and cloud providers. No changes to your manifests are required.

## Deployment methods

JellyCloud supports two ways to install the Operator into your cluster.

### Automated (Supervisor)

The default path. The Helm command generated in the Console installs the JellyCloud Supervisor, which manages the lifecycle of all Operator components automatically, including upgrades.

This is the recommended approach for most teams.

### Manual (Helm / ArgoCD / CI pipelines)

If your organization manages cluster tooling through GitOps, ArgoCD, or internal CI pipelines, you can deploy JellyCloud components manually using the individual Helm chart links exposed in the Console under **Settings**. This lets you version-control the deployment, apply your own values overrides, and integrate JellyCloud into your existing release process.

Both methods support all access modes described below.

## Access modes

When connecting a cluster, you choose the RBAC scope the Operator is granted. This controls which namespaces JellyCloud can observe and schedule workloads into.

## Seamless mode (default)

In seamless mode, JellyCloud is granted cluster-wide visibility and scheduling permissions. This is the default configuration and requires no extra setup beyond the standard Helm install.

JellyCloud can observe and schedule workloads across all namespaces. This is the recommended starting point for most clusters and the simplest path to getting workloads running on JellyCloud infrastructure.

## Selective mode (namespace-scoped RBAC) {#selective-rbac}

Selective mode restricts JellyCloud to a declared set of namespaces. The operator only observes and schedules workloads in namespaces you explicitly authorize. Workloads in other namespaces are invisible to JellyCloud and will never be placed on JellyCloud nodes.

This mode is intended for multi-tenant clusters and environments with strict namespace isolation requirements.

### Step 1: Install the Supervisor with namespaced mode enabled

Run the standard Supervisor install command from the Console, adding `--set security.namespaced=true`:

```bash
helm upgrade --install jellycloud oci://registry-1.docker.io/jellycloud/supervisor \
  --set apiKey=<your-api-key> \
  --version <version> \
  --set security.namespaced=true
```

This replaces the cluster-wide `ClusterRoleBinding` with namespace-scoped `RoleBindings` limited to the `jelly` namespace. At this point, JellyCloud has no access to any of your workload namespaces yet.

### Step 2: Grant access to specific namespaces

Install the `namespaced-rbac` chart, passing the list of namespaces JellyCloud should manage:

```bash
helm upgrade --install jelly-namespaced-rbac oci://registry-1.docker.io/jellycloud/namespaced-rbac \
  --version <version> \
  --set namespaces="{team-a,team-b}" \
  -n jelly
```

This creates the necessary `RoleBindings` in each listed namespace, granting JellyCloud service accounts the permissions they need to observe and schedule workloads there.

:::note Namespaces must exist before running this command
Each namespace listed must already exist in your cluster. Create any missing namespaces with `kubectl create namespace <name>` before running the command.
:::

:::warning Always list all namespaces
Each time you run this command — whether adding or removing namespaces — you must include the **complete** list. Any namespace omitted from the list will have its `RoleBindings` removed and will no longer be accessible to JellyCloud.
:::

### Step 3: Restart JellyCloud components

Restart the JellyCloud deployments in the `jelly` namespace so they pick up the new RBAC configuration:

```bash
kubectl rollout restart deployment -n jelly
```

Wait for all deployments to finish rolling out before scheduling workloads:

```bash
kubectl rollout status deployment -n jelly
```

### Behavior for unlisted namespaces

Workloads in namespaces that are not whitelisted are silently skipped. They do not appear in the JellyCloud Console, are not considered for scheduling on JellyCloud nodes, and are not affected in any way by the operator.

## Disconnecting a cluster

To disconnect a cluster run the below helm command

```bash
helm uninstall jellycloud 
```

Upon cluster disconnect, all meta-data is purged, running workloads are stopped.

