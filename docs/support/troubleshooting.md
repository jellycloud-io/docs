---
id: troubleshooting
title: Troubleshooting
sidebar_position: 3
---

# Troubleshooting

## Workload stuck in Pending

**Cause:** Insufficient resources in the target cluster or region.

**Steps:**
1. Check available capacity: `jelly cluster capacity`
2. Check for scheduling errors: `jelly events <workload-name>`
3. Try reducing resource requests or switching to a different region.

---

## Workload crashes on startup (CrashLoopBackOff)

**Cause:** Application error, misconfiguration, or missing secrets.

**Steps:**
1. View logs: `jelly logs <workload-name> --previous`
2. Verify environment variables: `jelly describe <workload-name>`
3. Confirm all referenced secrets exist: `jelly secret list`

---

## Inference model fails to load

**Cause:** Model path incorrect, insufficient GPU VRAM, or slow model download.

**Steps:**
1. Verify the model path is accessible: `jelly storage ls s3://my-bucket/models/`
2. Check VRAM usage: `jelly metrics <workload-name> --metric gpu_memory_used_bytes`
3. Try a quantized model version to reduce memory footprint.

---

## 503 errors on inference endpoint

**Cause:** All replicas are busy or unavailable.

**Steps:**
1. Check queue depth: `jelly metrics <workload-name> --metric inference_queue_depth`
2. Scale up manually: `jelly scale <workload-name> --replicas 3`
3. Review autoscaling config — `target_queue_depth` may be too high.

---

## CLI authentication fails

**Cause:** Expired token or network issue.

**Steps:**
1. Re-authenticate: `jelly auth login`
2. Verify API connectivity: `jelly ping`
3. Check if your IP is allowlisted in your organization's security settings.
