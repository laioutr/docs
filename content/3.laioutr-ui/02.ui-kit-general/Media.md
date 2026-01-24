---
title: Media
description: A responsive image block component with optional lightbox functionality, customizable aspect ratios, and device-specific sizing controls.
jiraIssueId: LUI-28
---

## Overview

Enables content editors to insert and manage responsive images within page layouts. Creates visually engaging content that adapts seamlessly across all device sizes. Display product images, hero banners, or editorial photography with consistent styling. Configure different sizing for mobile versus desktop to optimize visual presentation. Add captions and accessibility descriptions for improved user experience. Leverages Radix Vue Dialog for accessible lightbox implementation.

## Usage

Uses [nuxt-image](https://image.nuxt.com/) to render responsive images.

::component-code{:name="Media" story-id="ui-kit-media--default"}
::

## Features

::features
---
items:
  - "Lightbox with zoom and pan using Radix Vue Dialog and Swiper"
  - "Cross-image navigation in lightbox across all enabled media on the page"
  - "Custom aspect ratios with separate mobile and desktop values"
  - "Fixed height option with responsive values that overrides aspect ratio"
---
::

## API Reference

::component-meta{:name="Media"}
::
