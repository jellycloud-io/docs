---
id: proxy-pod
title: Proxy Pod
sidebar_position: 4
---

# Proxy Pod

JellyCloud provides seamless connectivity between local and remote pods. When a pod is scheduled on a remote location and has any form of inbound traffic — such as a Kubernetes Service or liveness and readiness probes — JellyCloud automatically replaces it in the cluster with a lightweight Proxy Pod.

## What is a Proxy Pod

A Proxy Pod is a small, JellyCloud-managed pod that acts as a local representative for a pod running on a remote node. It sits in the cluster, receives inbound traffic from local Services and the kubelet, and forwards it transparently to the actual pod running on the remote location. From the perspective of Kubernetes and any other workload in the cluster, the Proxy Pod is indistinguishable from the original pod.

The Proxy Pod:

- Resides in the same namespace as the original pod
- Carries the same selector labels, so existing Services route to it without any changes
- Follows the `-jc-proxy` naming convention, appended to the original pod name
- Is created only once the remote pod is running and ready to accept traffic
- Is fully created, managed, and deleted by JellyCloud — no user intervention is required

:::note
The absence of a Proxy Pod does not indicate a problem with the remote pod. It simply means the pod has no inbound traffic configured — no Service selects it and no probes are defined. In that case, no proxy is needed.
:::

You can observe both the original remote pod and its corresponding Proxy Pod running side by side with `kubectl get pods`:

```
$ kubectl get pods -n bank
NAME                                                      READY   STATUS    RESTARTS   AGE
balancereader-85db864f44-w8bwg                            1/1     Running   0          20m
balancereader-85db864f44-w8bwg-jc-proxy-d79cd8b77-5kql7   1/1     Running   0          19m
contacts-57ffdcdbf8-9l2kk                                 1/1     Running   0          20m
contacts-57ffdcdbf8-9l2kk-jc-proxy-7bb9849884-298ng       1/1     Running   0          20m
```

The concept is similar to a sidecar in a service mesh — a transparent proxy handling traffic on behalf of the application — except the Proxy Pod runs as a standalone pod rather than a container injected into the same pod.

## Why it matters

Without the Proxy Pod, Services and probes would have no local endpoint to reach — Kubernetes has no native awareness of pods running outside the cluster. The Proxy Pod bridges that gap, enabling standard Kubernetes networking to work across local and remote boundaries without any changes to your application manifests or cluster configuration.

Monitoring and observability also require no changes. Your existing dashboards, metrics scrapers, and logging pipelines continue to observe the original pods as usual — the Proxy Pod is an infrastructure detail that remains invisible to your observability stack.
