---
id: bare-metal
title: Bare Metal
sidebar_position: 4
---

# Bare Metal

:::caution Beta
Bare metal support is currently in beta. Some features may be limited or subject to change.
:::

JellyCloud can deploy workloads directly to bare metal servers, which is particularly useful for GPU-intensive AI workloads where virtualization overhead is undesirable.

## Requirements

- Ubuntu 22.04 or RHEL 9
- Docker or containerd runtime
- JellyCloud agent installed on each node

## Install the agent

```bash
curl -fsSL https://get.jellycloud.io/agent | sudo sh
jelly node register --token <YOUR_NODE_TOKEN>
```

## GPU nodes

For NVIDIA GPUs, ensure the following are installed on the host:

- NVIDIA driver 525+
- NVIDIA Container Toolkit
- CUDA 12+

Once registered, JellyCloud automatically labels GPU nodes and schedules GPU workloads to them.
