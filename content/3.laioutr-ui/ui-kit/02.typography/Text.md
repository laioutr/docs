---
title: Text
description: Typography primitives for body, heading, subline, and caption with a consistent scale of sizes.
playground:
  name: Text
  base: ui-kit-atoms-text
  defaultStory: body
  height: 460px
jiraIssueId: LUI-137
seo:
  title: Text | Laioutr
  description: Typography primitives for body, heading, subline, and caption with a consistent scale of sizes.
sitemap:
  loc: /laioutr-ui/ui-kit/typography/text
  lastmod: 2026-05-15
  changefreq: monthly
  priority: 1.0

---

## Overview

Text is the typography primitive for body, heading, subline, and caption styles across the UI. Pick a `type` for the semantic role and a `size` for the visual weight (the scale runs `xs` through `4xl`), and the component emits the matching tag with the theme's font family, weight, and spacing applied.

Colors come from fixed font-color tokens per type: body text reads `--font-color-body-text`, headings read `--font-color-heading`, sublines read `--font-color-subline`, and captions read `--font-color-caption`. Wrap text-heavy regions in `<LOnSurface :tone="...">` to override those tokens for the section, so the same prose stays legible on light, dark, or bright backdrops.

## Key Business & UX Benefits

- A shared scale across body, heading, subline, and caption keeps the storefront looking like one product, not a stack of components from different vendors.
- Token-driven colors per text type (`--font-color-body-text`, `--font-color-heading`, etc.) let `OnSurface` repaint a whole section with one wrapper instead of per-element overrides.
- Brand teams can change typography in tokens once and have every page update, instead of hunting font-size overrides across components.

:::tip
Pro-Tip from Larry: Wrap text-heavy regions in `<LOnSurface :tone="...">` to switch the `--font-color-*` tokens for the section so prose stays legible on every backdrop.
:::

## Usage

::component-code
---
:name: Heading
:story-height: 600px
story-id: ui-kit-atoms-text--heading
---
```vue-template
<LText type="heading" size="xs">heading-xs</LText>
<LText type="heading" size="s">heading-s</LText>
<LText type="heading" size="sm">heading-sm</LText>
<LText type="heading" size="m">heading-m</LText>
<LText type="heading" size="ml">heading-ml</LText>
<LText type="heading" size="l">heading-l</LText>
<LText type="heading" size="xl">heading-xl</LText>
<LText type="heading" size="2xl">heading-2xl</LText>
<LText type="heading" size="3xl">heading-3xl</LText>
<LText type="heading" size="4xl">heading-4xl</LText>
```
::

::component-code
---
:name: Subline
:story-height: 600px
story-id: ui-kit-atoms-text--subline
---
```vue-template
<LText type="subline" size="xs">subline-xs</LText>
<LText type="subline" size="s">subline-s</LText>
<LText type="subline" size="sm">subline-sm</LText>
<LText type="subline" size="m">subline-m</LText>
<LText type="subline" size="ml">subline-ml</LText>
<LText type="subline" size="l">subline-l</LText>
<LText type="subline" size="xl">subline-xl</LText>
<LText type="subline" size="2xl">subline-2xl</LText>
<LText type="subline" size="3xl">subline-3xl</LText>
<LText type="subline" size="4xl">subline-4xl</LText>
```
::

::component-code
---
:name: Caption
:story-height: 600px
story-id: ui-kit-atoms-text--caption
---
```vue-template
<LText type="caption" size="xs">caption-xs</LText>
<LText type="caption" size="s">caption-s</LText>
<LText type="caption" size="sm">caption-sm</LText>
<LText type="caption" size="m">caption-m</LText>
<LText type="caption" size="ml">caption-ml</LText>
<LText type="caption" size="l">caption-l</LText>
<LText type="caption" size="xl">caption-xl</LText>
<LText type="caption" size="2xl">caption-2xl</LText>
<LText type="caption" size="3xl">caption-3xl</LText>
<LText type="caption" size="4xl">caption-4xl</LText>
```
::

## Feature List

::features
---
items:
  - "Four `type` values ('body', 'heading', 'subline', 'caption') cover the semantic typography roles across the UI"
  - "Ten `size` steps ('xs' through '4xl') give one continuous scale per type, so editorial and product hierarchy stay coherent"
  - "Token-driven colors per type (`--font-color-body-text`, `--font-color-heading`, `--font-color-subline`, `--font-color-caption`) let `OnSurface` repaint sections wholesale"
  - "`as` prop accepts any tag or component, so consumers can render `<h1>` or a routed link without rewriting markup"
  - "Theme-token-driven font family, weight, and line-height let brand teams update typography in one place"
---
::

## API Reference

::component-meta{:name="Text"}
::
