---
id: overview
title: Overview
sidebar_position: 2
---

# AI Serving Overview

## Architecture

JellyCloud's AI serving layer sits on top of the core workload system and adds inference-specific capabilities:

```
Client Request
      │
      ▼
┌─────────────────┐
│  JellyCloud     │
│  Inference      │  ← Request routing, batching, rate limiting
│  Gateway        │
└────────┬────────┘
         │
    ┌────▼────┐   ┌─────────┐
    │ Model   │   │ Model   │  ← GPU-backed replica pods
    │ Pod 0   │   │ Pod 1   │
    └─────────┘   └─────────┘
```

## Key concepts

### Inference Gateway

All inference traffic passes through the JellyCloud Inference Gateway, which handles:

- **Request batching** — groups concurrent requests to maximize GPU utilization
- **Queue management** — buffers requests during traffic spikes instead of dropping them
- **Routing** — directs traffic to the least-loaded healthy replica

### Model storage

Models are loaded at startup from object storage (S3, GCS, Azure Blob). JellyCloud caches models on node-local NVMe storage to reduce cold-start times.

### Accelerator types

| Accelerator | Use case |
|---|---|
| `nvidia-a100` | Large LLMs (70B+ params) |
| `nvidia-a10g` | Mid-size models (7B–13B params) |
| `nvidia-t4` | Small models, cost-sensitive workloads |
| `cpu` | Lightweight models, GGUF quantized |
