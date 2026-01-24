---
title: Image Contrast Overlay
description: A utility component that enhances text readability over images through customizable gradient or solid color overlays with adjustable opacity.
jiraIssueId: LUI-22
---

## Overview

Centralizes overlay logic for all CTA banner variants, maintaining accessibility standards while preserving visual appeal. Darkens bright or busy background images to improve headline readability. Creates subtle gradient effects that draw attention to text without fully obscuring imagery. Ensures consistent text visibility across dynamically uploaded marketing images. Marketing teams can confidently use diverse imagery knowing the overlay system will maintain readability.

## Usage

::component-code
---
:name: ImageContrastOverlay
story-id: ui-kit-imagecontrastoverlay--gradient-overlay
---
::

## Features

::features
---
items:
  - "Multiple overlay styles: off (disabled), gradient, or solid color"
  - "Adjustable opacity for precise contrast tuning"
  - "Gradient option with smooth bottom-to-top fade effect"
  - "Reusable across all CTA banner components"
---
::

## API Reference

::component-meta{:name="ImageContrastOverlay"}
::
