---
id: storage
title: Storage
sidebar_position: 5
---

# Storage

## Ephemeral storage

Each container gets ephemeral storage by default. Data is lost when the container restarts. Use this for temp files and caches.

## Persistent volumes

Attach a persistent volume for stateful workloads:

```yaml
volumes:
  - name: data
    size: 50Gi
    mount: /data
    type: ssd   # ssd | hdd | nvme
```

Persistent volumes are provisioned from the underlying cloud provider's block storage (EBS, GCP PD, Azure Disk).

## Object storage

JellyCloud can mount object storage buckets as a filesystem using a FUSE adapter, or you can access them directly via SDK:

```yaml
volumes:
  - name: models
    type: object-storage
    bucket: s3://my-bucket/models
    mount: /models
    readonly: true
```

This is the recommended approach for loading large AI models at inference time.
