---
title: Newsletter Registration
description: Full-width newsletter subscription section with status messages, customizable copy, and an optional image prop.
playground:
  name: NewsletterRegistration
  base: ui-sections-newsletterregistration
  defaultStory: default
  height: 460px
jiraIssueId: LUI-214
seo:
  title: Newsletter Registration | Laioutr
  description: Full-width newsletter subscription section.
sitemap:
  loc: /laioutr-ui/cms/newsletter/newsletter-registration
  lastmod: 2026-05-15
  changefreq: monthly
  priority: 1.0
aliases:
  - /laioutr-ui/cms/newsletter/newsletterregistration
---

## Overview

`NewsletterRegistration` is the dedicated email-list signup section, typically placed in footer regions. It bundles a heading, subline, an `EmailInputForm`, customizable status messages (loading, success, error, neutral), and an optional `image` prop that paints media alongside the copy.

Background colors and text adapt to the surrounding surface tone via `<OnSurface>`, so the section reads against any backdrop. Place it above the footer so signup is visible without separate-page navigation.

## Key Business & UX Benefits

- A dedicated, full-width signup section gives email acquisition its own stage, lifting list growth without spinning up a separate page.
- Customizable status messages (loading, success, error, neutral) reassure shoppers at every step, cutting support tickets about "did my signup work".
- Surface-tone awareness keeps the section legible on any footer backdrop, so brand teams style freely without breaking contrast.
- Editors update the heading, subline, and media for each campaign in Studio, so seasonal hooks like "early access" or "10% off" ship the same day.

:::tip
Pro-Tip from Larry: Place `NewsletterRegistration` above the footer so signup is visible without separate-page navigation.
:::

## Feature List

::features
---
items:
  - "Full-width section bundles heading, subline, EmailInputForm, status messages, and an optional image prop"
  - "Customizable status copy for loading, success, error, and neutral states reassures shoppers at every step"
  - "Surface-tone awareness via <OnSurface> keeps the section legible against any footer backdrop"
  - "Optional image prop pairs media with the signup copy for richer placements"
  - "Editors update heading, subline, and image per campaign in Studio so seasonal hooks ship same-day"
  - "Place above the footer so signup is visible without separate-page navigation"
---
::

## API Reference

::component-meta{:name="NewsletterRegistration"}
::
