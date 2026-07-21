---
id: digitalocean
title: DigitalOcean
sidebar_position: 7
---

# DigitalOcean

## Connect your account {#credentials}

Connect your DigitalOcean account to JellyCloud using a Personal Access Token.

### 1. Generate a Personal Access Token

1. Log in to the [DigitalOcean Cloud Console](https://cloud.digitalocean.com/).
2. Go to **API** in the left sidebar, then select the **Tokens** tab.
3. Click **Generate New Token**.
4. Give the token a name (e.g. `jellycloud`) and set the expiry to suit your policy.
5. Under **Scopes**, select **Custom Scopes** and enable the following:

   | Resource | Permissions |
   |---|---|
   | `actions` | read |
   | `block_storage` | create, read, update, delete |
   | `droplet` | create, read, update, delete |
   | `droplet / image` | read |
   | `regions` | read |
   | `sizes` | read |

6. Click **Generate Token** and copy the value. It is only shown once.

### 2. Add to JellyCloud

In the Console, navigate to the **Providers** page, select **DigitalOcean**, and click **Connect**. Paste your Personal Access Token and click **Apply**. JellyCloud will validate the credentials before storing them in a secured secret manager.
