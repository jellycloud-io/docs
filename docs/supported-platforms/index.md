---
id: index
title: Supported Platforms
sidebar_position: 1
---

# Supported Platforms

## Kubernetes

Any Kubernetes distribution version **1.33 and above** is supported.

:::note Unsupported managed modes
**GKE Autopilot** and **AWS EKS Auto Mode** are not supported. These managed modes take full control of node provisioning and do not allow external node providers, which is incompatible with the JellyCloud Operator.
:::

## Instances

The following Linux distributions are supported for connecting existing machines as instances via the self-install agent:

| **Linux Distro** | **Versions** | **Arch** |
|---|---|---|
| Debian | 12 (Bookworm), 13 (Trixie) | AMD64 |
| Ubuntu | 24.04 LTS (Noble Numbat), 22.04 LTS (Jammy Jellyfish) | AMD64, ARM64 |
| Rocky Linux | 10 | AMD64 |
| CentOS | 9 Stream, 10 Stream | AMD64 |
| AlmaLinux | 10 | AMD64 |
| RHEL | 10 | AMD64 |
