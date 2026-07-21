---
title: Input Password
description: Password text field with an optional show / hide toggle so users can verify their entry.
playground:
  name: InputPassword
  base: ui-kit-molecules-inputpassword
  defaultStory: default
  height: 460px
links: []
seo:
  title: Input Password
  description: Password text field with an optional show / hide toggle.
sitemap:
  loc: /laioutr-ui/ui-kit/form/input-password
  lastmod: 2026-05-13
  changefreq: monthly
  priority: 1.0
aliases:
  - /laioutr-ui/ui-kit/form/inputpassword
---

## Overview

`InputPassword` is the password text field. It masks the value by default and renders an eye-icon toggle that flips the input between `password` and `text` so users can verify what they typed without leaving the field. Integrates with `<LField>` for labels and errors like the rest of the input family.

Set `intent` to feed the underlying `autocomplete` attribute so password managers can target the right field:

| `intent`           | Use for                                                |
| ------------------ | ------------------------------------------------------ |
| `'current-password'` | Login forms (manager fills in the saved password).    |
| `'new-password'`     | Sign-up and change-password forms (manager generates). |
| `'one-time-code'`    | OTP / second-factor inputs.                            |

## Key Business & UX Benefits

- The show/hide toggle lets users verify their password before submitting, which cuts the "wrong password" retry loop that often ends in an abandoned signup.
- `intent` maps to the right `autocomplete` value, so iOS/Android password managers and 1Password/Bitwarden suggest credentials accurately instead of asking the user to paste.
- `<LField>` integration surfaces validation errors inline alongside the input, helping users meet password policies without bouncing back from a failed submit.

:::tip
Pro-Tip from Larry: Set `intent="new-password"` on sign-up forms so password managers suggest a strong unique password, and `intent="current-password"` on login forms so they autofill the saved one.
:::

## Feature List

::features
---
items:
  - "Built-in eye-icon toggle flips the input between `type=\"password\"` and `type=\"text\"`, so users verify what they typed without leaving the field"
  - "Three `intent` values ('current-password', 'new-password', 'one-time-code') drive the underlying `autocomplete` attribute for password-manager targeting"
  - "Inherits `<LField>` context for label, description, and inline error rendering"
  - "Masked by default, so the field is safe to drop into login flows without further configuration"
  - "v-model passes the cleartext value through, so consumers can wire validation and password-policy hints on top"
---
::

## API Reference

::component-meta{:name="InputPassword"}
::
