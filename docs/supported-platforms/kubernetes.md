---
id: kubernetes
title: Kubernetes
sidebar_position: 3
---

# Kubernetes

JellyCloud can manage workloads on any CNCF-conformant Kubernetes cluster.

## Requirements

- Kubernetes **1.26 or later**
- `kubectl` access with `cluster-admin` or a JellyCloud-scoped RBAC role
- Metrics Server installed (for autoscaling)

## Connect your cluster

```bash
jelly cluster connect --kubeconfig ~/.kube/config --name my-cluster
```

## Supported features on self-managed Kubernetes

| Feature | Supported |
|---|---|
| Container workloads | Yes |
| GPU scheduling | Yes (with NVIDIA device plugin) |
| Horizontal autoscaling | Yes |
| Ingress management | Yes (nginx, Traefik) |
| Service mesh | Yes (Istio, Linkerd) |
| Persistent volumes | Yes |
