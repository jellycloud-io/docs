---
id: global-settings
title: Global Settings
sidebar_position: 2
---

# Global Settings

The top-level `jelly.yaml` in your project root defines global settings that apply to all workloads.

## Full reference

```yaml
# jelly.yaml
project: my-project          # Project name (must be unique in your org)
region: us-east-1            # Primary deployment region
fallback_region: eu-west-1   # Optional: failover region

defaults:
  replicas: 2
  resources:
    cpu: 500m
    memory: 512Mi
  restart_policy: always     # always | on-failure | never

tags:
  team: platform
  env: production
```

## Fields

| Field | Type | Required | Description |
|---|---|---|---|
| `project` | string | Yes | Unique project identifier |
| `region` | string | Yes | Primary cloud region |
| `fallback_region` | string | No | Secondary region for failover |
| `defaults.replicas` | integer | No | Default replica count (default: 1) |
| `defaults.resources.cpu` | string | No | Default CPU request (default: 250m) |
| `defaults.resources.memory` | string | No | Default memory request (default: 256Mi) |
| `tags` | map | No | Key-value labels applied to all resources |
