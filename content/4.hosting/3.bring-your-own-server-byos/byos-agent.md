---
title: BYOS Agent
description: Reference implementation for handling BYOS webhooks and executing deployment scripts.
seo:
  title: BYOS Agent
  description: Reference implementation for handling BYOS webhooks and executing deployment scripts.
sitemap:
  loc: /hosting/bring-your-own-server-byos/byos-agent
  lastmod: 2026-04-08
  changefreq: monthly
  priority: 1.0

---

The [`@laioutr/byos-agent`](https://www.npmjs.com/package/@laioutr/byos-agent) package is a ready-to-use webhook handler that executes bash scripts in response to deployment events from the Cockpit. Use it as-is for simple deployments, or as a starting point for custom implementations.

## What It Does

The agent runs an HTTP server that:

- Receives signed [webhooks](/hosting/bring-your-own-server-byos/webhook-config) from the Cockpit
- Verifies signatures using the [Standard Webhooks](https://www.standardwebhooks.com/) specification
- Executes configurable shell scripts for each event type
- Reports deployment status back via callbacks

## Quick Start

```bash
npm install @laioutr/byos-agent
```

Create a `byos-agent.config.ts` in your project root:

```typescript
import type { WebhookRunnerConfigInput } from '@laioutr/byos-agent';

export default {
  baseUrl: 'https://your-server.com',
  signingSecret: process.env.LAIOUTR_SIGNING_SECRET || 'whsec_...',
  scripts: {
    'hosting.deployment.created': './scripts/deploy.sh',
    'hosting.deployment.delete': './scripts/delete.sh',
    'hosting.deployment.promote': './scripts/promote.sh',
  },
} satisfies WebhookRunnerConfigInput;
```

Start the agent:

```bash
npx @laioutr/byos-agent
```

## Examples

The package includes complete deployment examples:

- **Docker + Traefik** - Containerized deployments with automatic Traefik routing
- **PM2** - Bare metal deployments with PM2 process manager

Both examples support preview deployments and promotion to production. See the [examples on GitHub](https://github.com/laioutr/byos-agent/tree/main/examples).

## Resources

- [GitHub Repository](https://github.com/laioutr/byos-agent) -- Full documentation, configuration reference, and examples
- [Webhook Configuration](/hosting/bring-your-own-server-byos/webhook-config) -- Event types, payload structure, and callback format
