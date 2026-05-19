---
title: Iframe
description: Iframe wrapper with responsive desktop and mobile heights and a required accessible title.
seo:
  title: Iframe | Laioutr
  description: Iframe wrapper with responsive heights.
sitemap:
  loc: /laioutr-ui/ui-kit/general/iframe
  lastmod: 2026-05-15
  changefreq: monthly
  priority: 1.0
---

## Overview

`Iframe` is the `<iframe>` wrapper for any embed that needs a controlled, responsive height. Pass the required `src` and accessible `title`, then tune the rendered height per breakpoint with `desktopHeight` (default 500px) and `mobileHeight` (default 600px); the heights bind to the iframe via `v-bind` CSS, so the embed swaps at the `sm` breakpoint without inline styles.

## Key Business & UX Benefits

- A required `title` prop forces an accessible screen-reader label on every embed, keeping third-party content compliant by default.
- Per-breakpoint heights mean embedded media never collapses on mobile or stretches awkwardly on desktop, protecting layout stability across devices.
- A consistent wrapper class anchors theme overrides such as max-width clamps or border radius without re-templating every embed call site.

## Usage

::component-code
---
:name: LIframe
:story-height: 200px
story-id: ui-kit-atoms-iframe--default
title: Iframe Default
---
```vue-template
<Iframe
    src="https://example.com/embed/abc"
    title="Featured video"
    :desktop-height="500"
    :mobile-height="600"
  />
```
::

## Feature List

::features
---
items:
  - "Required `title` prop forces an accessible screen-reader label on every embed"
  - "Responsive height with separate `mobileHeight` (default 600px) and `desktopHeight` (default 500px) props swapped at the `sm` breakpoint"
  - "`v-bind`-driven CSS computes the height from props directly, no inline-style overrides needed"
  - "Single `.iframe` class anchors theme overrides such as max-width clamps or border radius"
---
::


## API Reference

::component-meta{:name="Iframe"}
::
