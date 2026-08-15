---
id: security
title: Security
sidebar_position: 6
---

# Security

Security is a foundational principle of JellyCloud, not just another feature. The platform is designed to operate within your existing security boundaries without requiring changes to your network configuration, firewall rules, or Kubernetes access controls. JellyCloud does not expose internal APIs, does not require inbound connectivity to your cluster, and never asks for credentials beyond the minimum scope needed to perform its function.

## Cluster RBAC

JellyCloud integrates with your Kubernetes cluster through the standard Kubernetes RBAC system. When the JellyCloud Operator is installed, it operates as a set of service accounts within the `jelly` namespace and requests only the permissions it needs to observe workloads, schedule pods, and manage the objects it creates.

### Namespace-driven visibility

By default, JellyCloud operates with cluster-wide visibility. This is the simplest configuration and works well for non-prod clusters. However, in environments where multiple teams share a cluster or higher level of isolation is required, you may want to limit which namespaces JellyCloud can see and interact with.

JellyCloud supports a selective access model where you explicitly declare which namespaces the platform is permitted to manage. In this model:

- JellyCloud only observes workloads in namespaces you authorize. Pods and deployments in other namespaces are invisible to the platform and will never be scheduled on JellyCloud nodes.
- RBAC permissions are scoped per namespace. JellyCloud service accounts receive Role bindings only in the namespaces you list, rather than a cluster-wide ClusterRoleBinding.
- The whitelist is dynamic. Adding or removing a namespace from the managed set takes effect within seconds, with no operator restart required.

This model is particularly useful for multi-tenant clusters, production environments.

For configuration instructions, see [Cluster Deployment](/deployment-options/cluster-deployment#selective-rbac).

## Node-to-node connectivity (S2S)

By default, JellyCloud establishes secure server-to-server (S2S) connections between nodes to route traffic between your cluster and remote compute. You can control whether direct S2S communication between nodes is enabled from the Console.


The setting applies at the tenant level and takes effect for new connections. Existing connections are not interrupted immediately.
