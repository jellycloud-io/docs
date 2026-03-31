---
id: environment-variables
title: Environment Variables
sidebar_position: 3
---

# Environment Variables

## Static values

Set env vars directly in `jelly.yaml`:

```yaml
env:
  APP_ENV: production
  LOG_LEVEL: info
  PORT: "8080"
```

## Dynamic values from platform

JellyCloud injects a set of platform variables automatically into every workload:

| Variable | Description |
|---|---|
| `JELLY_PROJECT` | Current project name |
| `JELLY_REGION` | Deployment region |
| `JELLY_WORKLOAD_NAME` | Name of this workload |
| `JELLY_REPLICA_INDEX` | Index of this replica (0-based) |

## Values from secrets

Reference a secret by name:

```yaml
env:
  DATABASE_URL:
    secret: my-database-url   # must exist in JellyCloud Secrets
```

See [Secrets](./secrets) for how to create and manage secrets.
