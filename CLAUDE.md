# JellyCloud Docs — Instructions

## Sources of truth

- **Cloud Providers** (`docs/cloud-providers/`) is sourced from https://github.com/jellycloud-io/catalog/blob/develop/catalog/clouds.ts. Fetch the file from the `develop` branch before updating. Include only clouds where `byoCloudStatus` or `jellyCloudStatus` is `ENABLED` or `COMING_SOON` — mark coming-soon ones clearly. Strip internal fields (auth method details, compliance lists, spot discount percentages). Do not invent providers not present in the file. Each enabled provider must have a corresponding page under `docs/cloud-providers/` — always cross-check that every row in the index table has a matching page, and every page has a matching row in the table.

- **Supported Platforms** (`docs/supported-platforms/`) is sourced from the Confluence page at https://jellycloud.atlassian.net/wiki/spaces/5f87533100ea43219aa8c0f72c51b835/pages/95518723/Supported+Platforms. When updating this section, fetch the latest Confluence page first and populate the docs from it. Strip any internal/temp notes before publishing.

## Product facts

- The internal Kubernetes namespace used by JellyCloud is `jelly`.
