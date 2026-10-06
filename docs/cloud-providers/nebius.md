---
id: nebius
title: Nebius
sidebar_position: 10
---

# Nebius

## Connect your account {#credentials}

Connect your Nebius account to JellyCloud using a service account with an authorized key.

### Option A: Nebius web console

1. In the [Nebius console](https://console.nebius.com/), go to **Administration** → **IAM**.
2. Click **Create resource** → **Service account**. Enter a name (e.g. `jellycloud`), choose the project JellyCloud should use, and click **Create and continue**.
3. Add `editors` group. This grants the permissions JellyCloud needs to manage compute, disks, and networking in the project. Close the dialog window.
4. Open the new service account, go to the **Authorized keys** tab, and click **Upload authorized key**. The **Upload authorized key** dialog opens.
5. On your machine, generate a key pair with the commands shown in the dialog. This creates two files:
   - **`public.pem`:** uploaded to Nebius in the next step.
   - **`private.pem`:** uploaded to JellyCloud. Keep it secure and do not share it.

   Check the first line of `private.pem`. JellyCloud requires `-----BEGIN PRIVATE KEY-----`. If yours starts with `-----BEGIN RSA PRIVATE KEY-----` (common with the OpenSSL that ships with macOS), convert it and upload the converted file to JellyCloud instead:

   ```bash
   openssl pkcs8 -topk8 -nocrypt -in private.pem -out private-pkcs8.pem
   ```

6. In the dialog, click **Attach file** and select `public.pem`. Optionally set an **Expiration date**. If you do, you will need to upload a new key to Nebius and update JellyCloud before it expires. Click **Upload key**.
7. Copy the **Service Account ID** (starts with `serviceaccount-`) and the **Public Key ID** (starts with `publickey-`) of the uploaded key.

### Option B: Nebius CLI

```bash
# Generate the key pair (private.pem goes to JellyCloud, public.pem to Nebius)
openssl genpkey -algorithm RSA -pkeyopt rsa_keygen_bits:4096 -out private.pem
openssl pkey -in private.pem -pubout -out public.pem

# Create the service account and capture its ID
export SA_ID=$(nebius iam service-account create \
  --name jellycloud \
  --parent-id <project-id> \
  --format jsonpath='{.metadata.id}')

# Add the service account to the editors group
# (find your tenant ID with: nebius iam get-tenants)
export EDITORS_GROUP_ID=$(nebius iam group get-by-name \
  --name editors \
  --parent-id <tenant-id> \
  --format jsonpath='{.metadata.id}')

nebius iam group-membership create \
  --parent-id "${EDITORS_GROUP_ID}" \
  --member-id "${SA_ID}"

# Upload the public key
nebius iam auth-public-key create \
  --account-service-account-id "${SA_ID}" \
  --data "$(cat public.pem)"

echo "Service Account ID: ${SA_ID}"
```

The output of the last command includes the Public Key ID (starts with `publickey-`).

:::note
You must belong to a group with the `admin` role in your tenant (such as the default `admins` group) to create service accounts and manage group membership.
:::

### Add to JellyCloud

In the Console, navigate to the **Providers** page, select **Nebius**, and click **Connect**. Enter your **Project ID** (e.g. `project-e00...`), **Service Account ID**, and **Public Key ID**, then upload `private.pem`. Click **Apply**. JellyCloud will validate the credentials before storing them in a secured secret manager.

:::tip Shared storage
On Nebius, PVCs with access mode `ReadWriteMany` or `ReadOnlyMany` are provisioned as Nebius Shared File Systems that many pods can mount at once. See [Shared file systems](/configuration/volumes#shared-file-systems-readwritemany).
:::
