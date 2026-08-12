---
id: gke
title: GKE
sidebar_position: 3
---

# GKE

This page covers configuration specific to running JellyCloud on Google Kubernetes Engine (GKE). Before following these steps, complete the standard cluster setup described in [Cluster Deployment](/deployment-options/cluster-deployment).

## Artifact Registry image pull

When your workloads pull images from Google Artifact Registry (GAR), you can use GCP Workload Identity to grant JellyCloud nodes pull access without storing credentials in the cluster.

JellyCloud nodes authenticate using the `jelly-node` Kubernetes service account in the `jelly` namespace. The steps below bind a GCP service account with Artifact Registry read access to that service account.

:::tip Already have a service account with pull access?
If you already have a GCP service account with `roles/artifactregistry.reader`, skip to steps 3 and 4.
:::

1. Create a GCP service account (or use an existing one):

   ```bash
   gcloud iam service-accounts create <gcp-service-account-name> \
     --project=<project-name>
   ```

2. Grant the service account permission to pull from Artifact Registry:

   ```bash
   gcloud projects add-iam-policy-binding <project-name> \
     --member="serviceAccount:<gcp-service-account-email>" \
     --role="roles/artifactregistry.reader"
   ```

3. Bind the GCP service account to the JellyCloud node Kubernetes service account using Workload Identity:

   ```bash
   gcloud iam service-accounts add-iam-policy-binding \
     <gcp-service-account-email> \
     --project=<project-name> \
     --role=roles/iam.workloadIdentityUser \
     --member="serviceAccount:<project-name>.svc.id.goog[jelly/jelly-node]"
   ```

4. Update the cluster config to register the GCP service account with JellyCloud:

   ```bash
   kubectl patch clusterconfig.controller.jellycloud.io cluster-config --type merge \
     --patch '{"spec": {"credentials": {"gcp": {"serviceAccount": "<gcp-service-account-email>"}}}}'
   ```

After step 4, JellyCloud nodes will use the bound GCP service account to authenticate image pulls from Artifact Registry.
