---
title: Mega Menu
description: Desktop mega-menu compound built from `MegaMenu`, `MegaMenuTrigger`, and `MegaMenuContent` with auto-picked promo layouts.
playground:
  name: MegaMenu
  base: ui-blocks-megamenu
  defaultStory: default
  height: 460px
jiraIssueId: LUI-66
links:
  - label: Figma
    icon: i-simple-icons-figma
    to: https://www.figma.com/design/92moLelAY8lh8mI0rhCGzy/laioutr-UI?node-id=13944-50374&t=4gWdGg1GDlnYog3D-4
    target: _blank
seo:
  title: Mega Menu
  description: Desktop mega menu compound with auto-picked promo layouts.
sitemap:
  loc: /laioutr-ui/navigation/mega-menu
  lastmod: 2026-05-15
  changefreq: monthly
  priority: 1.0
aliases:
  - /laioutr-ui/navigation/megamenudesktop
changelogKeys:
  - MegaMenu
---

## Overview

`MegaMenu` is a compound built from a root (`MegaMenu`), per-category triggers (`MegaMenuTrigger`), and panel content (`MegaMenuContent`). Built on `NavigationMenu` primitives, so consumers can slot anything into the panel.

The promo slot picks its layout from the count of slotted children:

| Children | Layout class          | What you get                                 |
| -------- | --------------------- | -------------------------------------------- |
| 1        | `--flex` + `--narrow` | Single column, narrow max-width.             |
| 2        | `--flex`              | Two columns, flex layout.                    |
| 3+       | `--grid`              | Grid layout; the first child spans two rows. |

The panel is surface-tone aware, so a dark header gets a panel with matching font and icon colors.

Each top-level trigger can override its label color: `MegaMenuItem` carries an optional `textColor` (`ColorFieldValue`), resolved via `colorValueToCss()` and applied to the trigger label, falling back to the surface-tone cascade when unset. In Studio, `BlockMegaMenu` exposes a per-item color picker through an `as: 'style'` decorator on author-typed titles (entity-driven CMS items don't expose it).

## Key Business & UX Benefits

- Auto-picked promo layout (narrow, flex, or grid) means merchandising teams can drop in one, two, or several promo tiles without asking design for a new template each campaign.
- Wide visual surface lets shoppers see top-level categories and seasonal pushes at the same time, lifting click-through on promoted ranges without a dedicated landing page.
- Surface-tone aware panels keep mega-menu content readable across dark headers and bright brand themes, protecting the look on every property without manual color overrides.
- Compound architecture (root, trigger, content) lets engineers slot custom blocks per category, so a Sale tab can carry a different layout from the Men or Women tabs.

:::tip
Pro-Tip from Larry: Set `surface-tone="dark"` when the header itself is dark; the panel inherits matching font and icon colors.
:::

## Usage

::component-code
---
:name: LMegaMenu
story-id: ui-blocks-megamenu--four-columns
---
::

## Feature List

::features
---
items:
  - "Compound architecture splits root (`MegaMenu`), per-category `MegaMenuTrigger`, and panel `MegaMenuContent`"
  - "Built on `NavigationMenu` primitives so consumers can slot custom blocks into any panel"
  - "Promo slot auto-picks layout from child count: one child gets `--flex --narrow`, two get `--flex`, three or more get `--grid`"
  - "In the grid layout the first promo child spans two rows for a hero-style placement"
  - "`surface-tone` prop adapts the panel font and icon colors so dark headers and bright themes both stay readable"
  - "Triggers, content panels, and promo slots are configured directly on the compound, with no parent wrapper to inherit"
---
::

## API Reference

### LMegaMenu

::component-meta{:name="MegaMenu"}
::

### LMegaMenuTrigger

::component-meta{:name="MegaMenuTrigger"}
::

### LMegaMenuContent

::component-meta{:name="MegaMenuContent"}
::
