---
title: Footer
description: Responsive footer with desktop columns and mobile accordion tabs.
jiraIssueId: LUI-221
links:
  - label: Figma
    icon: i-simple-icons-figma
    to: https://www.figma.com/design/QgRgNtTxBTCAxpTe1rriHM/Studio-v1.0?node-id=985-108133&t=lxa1EnPQ6WmLk1ee-4
    target: _blank
---

## Overview

The Footer section provides a fully-featured site footer that adapts between desktop column layout and mobile accordion for optimal space usage. It includes areas for logo, contact information (email, phone, address), and multiple menu sections. The bottom row accommodates social icon buttons, an email signup input, and copyright text. Menu items support different popover content than standard buttons. Column count and alignment are independently configurable for desktop views.

## Usage

:component-code{name="SectionFooter" story-id="ui-blocks-footer--four-columns"}

## Features

::features
---
items:
  - "Responsive layout with desktop columns and mobile accordion"
  - "Integrated contact information display (email, phone, address)"
  - "Bottom row with icon buttons, email input, and copyright"
  - "Configurable menu sections with title links"
---
::

## API Reference

### SectionFooter

::component-meta{:name="SectionFooter"}
::

### BlockFooterMenu

::component-meta{:name="BlockFooterMenu"}
::

### FooterMenuDesktopItem

::component-meta{:name="FooterMenuDesktopItem"}
### FooterTitle

  :::component-meta{:name="FooterTitle"}
  :::
::
