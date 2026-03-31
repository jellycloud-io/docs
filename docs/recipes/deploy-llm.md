---
id: deploy-llm
title: Deploy an LLM
sidebar_position: 2
---

# Recipe: Deploy an LLM

This recipe walks through deploying **Llama 3 8B** on JellyCloud using vLLM with an OpenAI-compatible API.

## Prerequisites

- JellyCloud account with GPU quota enabled
- Hugging Face token with access to `meta-llama/Meta-Llama-3-8B-Instruct`

## Step 1 — Store your Hugging Face token

```bash
jelly secret set HF_TOKEN "hf_..."
```

## Step 2 — Create the workload config

```yaml title="jelly.yaml"
name: llama3-8b
type: inference
engine: vllm
model: hf://meta-llama/Meta-Llama-3-8B-Instruct
accelerator: nvidia-a10g
replicas: 1
port: 8000

resources:
  gpu: 1
  memory: 24Gi
  cpu: 4

env:
  HF_TOKEN:
    secret: HF_TOKEN
  VLLM_WORKER_MULTIPROC_METHOD: spawn

ingress:
  domain: llama3.myproject.jellycloud.app
  tls: true
```

## Step 3 — Deploy

```bash
jelly deploy
```

Wait for the workload to reach `Running` status (typically 2–5 minutes for model download):

```bash
jelly status llama3-8b --watch
```

## Step 4 — Test the endpoint

```bash
curl https://llama3.myproject.jellycloud.app/v1/chat/completions \
  -H "Authorization: Bearer $JELLY_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "llama3-8b",
    "messages": [
      {"role": "system", "content": "You are a helpful assistant."},
      {"role": "user", "content": "What is JellyCloud?"}
    ],
    "max_tokens": 256
  }'
```

## What's next

- [Set up autoscaling](./autoscaling-gpu) to handle variable load
- [Monitor GPU metrics](../ai-serving/monitoring) to optimize cost and performance
