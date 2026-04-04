---
id: gcp
title: Google Cloud (GCP)
sidebar_position: 1
---

# Google Cloud (GCP)

Connect your GCP account to JellyCloud using a service account.

## 1. Create a service account

1. Open the [GCP Console](https://console.cloud.google.com/) and select your project.
2. Go to **IAM & Admin → Service Accounts**.
3. Click **Create Service Account**, give it a name (e.g. `jellycloud`), and click **Create and Continue**.
4. Grant the following roles:
   - `Compute Admin`
   - `Service Account User`
5. Click **Done**.

## 2. Generate a key

1. Click on the service account you just created.
2. Go to the **Keys** tab and click **Add Key → Create new key**.
3. Choose **JSON** and click **Create**. A key file will be downloaded.

## 3. Add to JellyCloud

In the Console, go to **Cloud Providers → Add Provider**, select **Google Cloud**, and upload the JSON key file.
