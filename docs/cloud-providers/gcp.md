---
id: gcp
title: Google Cloud (GCP)
sidebar_position: 1
---

# Google Cloud (GCP)

## Connect your account {#credentials}

Connect your GCP account to JellyCloud using a service account JSON key file.

JellyCloud requires permissions to manage compute instances, networking security rules, and storage on your behalf. The simplest way to grant these is with the following three predefined GCP roles:

| Role | Role ID | Purpose |
|---|---|---|
| Compute Instance Admin (v1) | `roles/compute.instanceAdmin.v1` | Create and manage VM instances |
| Compute Security Admin | `roles/compute.securityAdmin` | Manage firewall rules and security policies |
| Compute Storage Admin | `roles/compute.storageAdmin` | Manage disks and storage resources |

If your organization requires a custom role with more granular permissions, assign the specific permissions covered by those roles to a custom role instead.

### Option A: Google Cloud Console

1. Open the [GCP Console](https://console.cloud.google.com/) and select your project.
2. Go to **IAM & Admin → Service Accounts**.
3. Click **Create Service Account**.
4. **Name:** e.g. `jellycloud-platform`
5. Click **Create and Continue**.
6. In **Grant this service account access to the project**, add all three roles:
   - `Compute Instance Admin (v1)` (`roles/compute.instanceAdmin.v1`)
   - `Compute Security Admin` (`roles/compute.securityAdmin`)
   - `Compute Storage Admin` (`roles/compute.storageAdmin`)
7. Click **Continue**, then **Done**.
8. Click the service account you just created and go to the **Keys** tab.
9. Click **Add Key → Create new key → JSON → Create**.

A `.json` file will download automatically. This is the file to upload to JellyCloud.

### Option B: gcloud CLI

```bash
# Set your project
PROJECT_ID="your-project-id"
SA_NAME="jellycloud-platform"
SA_EMAIL="${SA_NAME}@${PROJECT_ID}.iam.gserviceaccount.com"

# Create the service account
gcloud iam service-accounts create "${SA_NAME}" \
  --project="${PROJECT_ID}" \
  --display-name="JellyCloud Platform"

# Grant required roles
gcloud projects add-iam-policy-binding "${PROJECT_ID}" \
  --member="serviceAccount:${SA_EMAIL}" \
  --role="roles/compute.instanceAdmin.v1"

gcloud projects add-iam-policy-binding "${PROJECT_ID}" \
  --member="serviceAccount:${SA_EMAIL}" \
  --role="roles/compute.securityAdmin"

gcloud projects add-iam-policy-binding "${PROJECT_ID}" \
  --member="serviceAccount:${SA_EMAIL}" \
  --role="roles/compute.storageAdmin"

# Generate and download the JSON key
gcloud iam service-accounts keys create credentials.json \
  --iam-account="${SA_EMAIL}"
```

The file `credentials.json` is now ready to upload to JellyCloud.

:::note Firewall rules
JellyCloud tests connectivity after credentials are saved. Firewall rules are only configured if the default GCP rules block the required port — in most projects no changes are needed.
:::

### Add to JellyCloud

In the Console, navigate to the **Providers** page, select **Google Cloud**, and click **Apply**. Upload the JSON key file and click **Continue**. JellyCloud will validate the credentials before storing them in a secured secret manager.
