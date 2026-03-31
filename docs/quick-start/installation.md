---
id: installation
title: Installation
sidebar_position: 2
---

# Installation

## Install the JellyCloud CLI

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="macos" label="macOS" default>

```bash
brew install jellycloud/tap/jelly
```

  </TabItem>
  <TabItem value="linux" label="Linux">

```bash
curl -fsSL https://get.jellycloud.io | sh
```

  </TabItem>
  <TabItem value="windows" label="Windows">

```powershell
winget install JellyCloud.CLI
```

  </TabItem>
</Tabs>

## Verify the installation

```bash
jelly --version
```

## Authenticate

```bash
jelly auth login
```

This opens a browser window for OAuth login. After authenticating, your credentials are stored locally at `~/.jelly/credentials`.

## Next step

[Deploy your first workload →](./first-deployment)
