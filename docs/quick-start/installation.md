---
id: installation
title: Getting Started
sidebar_position: 2
---

# Getting Started

## 1. Create your account

Start by signing up for a JellyCloud account through the Console.

<p>
  <a href="https://console.jellycloud.io/signup" className="button button--primary button--lg">Open Console →</a>
</p>

Fill in the sign-up form and click **Create Account**. JellyCloud will send a confirmation code to your email — enter it to activate your account.

Two fields worth noting:

- **Tenant name** — a tenant corresponds to a cloud account. If you operate multiple tenants (e.g. dev and prod), each gets its own name.
- **Tenant color** — a visual label to help distinguish between tenants at a glance, handy when you're working across more than one account.

Once confirmed, you're ready to connect your infrastructure.

## 2. Add instances

Navigate to the **Resources** page in the Console. From there, you have two options for connecting compute:

### Self-install

Use the self-install link provided in the Console to add existing machines as instances. This is the quickest path if you already have infrastructure running.

### Node Pools (Autoscaler)

Configure **Node Pools** to let JellyCloud automatically provision and scale compute on your behalf. Set your desired instance types, minimum and maximum node counts, and the Autoscaler handles the rest — scaling up when demand grows and back down when it subsides.

## Next step

[Deploy your first workload →](./first-deployment)
