---
id: cluster-deployment
title: Cluster Deployment
sidebar_position: 2
---

# Cluster Deployment

Connecting a cluster installs the JellyCloud Operator, which bridges your Kubernetes control plane with JellyCloud-managed infrastructure. Once connected, you choose how broadly the Operator can interact with your workloads: cluster-wide (seamless) or restricted to specific namespaces (selective).

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

## Access modes

When connecting a cluster, you choose the RBAC scope the Operator is granted. This controls which namespaces JellyCloud can observe and schedule workloads into.

## Seamless mode (default)

In seamless mode, JellyCloud is granted cluster-wide visibility and scheduling permissions. This is the default configuration and requires no extra setup beyond the standard Helm install.

JellyCloud can observe and schedule workloads across all namespaces. This is the recommended starting point for most clusters and the simplest path to getting workloads running on JellyCloud infrastructure.

## Selective mode (namespace-scoped RBAC) {#selective-rbac}

Selective mode restricts JellyCloud to a declared set of namespaces. The operator only observes and schedules workloads in namespaces you explicitly authorize. Workloads in other namespaces are invisible to JellyCloud and will never be placed on JellyCloud nodes.

This mode is intended for multi-tenant clusters and environments with strict namespace isolation requirements.

### Step 1: Install with namespaced mode enabled

Add `--set security.namespaced=true` to your Helm install or upgrade command:

```bash
helm install jelly-supervisor <chart> \
  --set security.namespaced=true \
  -n jelly
```

This replaces the cluster-wide `ClusterRoleBinding` with namespace-scoped `RoleBindings` limited to the `jelly` namespace. At this point, JellyCloud has no access to any of your workload namespaces yet.

### Step 2: Grant access to specific namespaces

Install the `namespaced-rbac` chart, passing the list of namespaces JellyCloud should manage:

```bash
helm install jelly-namespaced-rbac <chart> \
  --set namespaces="{team-a,team-b}" \
  -n jelly
```

This creates the necessary `RoleBindings` in each listed namespace, granting JellyCloud service accounts the permissions they need to observe and schedule workloads there. To add or remove namespaces later, upgrade the release with an updated list:

```bash
helm upgrade jelly-namespaced-rbac <chart> \
  --set namespaces="{team-a,team-b,team-c}" \
  -n jelly
```

### Behavior for unlisted namespaces

Workloads in namespaces that are not whitelisted are silently skipped. They do not appear in the JellyCloud Console, are not considered for scheduling on JellyCloud nodes, and are not affected in any way by the operator.
