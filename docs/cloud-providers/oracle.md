---
id: oracle
title: Oracle Cloud
sidebar_position: 9
---

# Oracle Cloud

## Connect your account {#credentials}

Connect your Oracle Cloud Infrastructure (OCI) account to JellyCloud using an API signing key for an OCI user.

### 1. Create an API signing key

1. Sign in to the [OCI Console](https://cloud.oracle.com/) as the user JellyCloud should act as. A dedicated user for JellyCloud is recommended.
2. Open the profile menu in the top-right corner and select **User settings**.
3. Under **Tokens and keys** (or **API keys**), click **Add API key**.
4. Select **Generate API key pair** and click **Download private key**. Keep this `.pem` file secure.
5. Click **Add**. OCI displays a **Configuration file preview** containing the `user`, `fingerprint`, `tenancy`, and `region` values. Copy the entire preview. You will paste it into JellyCloud as is.

### 2. Grant permissions

JellyCloud needs permission to manage compute, networking, and block storage. In OCI, permissions are granted to a group, so the user from step 1 must belong to one. If it does not:

1. Go to **Identity & Security** → **Domains**.
2. Set the **Compartment** filter to your root compartment (the tenancy). Identity domains belong to a compartment, and the **Default** domain is in the root compartment, so it is not listed while a child compartment is selected.
3. Open the identity domain that contains the user from step 1. This is usually **Default**. If your organization keeps users in another domain, select that one, and note its name for the policy statements below.
4. Go to **User management** → **Groups**, create a group (e.g. `jellycloud`), and add the user to it.

Then create one policy with all the required statements:

1. In the OCI Console, go to **Identity & Security** → **Policies** and click **Create Policy**.
2. **Name:** enter a short name, such as `jellycloud`.
3. **Description:** enter a description, such as `Permissions for JellyCloud`.
4. **Compartment:** select your root compartment (the tenancy). The policy must live in the root compartment because one of its statements applies to the whole tenancy.
5. Under **Policy Builder**, click **Show manual editor** and paste the following statements. Replace `jellycloud` with your group name if it is different.

   ```text
   Allow group jellycloud to manage instance-family in tenancy
   Allow group jellycloud to manage virtual-network-family in tenancy
   Allow group jellycloud to manage volume-family in tenancy
   Allow group jellycloud to manage app-catalog-listing in tenancy
   Allow group jellycloud to manage object-family in tenancy
   Allow group jellycloud to inspect tenancies in tenancy
   ```

6. Click **Create**.

:::note
- To restrict JellyCloud to a single compartment instead of the whole tenancy, replace `in tenancy` with `in compartment <compartment-name>` in every statement except the last one (`inspect tenancies`). Use the same compartment when you enter the **Compartment OCID** in JellyCloud.
- If your group is in an identity domain other than **Default**, write it as `'<domain-name>'/'<group-name>'` in every statement (for example, `Allow group 'MyDomain'/'jellycloud' to ...`). This applies no matter which compartment the domain was created in. The policy itself still goes in the root compartment.
- The `object-family` statement is used only by the model cache feature, which creates an Object Storage bucket and a customer secret key for the user. You can leave it out if you do not use model cache. OCI allows at most two customer secret keys per user.
:::

### 3. Add to JellyCloud

In the Console, navigate to the **Providers** page, select **Oracle**, and click **Connect**. In the **Credentials** section:

1. Under **Fill fields from Oracle**, click **Paste Oracle configuration**.
2. Paste the configuration file preview you copied in step 1 into the **Oracle configuration** box, then click **Fill fields**. JellyCloud fills in **User OCID**, **Fingerprint**, **Tenancy OCID**, and the home region from the preview.
3. Enter the **Compartment OCID**. For the root compartment, use your Tenancy OCID. For any other compartment, copy its OCID from **Identity & Security** → **Compartments**.
4. Under **Private key file**, upload the private key (`.pem`) you downloaded in step 1. If the key is encrypted, also enter its passphrase.

Click **Apply**. JellyCloud will validate the credentials before storing them in a secured secret manager.
