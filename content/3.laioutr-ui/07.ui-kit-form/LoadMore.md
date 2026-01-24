---
title: Load More
description: Pagination component combining infinite scroll with Load More button.
jiraIssueId: LUI-70
---

## Overview

The LoadMore component implements a hybrid pagination strategy for product listing pages. Automatic lazy loading continues until reaching 80 products, then pauses for explicit user action via the Load More button. This prevents runaway data loading on large catalogs while maintaining smooth browsing. The progress indicator helps users understand their position within the product set, and the component gracefully hides itself when all products are displayed.

## Usage

::component-code
---
:name: LoadMore
story-id: ui-kit-loadmore--default
---
::

## Features

::features
---
items:
  - "Hybrid lazy loading with configurable batch sizes"
  - "Visual progress bar showing loaded vs total count"
  - "Smooth back-to-top scrolling functionality"
  - "Auto-hide when all products are loaded"
---
::

## API Reference

::component-meta{:name="LoadMore"}
::
