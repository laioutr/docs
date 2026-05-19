---
title: Alert Dialog
description: Modal dialog for confirming critical actions with focus trap and keyboard navigation.
jiraIssueId: LUI-107
links:
  - label: Figma
    icon: i-simple-icons-figma
    to: https://www.figma.com/design/Zle03g3Z7ieN700SDq5j77/Component-Examples?node-id=557-224630&t=7pkty4hsIeaPuKYa-4
    target: _blank
seo:
  title: Alert Dialog | Laioutr
  description: Modal dialog for confirming critical actions with focus trap and keyboard navigation.
sitemap:
  loc: /laioutr-ui/ui-kit/surfaces/alertdialog
  lastmod: 2026-05-15
  changefreq: monthly
  priority: 1.0

---

## Overview

Alert Dialog interrupts the flow when a user is about to do something destructive or irreversible and you need an explicit confirmation. It is built on Reka UI's dialog primitive with `role="alertdialog"`, labelled and described via the matching ARIA attributes, and includes a focus trap that holds focus inside the dialog while it is open.

Buttons are declarative: pass a `buttons` array (each with `text`, `variant`, optional `iconLeft` / `iconRight`, and an `onClick` handler) plus an optional `cancelButton`. The cancel slot uses a translated default label (`$tl('alertDialog.cancel')`) if you don't supply one. Configure dismiss behavior with `closeOnEsc` and `closeOnOverlayClick` (both default `true`); flip them off when the dialog must be answered.

Open dialogs imperatively through `useDialogStore().openDialog(...)`, which returns an id you can pass to `closeDialog(id)`. Mount `<DialogsContainer>` once near the app root and every store entry renders as its own `<AlertDialog>` instance, so multiple concurrent dialogs are addressable by id rather than nested at the call site.

## Key Business & UX Benefits

- Focus trap and `role="alertdialog"` semantics ship without extra work, so compliance audits and screen-reader testing pass on day one.
- Declarative buttons array keeps every confirmation visually consistent app-wide, which earns trust on irreversible operations like order cancellation and account deletion.
- Imperative store API (`openDialog` / `closeDialog`) lets server-driven flows raise a confirmation from anywhere without prop-drilling state down a component tree.
- Configurable mobile and desktop button alignment fits the dialog into checkout flows and admin tools without per-page overrides.

:::tip
Pro-Tip from Larry: Disable `closeOnEsc` and `closeOnOverlayClick` on irreversible actions (delete account, cancel order) so users have to make an explicit choice rather than dismissing the dialog by accident.
:::

## Usage

:component-code{name="LAlertDialog" story-id="ui-kit-organisms-alertdialog--manual-dialog"}

## Feature List

::features
---
items:
  - "Built on reka-ui with `role=\"alertdialog\"` and matching `aria-labelledby` and `aria-describedby`, so confirmations announce correctly to screen readers"
  - "Focus trap holds keyboard focus inside the dialog while open, with no per-page wiring"
  - "Declarative `buttons` array (`text`, `variant`, optional `iconLeft`, `iconRight`, `onClick`) plus optional `cancelButton` keeps confirmation chrome consistent"
  - "Default cancel label resolves via `$tl('alertDialog.cancel')`, so unprovided cancels still get localized copy"
  - "`closeOnEsc` and `closeOnOverlayClick` (both default true) toggle dismiss behavior, so irreversible actions can require an explicit choice"
  - "Imperative store API: `useDialogStore().openDialog(...)` returns an id passed to `closeDialog(id)`, paired with a single `<DialogsContainer>` mount"
---
::

## API Reference

### LAlertDialog

::component-meta{:name="AlertDialog"}
::
