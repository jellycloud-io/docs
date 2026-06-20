---
id: hetzner
title: Hetzner
sidebar_position: 5
---

# Hetzner

## Connect your account {#credentials}

Connect your Hetzner account to JellyCloud using an API token.

### 1. Generate an API token

1. Log in to the [Hetzner Cloud Console](https://console.hetzner.cloud/) and open your project.
2. Go to **Security** in the left sidebar, then select **API Tokens** from the top menu.
3. Click **Generate API Token**, enter a description, and select **Read & Write** permissions.
4. Copy the token. It is only shown once — store it somewhere secure before closing the window.

### 2. Add to JellyCloud

In the Console, navigate to the **Providers** page, select **Hetzner**, and click **Connect**. Paste your API token and click **Apply**. JellyCloud will validate the credentials before storing them in a secured secret manager.
