---
title: Bring your own Server
description: Integrate with the Laioutr Cockpit
---

# Webhooks configuration

The best way to integrate your own hosting solution into the Laioutr is to setup a webhook. The Cockpit will call this webhook for every deployment-related action, e.g.:

- Deployments
- Status Updates & Logs
- Deployment Cancellation
- Deployment Promotion
- Rollbacks

You simply provide a URL the Cockpit will call for each of these actions.
