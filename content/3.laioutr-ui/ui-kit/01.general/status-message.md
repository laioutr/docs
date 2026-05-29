---
title: Status Message
description: Icon-led message composition for confirmation, success, warning, and error states.
playground:
  name: StatusMessage
  base: ui-kit-molecules-statusmessage
  defaultStory: default
  height: 460px
seo:
  title: Status Message | Laioutr
  description: Icon-led message composition.
sitemap:
  loc: /laioutr-ui/ui-kit/general/status-message
  lastmod: 2026-05-15
  changefreq: monthly
  priority: 1.0
---

## Overview

`StatusMessage` is the icon-led message composition for confirmation, success, warning, and error states. It takes a required `icon`, an optional `heading` and `description`, and a `status` (`'default'`, `'success'`, `'warning'`, or `'error'`) that colors the icon via the `--success-9`, `--warning-9`, and `--error-9` tokens.

Because the icon is required, the message always carries a visual cue alongside the text.

## Key Business & UX Benefits

- Clear success messaging after add-to-cart and checkout actions reduces uncertainty, which directly correlates with continued purchase intent.
- Required icon means every status message carries a visual cue, so users with text-skimming patterns still see the state at a glance.
- Token-driven status colors (`--success-9`, `--warning-9`, `--error-9`) keep semantic meaning consistent across the storefront and admin areas.

## Feature List

::features
---
items:
  - "Four `status` values ('default', 'success', 'warning', 'error') color the icon via `--success-9`, `--warning-9`, and `--error-9` tokens"
  - "Required `icon` prop guarantees a visual cue accompanies every message, helping skim-readers spot the state"
  - "Optional `heading` and `description` keep the same composition usable for one-liner toasts and longer status copy"
  - "Token-driven colors stay semantic across light, dark, and brand themes without per-status overrides"
  - "Pairs with `Toaster` and inline form chrome, so confirmation messaging stays visually consistent across surfaces"
---
::

## API Reference

::component-meta{:name="StatusMessage"}
::
