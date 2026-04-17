---
id: first-deployment
title: Connect a Cluster
sidebar_position: 3
---

# Connect a Cluster

With your instances connected or configured, you're ready to extend your Kubernetes cluster to run on JellyCloud-managed infrastructure.

:::tip Supported platforms
Not sure if your cluster or OS is supported? Check the [Supported Platforms](../supported-platforms) page.
:::

## Requirements

Your cluster needs at least one node with **2 vCPUs** and **4 GB memory** available to run the JellyCloud Operator. No network or firewall configuration is required.

:::tip Multiple clusters
You can connect any number of Kubernetes clusters to JellyCloud. All of them share the same pool of connected instances. Workloads across clusters remain fully isolated from one another.
:::

## 1. Connect your cluster

In the Console, go to the **Resources** page and click **Connect Cluster**. JellyCloud will generate a Helm command with an auto-generated secret unique to your tenant.

<p>
  <a href="{{CONSOLE_URL}}/resources" className="button button--primary button--lg">Open Console →</a>
</p>

:::warning Keep your Helm link private
The generated Helm command contains secrets unique to your tenant. Do not share it publicly, commit it to version control, or expose it in logs.
:::

## 2. Install the JellyCloud Operator

Copy the Helm command from the Console and run it on your cluster. The command installs the JellyCloud Operator into a `jelly` namespace and authenticates it using the token embedded in the link. No extra configuration needed.

## 3. Wait for the Operator to initialize

The Operator takes a couple of minutes to load and reconcile all its modules. You can watch the rollout:

```bash
kubectl -n jelly get pods --watch
```

Wait until all pods show `Running`, then check your cluster nodes:

```bash
kubectl get nodes
```

You'll see virtual nodes added by JellyCloud alongside your existing ones. Each JellyCloud node represents a group of instances sharing the same architecture. Run `kubectl describe node <node-name>` to inspect a node. The allocatable capacity (CPU, memory, and GPU where applicable) reflects the actual resources of the instances you connected.

## 4. Deploy your workloads

Your cluster is now ready. Run any standard Kubernetes `Deployment` or `StatefulSet` and JellyCloud will schedule it across the nodes and cloud providers of your choice. No changes to your manifests required.

```bash
kubectl apply -f my-deployment.yaml
```

Don't have a deployment handy? Browse the [jelly-bites](https://github.com/jellycloud-io/jelly-bites) sample repository for ready-to-run applications.

## 5. Monitor and operate

Use your existing tools to manage workloads as you normally would:

- **kubectl:** full CLI access to your cluster
- **Kubernetes Dashboard:** standard dashboard works without modification
- **JellyCloud Console:** provides additional observability for your workloads, including cross-cluster visibility, resource utilization, and instance health

## Next step

[Explore what's next →](./whats-next)
