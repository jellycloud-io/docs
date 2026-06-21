---
id: civo
title: Civo
sidebar_position: 2
---

# Civo

## Connect your account {#credentials}

Connect your Civo account to JellyCloud using an API key.

### 1. Get your API key

1. Log in to your Civo account and navigate to the [Profile/Security](https://dashboard.civo.com/security) section of your Civo account  page.
2. Your API key is displayed there. Copy it.

If your account belongs to an organization, you may see multiple keys — each tied to a specific account. Copy the one for the account you want to connect.

:::tip Regenerating your key
If you need to rotate your credentials, click **Regenerate** next to the key. The change takes effect immediately and the old key stops working, so update any existing integrations right away.
:::

### 2. Add to JellyCloud

In the Console, navigate to the **Providers** page, select **Civo**, and click **Connect**. Paste your API key and click **Apply**. JellyCloud will validate the credentials before storing them in a secured secret manager.
