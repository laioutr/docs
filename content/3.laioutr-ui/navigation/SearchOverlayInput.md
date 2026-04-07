---
title: Search Overlay Input
description: Responsive search overlay with real-time autocomplete suggestions and smooth animations.
jiraIssueId: LUI-109
links:
  - label: Figma
    icon: i-simple-icons-figma
    to: https://www.figma.com/proto/Zle03g3Z7ieN700SDq5j77/Component-Examples?node-id=641-133307&p=f&viewport=410%2C309%2.25&t=AlJlxEZtYt22EMFY-0&scaling=min-zoom&content-scaling=fixed&starting-point-node-id=641%3A138550&show-proto-sidebar=1
    target: _blank
seo:
  title: Search Overlay Input | Laioutr
  description: Responsive search overlay with real-time autocomplete suggestions and smooth animations.
---

## Overview

The Search Overlay Input enables rapid product discovery through a responsive autocomplete interface available from the site header. Built on Reka UI's Combobox primitive, it adapts its suggestion display between inline positioning on mobile and popper positioning on desktop viewports. Matching text within suggestions is highlighted in bold to help users quickly identify relevant results. The component accepts externally-loaded suggestion data, enabling integration with various search backends including Google Retail API, while maintaining instant responsiveness through client-side filtering.

## Key Business & UX Benefits

- Overlay search with autocomplete speeds up product discovery from the header.
- Match highlighting and real-time suggestions help users find the right result.
- Full-width on mobile and popper on desktop fit each viewport.
- Keyboard and WCAG support keep search accessible.

:::tip
Pro-Tip from Larry: Use Search Overlay from the header so users can search without leaving the page.
:::

## Usage

::component-code
---
name: LuiSearchOverlayInput
story-id: molecules-searchoverlayinput--default
---
::

## Feature List

::features
---
items:
  - "Real-time autocomplete suggestions with match highlighting"
  - "Smooth open/close animations for mobile and desktop"
  - "Full-width expansion on mobile devices"
  - "WCAG 2.1 compliant with keyboard navigation"
---
::

## API Reference

::component-meta{:name="SearchOverlayInput"}
::
