---
id: autoscaling-gpu
title: Autoscale GPUs
sidebar_position: 3
---

# Recipe: Autoscale GPU Inference Pods

This recipe configures autoscaling for a GPU inference workload to handle bursty traffic while minimizing idle GPU costs.

## Strategy

Scale based on **request queue depth** — when more requests are queued than your replicas can handle, JellyCloud adds replicas. When the queue clears, it scales back down after a cooldown period.

## Configuration

```yaml title="jelly.yaml"
name: llama3-8b
type: inference
engine: vllm
model: hf://meta-llama/Meta-Llama-3-8B-Instruct
accelerator: nvidia-a10g
port: 8000

resources:
  gpu: 1
  memory: 24Gi
  cpu: 4

autoscaling:
  enabled: true
  min_replicas: 1        # keep at least 1 warm replica
  max_replicas: 6
  target_queue_depth: 5  # scale up when >5 requests queued per replica
  scale_up_cooldown: 60  # seconds between scale-up events
  scale_down_delay: 300  # seconds of low load before scaling down
```

## Monitor scaling events

```bash
jelly events llama3-8b --type scaling
```

## Cost tip

If your workload can tolerate cold starts, set `min_replicas: 0` to scale to zero during off-hours. Combine with a scheduled warm-up job that sends a dummy request 5 minutes before peak hours.
