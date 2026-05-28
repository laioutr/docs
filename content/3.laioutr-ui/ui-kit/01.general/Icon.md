---
title: Icon
description: Size-optimized icon variants with automatic resolution ensuring recognizability at small, medium, and large sizes.
playground:
  name: Icon
  base: ui-kit-atoms-icon
  defaultStory: default
  height: 460px
jiraIssueId: LUI-41
links:
  - label: Figma
    icon: i-simple-icons-figma
    to: https://www.figma.com/design/92moLelAY8lh8mI0rhCGzy/laioutr-UI?node-id=74-715&m=dev
    target: _blank
seo:
  title: Icon | Laioutr
  description: Size-optimized icon variants with automatic resolution ensuring recognizability at small, medium, and large sizes.
sitemap:
  loc: /laioutr-ui/ui-kit/general/icon
  lastmod: 2026-05-15
  changefreq: monthly
  priority: 1.0

---

## Overview

Icon renders the right asset for the size you ask for instead of scaling a single 24px master down. The component resolves the name through Iconify: names starting with `lsolar:` or `lhuge:` get a size suffix appended (`-s` for `s`, `-m` for `sm`, no suffix for `m`, `-l` for `l`), names starting with `emoji/` map to the active emoji set, and anything else is passed through to NuxtIcon untouched. Pick the size that matches the context so icons stay crisp at 16px badges and 32px feature blocks alike.

## Key Business & UX Benefits

- Size-specific assets keep icons crisp at 16px badges and 32px feature blocks, protecting perceived brand quality on every device.
- One naming convention (Iconify prefixes plus a size suffix) covers the whole library, so adding an icon means dropping it into the set.
- Sharp icons read faster than scaled-down vectors, especially in dense UI like cart drawers and account menus.

:::tip
Pro-Tip from Larry: Pick the size that matches your context so icons stay crisp and recognizable.
:::

## Usage

### Icons

::component-code
---
:name: LIcon
:story-height: 500px
story-id: ui-kit-atoms-icon--all-icons
title: Icons
---
```vue-template
<LIcon name="icon-name" />
```
::

## Feature List

::features
---
items:
  - "Four sizes ('s', 'sm', 'm', 'l') map to Iconify suffixes (`-s`, `-m`, no suffix, `-l`) so 16px icons read as crisply as 32px ones"
  - "Names with `lsolar:`/`lhuge:` prefixes pick up the size suffix; `emoji/` names map to the active emoji set; everything else passes through unchanged"
  - "Theme-level overrides via `theme.icons` swap the visual asset per icon name without touching consumer code"
  - "Renders through NuxtIcon, so the same prop surface covers local SVG sets and remote Iconify packs"
  - "Default size token (`--sizing-icon-size-m`) reserves space before the asset loads, preventing layout shift"
  - "`--icon-color` CSS custom property colors the glyph from the surrounding context, no `fill` prop needed"
---
::

## API Reference

::component-meta{:name="Icon"}
::
