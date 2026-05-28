---
title: Input Pin
description: Row of single-character cells for OTP, PIN, or confirmation-code entry.
playground:
  name: InputPin
  base: ui-kit-molecules-inputpin
  defaultStory: default
  height: 460px
seo:
  title: Input Pin | Laioutr
  description: Row of single-character cells for OTP / PIN entry.
sitemap:
  loc: /laioutr-ui/ui-kit/form/input-pin
  lastmod: 2026-05-13
  changefreq: monthly
  priority: 1.0
---

## Overview

`InputPin` is the row of single-character cells used for OTP, PIN, and confirmation-code entry. Cell styling mirrors `Input` so PIN screens feel native to the rest of the form system, and the component reads `<LField>` context for label and validation state.

## Key Business & UX Benefits

- Per-cell entry with auto-advance feels native on mobile keyboards and SMS autofill, so two-factor codes get entered in seconds rather than typed character by character into one field.
- Sharing Input styling means OTP screens match the rest of the form system, which keeps verification steps from looking like a separate app.
- Field-driven errors surface "wrong code" inline, so customers can retry without losing context about which step of the flow they're on.

## Feature List

::features
---
items:
  - "Configurable `length` (default 6) renders that many cells, so 4-cell PINs and 6-cell OTPs share one component"
  - "Two `type` values ('text', 'number', default 'text') control the underlying input keyboard hint on mobile"
  - "`otp` flag (default true) enables SMS-autofill on iOS and Android so 2FA codes drop into all cells at once"
  - "Optional `mask` flag obscures entered characters for true PIN entry, while OTP screens show digits in cleartext by default"
  - "Per-cell `placeholder` (default `○`) renders the empty state visibly, so users see how many digits are still expected"
  - "Inherits `<LField>` state, so 'wrong code' errors surface inline with the rest of the form"
---
::

## API Reference

::component-meta{:name="InputPin"}
::
