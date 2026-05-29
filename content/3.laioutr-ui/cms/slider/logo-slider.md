---
title: Logo Slider
description: Animated slider of brand, partner, or supplier logos.
playground:
  name: LogoSlider
  base: ui-sections-logoslider
  defaultStory: default
  height: 460px
jiraIssueId: LUI-215
seo:
  title: Logo Slider | Laioutr
  description: Animated slider of brand, partner, or supplier logos.
sitemap:
  loc: /laioutr-ui/cms/slider/logo-slider
  lastmod: 2026-05-15
  changefreq: monthly
  priority: 1.0
aliases:
  - /laioutr-ui/cms/slider/logoslider
---

## Overview

`LogoSlider` is the animated logo slider for "trusted by", "as seen in", certification, and supplier rows. Each logo carries its own title, optional link, and image. The slider-level `logoBackground` prop sets a shared backdrop color that applies to every logo slide, so the strip stays visually unified. The slider includes navigation controls and an optional scrollbar.

Pair with [`LogoGrid`](/laioutr-ui/cms/slider/logo-grid), the static-grid variant. Both share the same `slides` shape, so layouts are interchangeable: reach for `LogoSlider` when you have many logos, and `LogoGrid` for short, fixed lists.

## Key Business & UX Benefits

- Long partner and certification lists stay viewable without dominating the page, keeping trust signals present at any scroll depth.
- A shared `logoBackground` keeps every logo on the same backdrop tone, so the strip reads as one unified trust band.
- Optional links turn the trust strip into a navigation channel for partner directories and certification details.
- Studio edits keep the rotation current as partnerships, certifications, or press coverage evolve.

:::tip
Pro-Tip from Larry: Use `LogoSlider` when you have many logos that wouldn't fit a static grid; switch to `LogoGrid` for short, fixed lists.
:::

## Usage

:component-code{name="LLogoSlider" story-id="ui-sections-logoslider--default"}

## Feature List

::features
---
items:
  - "Each logo carries its own title, optional link, and image"
  - "Slider-level logoBackground prop applies one shared backdrop color across every logo slide"
  - "Navigation controls and an optional scrollbar handle long lists that wouldn't fit a static grid"
  - "Optional per-logo links turn the trust strip into a navigation channel for partner directories"
  - "Shares the slides shape with LogoGrid so layouts are interchangeable as the list grows"
  - "Editors keep partnerships, certifications, and press coverage current in Studio"
---
::

## API Reference

### LLogoSlider

::component-meta{:name="LogoSlider"}
::

### LLogoSliderSlide

::component-meta{:name="LogoSliderSlide"}
::
