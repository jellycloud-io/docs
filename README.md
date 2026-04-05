# JellyCloud Documentation

JellyCloud is a platform that extends your Kubernetes cluster with capacity from any cloud provider or bare metal infrastructure. Connect your existing cluster, attach instances from one or more clouds, and run workloads across all of them — without changing your manifests or tooling.

## What it solves

Cloud compute is fragmented. Teams end up locked into a single provider, overpaying for reserved capacity, or managing sprawling multi-cloud setups by hand. JellyCloud gives you a single control plane that makes remote capacity look and behave like local nodes, so you can schedule workloads wherever it makes sense — by cost, location, hardware, or availability.

## How it works

1. Install the JellyCloud Operator into your cluster with a single Helm command.
2. Connect instances from your cloud accounts (or let JellyCloud provision them for you).
3. JellyCloud adds virtual nodes to your cluster representing the connected capacity.
4. Deploy workloads as you normally would. JellyCloud handles scheduling, scaling, and isolation.

## Key capabilities

| Capability | Description |
|---|---|
| Multi-cloud node pools | Attach instances from GCP, Civo, Lambda Labs, Crusoe, and more |
| Kubernetes-native | Works with any distribution 1.33+. No changes to your manifests |
| GPU workloads | First-class support for AI inference and training with GPU-aware scheduling |
| Multiple clusters | Connect multiple clusters sharing the same pool of instances, with full workload isolation |
| BYO or managed | Use your own cloud accounts or let JellyCloud provision capacity on your behalf |

## Get started

- [Quick Start](/quick-start): connect your cluster and run your first workload
- [Supported Platforms](/supported-platforms): check which Kubernetes distributions and OS versions are supported
- [Cloud Providers](/cloud-providers): connect your cloud accounts
- [Recipes](https://github.com/jellycloud-io/jelly-bites): sample applications to deploy on JellyCloud
- [Support](/support): reach the team
