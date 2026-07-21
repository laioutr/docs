---
title: PopUp Info
description: Informational popup content preset with icon, caption, heading, body, and a primary CTA. Slots into PopUp.
playground:
  name: PopUpInfo
  base: ui-blocks-popupinfo
  defaultStory: default
  height: 460px
seo:
  title: PopUp Info
  description: Informational popup content preset for the PopUp shell.
sitemap:
  loc: /laioutr-ui/cms/popups/pop-up-info
  lastmod: 2026-05-15
  changefreq: monthly
  priority: 1.0
---

## Overview

`PopUpInfo` is the informational popup content preset. It renders a `TextGroup` (optional icon, caption, heading, body) plus a single primary call-to-action; it owns no dialog chrome of its own. Drop it into [`PopUp`](/laioutr-ui/cms/popups/pop-up)'s default slot for announcements, terms-update notices, or any one-message popup.

## Key Business & UX Benefits

- Delivers urgent announcements (policy changes, service updates, regional notices) without forcing a banner across the whole site.
- A single CTA keeps the message focused, so customers act on the notice instead of dismissing a busy popup.
- Editors fire announcements through Studio when policy or operations change, removing the engineering bottleneck on time-sensitive comms.
- Built on the shared `PopUp` shell, so it inherits focus management and keyboard interaction with no extra accessibility work.

## Feature List

::features
---
items:
  - "Renders a TextGroup (optional icon, caption, heading, body) plus a single primary CTA inside the PopUp shell"
  - "No dialog chrome of its own, so all focus, keyboard, and ARIA handling stay with the shared PopUp shell"
  - "Single CTA keeps announcements focused, so customers act on the notice instead of dismissing busy content"
  - "Editors fire policy updates, service notices, and regional announcements from Studio without engineering"
  - "Alignment prop ('left' or 'center') matches the popup's overall content rhythm"
---
::

## API Reference

::component-meta{:name="PopUpInfo"}
::
