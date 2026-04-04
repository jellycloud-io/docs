---
id: networking
title: Networking
sidebar_position: 4
---

# Networking

## Ingress

JellyCloud automatically provisions an ingress endpoint for any workload with `port` defined. You can use a JellyCloud domain or bring your own.

```yaml
ingress:
  domain: my-app.jellycloud.app   # managed domain
  # domain: api.example.com       # custom domain (requires DNS setup)
  tls: true                        # auto-provisioned via Let's Encrypt
```

## Service discovery

Workloads within the same project can communicate using their workload name as a hostname:

```
http://my-service:8080
```

## Internal vs external traffic

| Type | How to configure |
|---|---|
| External (public internet) | Set `ingress.domain` |
| Internal only | Omit `ingress`, set `visibility: internal` |
| Cross-project | Use [project links](#) (see configuration) |
