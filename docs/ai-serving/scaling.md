---
id: scaling
title: Scaling
sidebar_position: 4
---

# Scaling AI Workloads

## GPU autoscaling

JellyCloud autoscales inference replicas based on queue depth and GPU utilization:

```yaml
autoscaling:
  enabled: true
  min_replicas: 1
  max_replicas: 8
  target_queue_depth: 10       # scale up when queue > 10 requests
  scale_down_delay: 300        # seconds to wait before scaling down
```

## Scale-to-zero

For cost-sensitive workloads with bursty traffic:

```yaml
autoscaling:
  enabled: true
  min_replicas: 0              # scale to zero when idle
  max_replicas: 4
  cold_start_timeout: 120      # max seconds to wait for a cold pod
```

:::note
Scale-to-zero introduces cold-start latency while the GPU pod initializes and loads the model. Use `cold_start_timeout` to set a maximum wait before the gateway returns a 503.
:::

## Manual scaling

```bash
jelly scale llama3-8b --replicas 4
```

## Request batching tuning

Adjust batching behavior to balance latency and throughput:

```yaml
batching:
  max_batch_size: 32
  max_wait_ms: 50
