---
id: jelly-nodes
title: Jelly Nodes
sidebar_position: 3
---

# Jelly Nodes

## Overview

When you connect a Kubernetes cluster to JellyCloud, new nodes appear alongside your existing ones. These are Jelly Virtual Nodes — they are not physical machines joined to the cluster directly. Each virtual node is a logical representation of a group of remote instances that share the same hardware architecture and node selector.

From Kubernetes' perspective, a Jelly Virtual Node looks and behaves like any other node. You can inspect it with `kubectl get nodes` or `kubectl describe node <node-name>`, read metrics, and target it with `nodeSelector` or `nodeAffinity` rules in your workload manifests. No changes to your existing tooling or workflows are required.

## Aggregated capacity

Each Jelly Virtual Node advertises an aggregated capacity that reflects the combined resources of all the remote instances it represents. For example, if a virtual node represents four instances each with 8 vCPUs and 32 GB of memory, the node will report 32 allocatable vCPUs and 128 GB of memory to the Kubernetes scheduler.

This means the scheduler can place workloads across the full pool of remote instances without needing to be aware of the underlying topology. GPU resources, where present, are aggregated in the same way.

**Example:** Four remote nodes, each equipped with 4 H100 GPUs, are represented by a single Jelly Virtual Node. The virtual node advertises 16 H100 GPUs of allocatable capacity to the Kubernetes scheduler. When an LLM deployment requests 4 GPUs, Kubernetes assigns the pod to the virtual node. The actual scheduling -   selecting which remote node to run the workload on and validating resource availability - happens on the JellyCloud SaaS side, transparently to the cluster.

:::note
This aggregation model gives you significant flexibility when working with remote nodes. You can mix instances across geographies, providers, and hardware generations within a single virtual node, and the Kubernetes scheduler treats the entire pool as a single schedulable unit.
:::

## Node selectors

Each Jelly Virtual Node is labeled with the architecture and instance type it represents. You can use these standard labels alongside JellyCloud's proprietary `jellycloud.io` labels to write simple and flexible node selector rules that target exactly the cloud, location or evevn an instance your workload needs. See the [Configuration](/configuration) page for the full list of available labels and examples.


