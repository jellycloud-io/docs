---
id: secrets
title: Secrets
sidebar_position: 4
---

# Secrets

JellyCloud encrypts secrets at rest using AES-256 and injects them into workloads at runtime. Secrets are never stored in your `jelly.yaml` or git history.

## Create a secret

```bash
jelly secret set DATABASE_URL "postgres://user:pass@host:5432/db"
```

## List secrets

```bash
jelly secret list
```

## Delete a secret

```bash
jelly secret delete DATABASE_URL
```

## Use a secret in a workload

```yaml
env:
  DATABASE_URL:
    secret: DATABASE_URL
```

Or mount secrets as files:

```yaml
volumes:
  - name: tls-cert
    type: secret
    secret: my-tls-cert
    mount: /etc/ssl/certs
```

## Secret scoping

Secrets are scoped to a project by default. To share a secret across projects, use the `--scope org` flag:

```bash
jelly secret set SHARED_API_KEY "..." --scope org
```
