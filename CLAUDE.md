# JellyCloud Docs — Instructions

## Sources of truth

- **Cloud Providers** (`docs/cloud-providers/`) is sourced from https://github.com/jellycloud-io/node-shared-lib/blob/develop/src/cloud-providers/consumer/providers.ts (the `cloudProvidersInfo` array). Fetch the file from the `develop` branch before updating. The old `jellycloud-io/catalog` repo is deprecated; do not use it. For credential fields and onboarding steps, the Console forms live in `jellycloud-io/dashboard` under `src/shared/components/credentials-section/`. Include only clouds where `byoCloudStatus` or `jellyCloudStatus` is `ENABLED` or `COMING_SOON` — mark coming-soon ones clearly. Strip internal fields (auth method details, compliance lists, spot discount percentages). Do not invent providers not present in the file. Each enabled provider must have a corresponding page under `docs/cloud-providers/` — always cross-check that every row in the index table has a matching page, and every page has a matching row in the table. The index page (`index.mdx`) renders provider cards via `src/components/CloudProviderCards/index.tsx` — update the `providers` array in that component when adding or removing providers.

- **Supported Platforms** (`docs/supported-platforms/`) is sourced from the Confluence page at https://jellycloud.atlassian.net/wiki/spaces/5f87533100ea43219aa8c0f72c51b835/pages/95518723/Supported+Platforms. When updating this section, fetch the latest Confluence page first and populate the docs from it. Strip any internal/temp notes before publishing.

## Docs structure

- **Quick Start** (`docs/quick-start.md`) covers only the basic, seamless setup: account, connecting nodes (Self-Install command, basic Node Pool steps), and connecting a cluster with the default Helm command. No optional parameters or advanced configuration. Link to the Configuration pages instead.
- **Configuration** (`docs/configuration/`) holds everything beyond the basics:
  - `cluster-setup.md`: Operator install methods, access modes (seamless and selective/namespaced), cluster-wide defaults (`ClusterConfig`), private registries, GKE/AKS/EKS, disconnecting.
  - `nodes-and-node-pools.md`: self-hosted node options (startup scripts, provider override variables) and all Node Pool settings (location, capacity type, Advanced Settings, management, scale-down).
  - `volumes.md`: all PVC configuration (shared-storage placement, static PVC opt-in, Nebius shared file systems, passthrough, block devices, lifecycle). Core Concepts > Persistent Volumes only explains how volumes work, volume types per cloud, and single vs multiple attachment.
  - `workload-policies.md`: `WorkloadConfig`, precedence, the settings reference, and labels/annotations (supported but not recommended).
- The sidebar is defined by hand in `sidebars.ts`. Add every new page there.
- When moving or renaming a page, add a redirect in the `@docusaurus/plugin-client-redirects` config in `docusaurus.config.ts`.

## Writing style

- Do not use dashes (em dashes or en dashes) in prose text. Use a colon, a period, or rewrite the sentence instead.
- In numbered or bulleted lists, use a colon after the bold term rather than a dash (e.g. "**Term:** description" not "**Term** — description").
- In numeric ranges, use "to" rather than an en dash (e.g. "2 to 5 minutes" not "2–5 minutes").

## Cloud provider page structure

Each file under `docs/cloud-providers/` must follow this structure exactly:

```markdown
---
id: <provider-id>
title: <Provider Name>
sidebar_position: <N>
---

# <Provider Name>

## Connect your account {#credentials}

<One sentence describing what credential type is used to connect.>

### <Step to obtain credentials>

<Instructions for getting the credential from the provider's console or CLI.>

### Add to JellyCloud

In the Console, go to **Cloud Providers**, click **Add Provider**, select **<Provider Name>**, and <describe what to enter/upload>.
```

Rules:
- The `## Connect your account {#credentials}` heading is mandatory and must use exactly that title and tag. This makes the section deep-linkable via `#credentials` on every provider page.
- The intro sentence (what credential type is used) goes **under** the `## Connect your account` heading, not above it.
- Credential-retrieval steps are `###` subsections under `## Connect your account`.
- If a provider offers multiple methods (e.g., console and CLI), use `### Option A:` and `### Option B:` subsections, then a final `### Add to JellyCloud` subsection.
- Do not add a standalone intro paragraph above `## Connect your account` — the page title (`#`) is sufficient context.

## Product facts

- The internal Kubernetes namespace used by JellyCloud is `jelly`.
