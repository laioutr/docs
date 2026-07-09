---
title: PopUp Newsletter
description: Newsletter signup popup content preset with headline, body, and an embedded EmailInputForm. Slots into PopUp.
playground:
  name: PopUpNewsletter
  base: ui-blocks-popupnewsletter
  defaultStory: default
  height: 460px
seo:
  title: PopUp Newsletter
  description: Newsletter signup popup content preset for the PopUp shell.
sitemap:
  loc: /laioutr-ui/cms/popups/pop-up-newsletter
  lastmod: 2026-05-15
  changefreq: monthly
  priority: 1.0
---

## Overview

`PopUpNewsletter` is the newsletter-signup popup content preset. It composes a `TextGroup` (optional icon, caption, heading, body), an `EmailInputForm`, and an optional fine-print hint. It owns no dialog chrome of its own. Drop it into [`PopUp`](/laioutr-ui/cms/popups/pop-up)'s default slot for first-visit signup prompts and exit-intent popups.

## Key Business & UX Benefits

- Captures first-visit and exit-intent traffic that would otherwise leave without signing up, the single highest-yield lever for email list growth.
- Bundles media, copy, and the embedded signup form into one preset, so launching a new acquisition popup is a Studio task, not a sprint.
- Inherits focus management and keyboard support from the `PopUp` shell, keeping accessibility solid even on a high-traffic surface.
- Editors run seasonal hooks ("early access", "welcome offer") through the same component, keeping voice and design consistent across campaigns.

## Feature List

::features
---
items:
  - "Composes a TextGroup (optional icon, caption, heading, body), an EmailInputForm, and an optional fine-print hint"
  - "Built for first-visit signup prompts and exit-intent popups where email capture has the highest yield"
  - "Inherits focus management and keyboard support from the PopUp shell, with no extra accessibility work"
  - "Editors run seasonal hooks (welcome offer, early access) through one component, keeping voice and design consistent"
  - "Drops into the PopUp shell's default slot, so the same shell powers info, newsletter, and promotion popups"
---
::

## API Reference

::component-meta{:name="PopUpNewsletter"}
::
