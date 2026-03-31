---
id: monitoring
title: Monitoring
sidebar_position: 5
---

# Monitoring AI Workloads

## Built-in metrics

JellyCloud automatically collects and exposes the following metrics for inference workloads:

| Metric | Description |
|---|---|
| `inference_requests_total` | Total number of inference requests |
| `inference_request_duration_p50` | Median request latency |
| `inference_request_duration_p99` | P99 request latency |
| `inference_queue_depth` | Current number of queued requests |
| `gpu_utilization_percent` | GPU utilization per replica |
| `gpu_memory_used_bytes` | GPU VRAM used per replica |
| `tokens_per_second` | Generation throughput |

## Viewing metrics

```bash
jelly metrics llama3-8b --last 1h
```

Or view in the JellyCloud dashboard under **Workloads → [your model] → Metrics**.

## Alerts

Set up alerts for key thresholds:

```yaml
alerts:
  - name: high-queue-depth
    metric: inference_queue_depth
    threshold: 50
    window: 5m
    notify: slack:#platform-alerts

  - name: gpu-oom-risk
    metric: gpu_memory_used_bytes
    threshold: 95%
    window: 2m
    notify: pagerduty:platform-oncall
```

## Log access

```bash
jelly logs llama3-8b --follow
```
