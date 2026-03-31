---
id: deploying-models
title: Deploying Models
sidebar_position: 3
---

# Deploying Models

## Deploy a Hugging Face model

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
```

```bash
jelly deploy
```

## Deploy a model from object storage

```yaml
name: custom-model
type: inference
engine: vllm
model: s3://my-bucket/models/my-fine-tuned-model
accelerator: nvidia-a100
replicas: 2
```

## Query the model

Once deployed, the model is reachable at your inference endpoint:

```bash
curl https://llama3-8b.<your-project>.jellycloud.app/v1/chat/completions \
  -H "Authorization: Bearer $JELLY_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "llama3-8b",
    "messages": [{"role": "user", "content": "Hello!"}]
  }'
```

The inference API is OpenAI-compatible, so any OpenAI SDK client works out of the box.

## Supported engines

| Engine | Description |
|---|---|
| `vllm` | High-throughput LLM serving (recommended for LLMs) |
| `triton` | NVIDIA Triton Inference Server |
| `torchserve` | PyTorch model serving |
| `custom` | Bring your own container with any serving framework |
