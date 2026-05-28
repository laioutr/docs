---
title: Mobile Menu (Basic)
description: Mobile off-canvas drawer paired with `HeaderBasic`, hosting links, a social row, locale selector, and dark-mode toggle.
playground:
  name: MobileMenuBasic
  base: ui-features-mobilemenubasic
  defaultStory: default
  height: 460px
jiraIssueId: LUI-65
links:
  - label: Figma
    icon: i-simple-icons-figma
    to: https://www.figma.com/design/92moLelAY8lh8mI0rhCGzy/laioutr-UI?node-id=2899-10340&t=mlUfKppRhGmTxkMG-4
    target: _blank
seo:
  title: Mobile Menu (Basic) | Laioutr
  description: Mobile off-canvas drawer for the basic header.
sitemap:
  loc: /laioutr-ui/navigation/mobile-menu-basic
  lastmod: 2026-05-13
  changefreq: monthly
  priority: 1.0
aliases:
  - /laioutr-ui/navigation/mobilemenu
---

## Overview

`MobileMenuBasic` is the touch-optimized off-canvas drawer that pairs with [`HeaderBasic`](/laioutr-ui/navigation/header-basic). It hosts the mobile navigation list, an optional social row, a locale selector, and a dark-mode toggle. The drawer renders inside a `Sheet`, so focus trap and Escape-to-close come from the underlying reka-ui Dialog. Press-state feedback on link items uses the CSS `:active` pseudo-class.

Pass items, social links, locale select, and the mode switcher as props on `MobileMenuBasic` itself, then mount it inside [`HeaderBasic`](/laioutr-ui/navigation/header-basic)'s `mobile` slot.

## Key Business & UX Benefits

- Touch-optimized drawer with main content visible behind it keeps mobile users grounded, so they can browse without losing context on the page they came from.
- Focus is trapped while the drawer is open, which removes a common accessibility failure and keeps keyboard and screen-reader users on a clean path.
- Locale switching, dark mode, and social links share one mobile surface, so secondary controls do not fight for space in the main header on small screens.
- Configured once in Studio and reused across pages, so marketing changes ship without engineering tickets.

:::tip
Pro-Tip from Larry: Share the same items array between `MobileMenuBasic` and the desktop menu component so both views stay in sync from a single config.
:::

## Usage

::component-code
---
:name: LMobileMenuBasic
story-id: ui-features-mobilemenubasic--default&globals=viewport:xs
---
::

## Feature List

::features
---
items:
  - "Off-canvas drawer renders inside a `Sheet`, inheriting focus trap and Escape-to-close from the underlying reka-ui Dialog"
  - "Touch-optimized list with `:active` press-state feedback for tappable feel on mobile"
  - "Hosts mobile navigation links, optional social row, locale selector, and a dark-mode toggle inside one surface"
  - "Pairs with `HeaderBasic` — mount it inside the header's `mobile` slot"
  - "Exposes items, social links, locale select, and the mode switcher as props for direct configuration"
  - "Main content stays visible behind the drawer so mobile users keep context on the page they came from"
---
::

## API Reference

::component-meta{:name="MobileMenuBasic"}
::
