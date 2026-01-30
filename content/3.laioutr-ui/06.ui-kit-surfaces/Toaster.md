---
title: Toaster
description: A toaster component
links: []
---

## Overview

The Toaster component is the container that renders Toast notifications. It is typically mounted once at the app root and receives toasts from a global store, so any part of the app can trigger notifications without passing props.

## Key Business & UX Benefits

- One place to render toasts so layout and positioning stay consistent.
- Global store lets any component trigger toasts without prop drilling.
- Keeps notifications above other content with predictable z-index.
- Works with Toast component for variants, stacking, and auto-dismiss.

:::tip
Pro-Tip from Larry: Mount Toaster once at the root so toasts appear in the same spot everywhere.
:::

## Usage

::component-code
---
:name: Toaster
story-height: 400px
story-id: ui-kit-toaster--toaster-with-store
---
::

## Feature List

::features
---
items:
  - "Root-level container for rendering Toast notifications"
  - "Integrates with global store for programmatic toast triggering"
  - "Configurable positioning (e.g. top-right, bottom-center)"
  - "Stacking and queue management for multiple toasts"
---
::

## API Reference

::component-meta{:name="Toaster"}
::
