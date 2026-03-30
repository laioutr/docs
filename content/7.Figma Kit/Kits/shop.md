---
title: Shop
description: Commerce-focused components for product discovery, listing, merchandising, and conversion flows.
---

## Purpose

The **Shop** kit contains components specifically used for commerce experiences. It is built on top of the UI Kit tokens and focuses on product presentation and shopping interactions.

## What’s inside (typical)

- Product tiles/cards (variants, badges, pricing, availability)
- Product grids and responsive listing layouts
- Filters, sort, facets, applied-filter chips
- Category/listing headers and merchandising patterns
- Quick actions (wishlist/add-to-cart patterns depending on the library setup)

## Variables & theming

- Reuses **UI Kit variables** for typography, spacing, radii, colors, and states.
- Shop-specific styling should still be driven by tokens to stay consistent across sections and Studio.

## Advanced component features

- Property-driven states (default/hover/disabled/loading)
- Nested instance swapping for icons and sub-elements
- Auto Layout setups that scale from mobile to desktop

## Best practices

- Keep component names stable to preserve the 1:1 Studio pipeline.
- Prefer adding new variants via properties over duplicating near-identical components.

