---
id: ci-cd-integration
title: CI/CD Integration
sidebar_position: 4
---

# Recipe: CI/CD Integration with GitHub Actions

Automate JellyCloud deployments on every push to `main`.

## Prerequisites

- GitHub repository with your `jelly.yaml`
- A JellyCloud API key stored as a GitHub secret (`JELLY_API_KEY`)

## Workflow

```yaml title=".github/workflows/deploy.yml"
name: Deploy to JellyCloud

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Install JellyCloud CLI
        run: curl -fsSL https://get.jellycloud.io | sh

      - name: Authenticate
        run: jelly auth token ${{ secrets.JELLY_API_KEY }}

      - name: Deploy
        run: jelly deploy --wait

      - name: Verify deployment
        run: jelly status my-app --expect running
```

## Preview environments

Deploy ephemeral environments for every pull request:

```yaml title=".github/workflows/preview.yml"
name: Preview Environment

on:
  pull_request:
    types: [opened, synchronize]

jobs:
  preview:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Install JellyCloud CLI
        run: curl -fsSL https://get.jellycloud.io | sh

      - name: Authenticate
        run: jelly auth token ${{ secrets.JELLY_API_KEY }}

      - name: Deploy preview
        run: |
          jelly deploy \
            --name "pr-${{ github.event.number }}" \
            --ttl 24h \
            --wait

      - name: Comment with preview URL
        uses: actions/github-script@v7
        with:
          script: |
            const url = `https://pr-${{ github.event.number }}.preview.jellycloud.app`;
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: `Preview deployed: ${url}`
            });
```
