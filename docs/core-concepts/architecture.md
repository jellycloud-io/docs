---
id: architecture
title: Architecture
sidebar_position: 2
---

# Architecture

## Overview

JellyCloud is split into two planes:

- **Control plane** — hosted by JellyCloud, responsible for scheduling, configuration reconciliation, and API serving
- **Data plane** — runs in your infrastructure, executes workloads, and reports status back to the control plane

```
┌─────────────────────────────────┐
│        JellyCloud SaaS          │
│  ┌─────────┐  ┌──────────────┐  │
│  │   API   │  │  Scheduler   │  │
│  └─────────┘  └──────────────┘  │
└────────────────┬────────────────┘
                 │ (mTLS)
     ┌───────────▼───────────┐
     │   Your Infrastructure │
     │  ┌──────────────────┐ │
     │  │  JellyCloud Agent │ │
     │  └──────────────────┘ │
     │  ┌──────┐  ┌────────┐ │
     │  │ Pod  │  │  Pod   │ │
     │  └──────┘  └────────┘ │
     └───────────────────────┘
```

## Communication

All communication between the control plane and your infrastructure uses **mutual TLS (mTLS)**. The JellyCloud agent initiates outbound connections only — no inbound ports need to be opened.

## Agent

The JellyCloud agent runs as a Kubernetes DaemonSet or as a systemd service on bare metal nodes. It:

- Pulls workload specs from the control plane
- Reports node and pod status
- Manages secrets injection
- Handles log and metric forwarding
