---
id: aks
title: AKS
sidebar_position: 4
---

# AKS

This page covers configuration specific to running JellyCloud on Azure Kubernetes Service (AKS). Before following these steps, complete the standard cluster setup described in [Cluster Deployment](/deployment-options/cluster-deployment).

## Managed Identity for image pull

When your AKS cluster uses multiple managed identities, JellyCloud needs to know which identity to use for each workload. This is configured via a label that can be applied at the pod or namespace level.

:::note
This configuration is only required if your cluster is configured with multiple managed identities. If your cluster uses a single identity, no additional setup is needed.
:::

### Step 1: Find the Client ID of the relevant Managed Identity

Locate the Client ID of the managed identity that should be used for the workload. This is the identity associated with your AKS node pool or the specific workload identity you have configured.

:::warning Do not use `az identity list` output directly
Running `az identity list -g <resource-group> -o table` returns managed identity resource IDs, not the AKS workload identity Client ID. Make sure you are using the Client ID of the correct identity as shown in the Azure Portal or via the AKS-specific identity configuration.
:::

### Step 2: Apply the Client ID label

Add the `azure.jellycloud.io/client-id` label to the workload or namespace:

**On a Deployment** (applies to that workload only):

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: data-test
  namespace: data
spec:
  replicas: 1
  selector:
    matchLabels:
      app: loadjob
  template:
    metadata:
      labels:
        app: loadjob
        azure.jellycloud.io/client-id: <client-id>
```

**On a Namespace** (applies to all Deployments in that namespace):

```bash
kubectl label namespace <namespace> azure.jellycloud.io/client-id=<client-id>
```

JellyCloud will use the specified managed identity when scheduling workloads onto AKS nodes.
