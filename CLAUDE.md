# JellyCloud Docs — Instructions

## Sources of truth

- **Cloud Providers** (`docs/cloud-providers/`) is sourced from https://github.com/jellycloud-io/catalog/blob/develop/catalog/clouds.ts. Fetch the file from the `develop` branch before updating. Include only clouds where `byoCloudStatus` or `jellyCloudStatus` is `ENABLED` or `COMING_SOON` — mark coming-soon ones clearly. Strip internal fields (auth method details, compliance lists, spot discount percentages). Do not invent providers not present in the file. Each enabled provider must have a corresponding page under `docs/cloud-providers/` — always cross-check that every row in the index table has a matching page, and every page has a matching row in the table. The index page (`index.mdx`) renders provider cards via `src/components/CloudProviderCards/index.tsx` — update the `providers` array in that component when adding or removing providers.

- **Supported Platforms** (`docs/supported-platforms/`) is sourced from the Confluence page at https://jellycloud.atlassian.net/wiki/spaces/5f87533100ea43219aa8c0f72c51b835/pages/95518723/Supported+Platforms. When updating this section, fetch the latest Confluence page first and populate the docs from it. Strip any internal/temp notes before publishing.

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
