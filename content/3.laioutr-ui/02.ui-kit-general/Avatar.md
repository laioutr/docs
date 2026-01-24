---
title: Avatar
description: Avatar component for displaying user images, initials, or icons with size and color variants.
jiraIssueId: LUI-122
links:
  - label: Figma
    icon: i-simple-icons-figma
    to: https://www.figma.com/design/92moLelAY8lh8mI0rhCGzy/laioutr-UI?node-id=20345-6874&t=d3lxzSvfCLvDJnbv-4
    target: _blank
---

## Overview

The Avatar component provides flexible user representation across the UI through profile images, auto-generated initials, or icon fallbacks. It intelligently extracts initials from names by taking the first letter of the first and last words (e.g., "Sebastian Kurt Langer" becomes "SL"). Four size variants (small, medium, large, extra large) use theme-controlled border radius values, while pale and solid color variants apply distinct background, icon, and text colors. Each theme provides custom placeholder images ensuring visual consistency when no user image is available.

## Usage

:component-code{name="Avatar" story-height="100px" story-id="ui-kit-avatar--medium-fallback-icon"}

## Features

::features
---
items:
  - "Multiple sizes with theme-specific border radius"
  - "Pale and solid color variants with theme colors"
  - "Auto-generated initials from user name"
  - "Theme-specific placeholder images"
---
::

## API Reference

### Avatar

::component-meta{:name="Avatar"}
::
