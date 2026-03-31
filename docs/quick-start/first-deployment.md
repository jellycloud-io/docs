---
id: first-deployment
title: First Deployment
sidebar_position: 3
---

# Deploy Your First Workload

This guide walks you through deploying a sample application on JellyCloud.

## 1. Initialize a project

```bash
jelly init my-app
cd my-app
```

This creates a `jelly.yaml` configuration file in the current directory.

## 2. Review the configuration

```yaml title="jelly.yaml"
name: my-app
runtime: container
image: nginx:latest
replicas: 1
port: 80
```

## 3. Deploy

```bash
jelly deploy
```

JellyCloud provisions the infrastructure, pulls your container image, and starts the workload. You'll see a live status stream in your terminal.

## 4. Get the endpoint

```bash
jelly status my-app
```

The output includes the public URL for your deployment.

## Next step

[Explore what's next →](./whats-next)
