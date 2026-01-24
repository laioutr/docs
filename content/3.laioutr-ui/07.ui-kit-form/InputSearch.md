---
title: Search Input
description: A search input component for site navigation enabling real-time product discovery with auto-suggestions across all devices.
jiraIssueId: LUI-59
links:
  - label: Figma
    icon: i-simple-icons-figma
    to: https://www.figma.com/design/92moLelAY8lh8mI0rhCGzy/laioutr-UI?node-id=13084-116873&t=6xBvZNXlqO6bv1Wx-4
    target: _blank
---

## Overview

Provides international online shoppers with a fast, accessible search interface prominently placed in the site's main navigation. Users type queries and receive real-time suggestions for products, categories, and brands localized to their selected language and region. On mobile, the search adapts with collapsible or full-screen behavior for optimal touch interaction. Wraps InputGroup and Input with pre-configured search icon and clear button logic for seamless integration into header designs.

## Usage

::component-code
---
:name: LuiSearchInput
story-height: 90px
story-id: ui-kit-searchinput--searchinput
---
::

## Features

::features
---
items:
  - "Real-time autocomplete suggestions with localization support"
  - "Accessible via keyboard navigation and screen readers"
  - "Subtle and outline style variants for flexible theming"
  - "Clear button with contextual visibility and disabled state"
---
::

## API Reference

::component-meta{:name="SearchInput"}
::
