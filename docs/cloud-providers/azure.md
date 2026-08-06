---
id: azure
title: Microsoft Azure
sidebar_position: 6
---

# Microsoft Azure

## Connect your account {#credentials}

Connect your Azure account to JellyCloud using a Service Principal created from the JellyCloud multi-tenant Azure application. This grants JellyCloud the permissions it needs to manage compute resources within your subscription.

### Prerequisites

You need the [Azure CLI](https://learn.microsoft.com/en-us/cli/azure/install-azure-cli) installed and logged in to the target Azure account:

```bash
az login
```

### 1. Create the Service Principal

JellyCloud is registered as a multi-tenant Azure application. Run the following command in your Azure tenant to create a Service Principal from it:

```bash
az ad sp create --id 0eee1226-b7ce-41a5-8408-1feffeff9926
```

This registers JellyCloud's application in your tenant. Note the `id` field in the output — this is the Service Principal Object ID you will use in the next step.

### 2. Grant Contributor access to your subscription

Assign the `Contributor` role to the Service Principal on the target subscription:

```bash
az role assignment create \
  --assignee <ServicePrincipalObjectID> \
  --role Contributor \
  --scope "/subscriptions/<your-subscription-id>"
```

Replace `<ServicePrincipalObjectID>` with the `id` from the previous step, and `<your-subscription-id>` with your Azure subscription ID.

The `Contributor` role gives JellyCloud permission to create, manage, and delete compute resources within the subscription scope. JellyCloud does not have access to resources outside this subscription.

### 3. Add to JellyCloud

In the Console, navigate to the **Providers** page, select **Microsoft Azure**, and click **Connect**. Enter your **Subscription ID** and **Tenant ID**, then click **Apply**. JellyCloud will validate the credentials before storing them in a secured secret manager.

:::tip Finding your Tenant ID
Run `az account show --query tenantId -o tsv` to retrieve your Tenant ID.
:::


:::tip Required resource providers
The following resource providers must be registered on your subscription. They are usually registered by default but worth confirming on a fresh subscription:
- `Microsoft.Compute`
- `Microsoft.Network`
- `Microsoft.Resources`
:::

## Custom role: minimum required permissions

If your organization requires a custom role instead of `Contributor`, the tables below list every individual permission JellyCloud needs and why.

**VM lifecycle** (`Microsoft.Compute`)

| Permission | Used by |
|---|---|
| `Microsoft.Compute/virtualMachines/read` | Instance lookup, listing VMs, connectivity check |
| `Microsoft.Compute/virtualMachines/write` | Creating VMs; attaching and detaching disks |
| `Microsoft.Compute/virtualMachines/delete` | Deleting VMs |
| `Microsoft.Compute/virtualMachines/start/action` | Starting a stopped VM |
| `Microsoft.Compute/virtualMachines/deallocate/action` | Stopping a running VM |
| `Microsoft.Compute/virtualMachines/instanceView/read` | Reading per-VM power state |
| `Microsoft.Compute/disks/write` | Creating persistent volumes |
| `Microsoft.Compute/disks/delete` | Deleting volumes and OS disk cleanup on VM deletion |

**Networking — always required** (`Microsoft.Network`)

Every VM gets its own NIC, VNet, subnet, and NSG provisioned by JellyCloud.

| Permission | Used by |
|---|---|
| `Microsoft.Network/networkInterfaces/write`, `/read`, `/delete` | NIC create, IP resolution, and cleanup on VM deletion |
| `Microsoft.Network/networkInterfaces/join/action` | Attaching the NIC to the VM |
| `Microsoft.Network/virtualNetworks/write` | VNet creation |
| `Microsoft.Network/virtualNetworks/subnets/write` | Subnet creation |
| `Microsoft.Network/virtualNetworks/subnets/join/action` | Placing the NIC on the subnet |
| `Microsoft.Network/networkSecurityGroups/write` | Creating the NSG and its rules |
| `Microsoft.Network/networkSecurityGroups/join/action` | Attaching the NSG to the subnet |

**Networking — conditional** (only when direct node connectivity is enabled)

| Permission | Used by |
|---|---|
| `Microsoft.Network/publicIPAddresses/write` | Provisioning the VM's public IP |
| `Microsoft.Network/publicIPAddresses/read` | IP resolution and pre-detach checks |
| `Microsoft.Network/publicIPAddresses/delete` | Cleanup on VM deletion |
| `Microsoft.Network/publicIPAddresses/join/action` | Associating the public IP with the NIC |

**Resource management** (`Microsoft.Resources`)

| Permission | Used by |
|---|---|
| `Microsoft.Resources/subscriptions/resourceGroups/write` | Creating the per-region `jellycloud-{location}` resource group |
| `Microsoft.Resources/subscriptions/resourceGroups/read` | Targeting the resource group on all subsequent calls |

