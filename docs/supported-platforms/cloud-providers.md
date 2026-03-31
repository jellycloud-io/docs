---
id: cloud-providers
title: Cloud Providers
sidebar_position: 2
---

# Cloud Providers

## AWS

JellyCloud integrates natively with AWS via an IAM role. Supported services:

- **EKS** — managed Kubernetes workloads
- **EC2** — VM-based deployments
- **Fargate** — serverless containers
- **S3** — artifact and model storage
- **ECR** — private container registry

### Required IAM permissions

```json
{
  "Effect": "Allow",
  "Action": [
    "eks:*",
    "ec2:DescribeInstances",
    "s3:GetObject",
    "s3:PutObject"
  ],
  "Resource": "*"
}
```

---

## Google Cloud

Supported services: GKE, Cloud Run, Artifact Registry, Cloud Storage.

Connect via a GCP service account with the following roles:
- `roles/container.developer`
- `roles/storage.objectAdmin`

---

## Azure

Supported services: AKS, Container Apps, Azure Container Registry, Blob Storage.

Connect via an Azure service principal with `Contributor` role on the target resource group.
