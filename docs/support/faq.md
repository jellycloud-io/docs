---
id: faq
title: FAQ
sidebar_position: 2
---

# Frequently Asked Questions

## General

### What is JellyCloud?

JellyCloud is a SaaS platform for DevOps and platform teams to deploy and operate cloud workloads, including AI inference, across any infrastructure.

### Is JellyCloud open source?

The JellyCloud agent is open source. The control plane is a hosted SaaS service.

### Which regions are supported?

JellyCloud supports deployments in any AWS, GCP, or Azure region, as well as on-premises and bare metal.

---

## Pricing and limits

### How is pricing calculated?

JellyCloud charges based on the compute resources your workloads consume (CPU, memory, GPU hours). See the [pricing page](https://jellycloud.io/pricing) for details.

### Is there a free tier?

Yes. New accounts include a free tier with enough resources to run small workloads for evaluation.

---

## AI Serving

### Which LLM frameworks are supported?

vLLM, TorchServe, NVIDIA Triton, llama.cpp, and any custom container.

### Can I use my own fine-tuned models?

Yes. Upload your model weights to S3-compatible storage and reference the path in your `jelly.yaml`.

### Does JellyCloud support OpenAI-compatible APIs?

Yes. The inference gateway exposes an OpenAI-compatible API for chat completions, completions, and embeddings.

---

## Security

### Where are secrets stored?

Secrets are encrypted at rest using AES-256 and stored in JellyCloud's managed secret store. They are never written to disk inside your workload containers — they are injected as environment variables or files at runtime.

### Does JellyCloud have SOC 2 compliance?

JellyCloud is SOC 2 Type II certified. Contact us for the audit report.
