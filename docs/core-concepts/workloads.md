---
id: workloads
title: Workloads
sidebar_position: 3
---

# Workloads

A **workload** is the core deployment unit in JellyCloud. Every workload runs inside a container.

## Workload types

### Service

A long-running process that serves traffic. JellyCloud keeps the desired number of replicas running at all times.

```yaml
type: service
replicas: 3
port: 8080
```

### Job

A one-shot or scheduled task that runs to completion.

```yaml
type: job
schedule: "0 2 * * *"   # cron syntax, optional
command: ["python", "batch_job.py"]
```

### AI Inference Service

A specialized service type optimized for model serving, with GPU scheduling and request batching built in. See [AI Serving](/ai-serving) for details.

```yaml
type: inference
model: s3://my-bucket/models/llama-3
accelerator: nvidia-a100
replicas: 2
```

## Workload lifecycle

1. **Pending** — workload accepted, infrastructure being provisioned
2. **Running** — all replicas healthy and serving
3. **Degraded** — some replicas unavailable
4. **Stopped** — workload intentionally stopped
5. **Failed** — workload exited with errors
