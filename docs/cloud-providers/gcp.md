---
id: gcp
title: Google Cloud (GCP)
sidebar_position: 1
---

# Google Cloud (GCP)

## Connect your account {#credentials}

Connect your GCP account to JellyCloud using a service account JSON key file.

JellyCloud requires permissions to manage compute instances, images, networking, and storage on your behalf. Grant the following five predefined GCP roles to the service account:

| Role | Role ID | Purpose |
|---|---|---|
| Compute Image User | `roles/compute.imageUser` | Read and use image resources |
| Compute Instance Admin (v1) | `roles/compute.instanceAdmin.v1` | Create and manage VM instances, disks, and snapshots |
| Compute Network User | `roles/compute.networkUser` | Use Compute Engine networking resources |
| Compute Storage Admin | `roles/compute.storageAdmin` | Manage disks and storage resources |
| Compute Viewer | `roles/compute.viewer` | Read-only access to Compute Engine resources |

### Option A: Google Cloud Console

1. Open the [GCP Console](https://console.cloud.google.com/) and select your project.
2. Go to **IAM & Admin → Service Accounts**.
3. Click **Create Service Account**.
4. **Name:** e.g. `jellycloud-platform`
5. Click **Create and Continue**.
6. In **Grant this service account access to the project**, add all five roles:
   - `Compute Image User` (`roles/compute.imageUser`)
   - `Compute Instance Admin (v1)` (`roles/compute.instanceAdmin.v1`)
   - `Compute Network User` (`roles/compute.networkUser`)
   - `Compute Storage Admin` (`roles/compute.storageAdmin`)
   - `Compute Viewer` (`roles/compute.viewer`)
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
  --role="roles/compute.imageUser"

gcloud projects add-iam-policy-binding "${PROJECT_ID}" \
  --member="serviceAccount:${SA_EMAIL}" \
  --role="roles/compute.instanceAdmin.v1"

gcloud projects add-iam-policy-binding "${PROJECT_ID}" \
  --member="serviceAccount:${SA_EMAIL}" \
  --role="roles/compute.networkUser"

gcloud projects add-iam-policy-binding "${PROJECT_ID}" \
  --member="serviceAccount:${SA_EMAIL}" \
  --role="roles/compute.storageAdmin"

gcloud projects add-iam-policy-binding "${PROJECT_ID}" \
  --member="serviceAccount:${SA_EMAIL}" \
  --role="roles/compute.viewer"

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

## Custom role: minimum required permissions

If your organization requires a custom role instead of the predefined roles above, the tables below list every individual permission JellyCloud needs and why.

**VM lifecycle**

| Permission | Used by |
|---|---|
| `compute.instances.get` | Instance lookup before operations |
| `compute.instances.list` | Aggregated VM listing |
| `compute.instances.create` | Creating VM instances |
| `compute.instances.delete` | Deleting VM instances |
| `compute.instances.start` | Starting a stopped instance |
| `compute.instances.stop` | Stopping a running instance |
| `compute.instances.attachDisk` | Attaching a volume to an instance |
| `compute.instances.detachDisk` | Detaching a volume from an instance |

**Disks**

| Permission | Used by |
|---|---|
| `compute.disks.create` | Creating persistent volumes |
| `compute.disks.delete` | Deleting persistent volumes |
| `compute.disks.use` | Attaching a disk to an instance |
| `compute.disks.get` | Polling disk status during attach and create |

**Images, networking, and GPU**

| Permission | Used by |
|---|---|
| `compute.images.useReadOnly` | Boot disk sourced from public images (e.g. `ubuntu-os-cloud`, `debian-cloud`) — satisfied automatically for public images |
| `compute.networks.get`, `compute.networks.use` | Placing VMs on the project network |
| `compute.subnetworks.use` | Placing VMs on a subnetwork |
| `compute.acceleratorTypes.get` | GPU VMs only |

**Firewall** (conditional — only required when direct node connectivity is enabled)

| Permission | Used by |
|---|---|
| `compute.firewalls.get` | Checking whether the required firewall rule already exists |
| `compute.firewalls.create` | Creating the rule if it is missing |

**Zones, regions, and operations**

| Permission | Used by |
|---|---|
| `compute.regions.list` | Connectivity check during credential validation |
| `compute.zoneOperations.get` | Polling zonal operations (create, delete, attach, detach, start, stop) |
| `compute.regionOperations.get` | Polling regional operations |
| `compute.globalOperations.get` | Polling the firewall-create operation |

**Cloud Storage** (conditional — only required when the model-cache bucket feature is enabled)

| Permission | Used by |
|---|---|
| `storage.buckets.create` | Creating the model cache bucket |
| `storage.hmacKeys.list` | Listing existing HMAC keys before rotation |
| `storage.hmacKeys.update` | Deactivating old keys |
| `storage.hmacKeys.delete` | Removing old keys |
| `storage.hmacKeys.create` | Issuing a fresh HMAC key |

:::note Required APIs
Enable the following APIs on your GCP project:
- `compute.googleapis.com` — always required
- `storage.googleapis.com` — required only if using the model-cache bucket feature
:::
