---
title: Withdrawal Form
description: Statutory EU right-of-withdrawal (Widerruf) form with name, order or contract reference, and email fields, client-side validation, and a submit handler you supply.
playground:
  name: WithdrawalForm
  base: ui-blocks-withdrawalform
  defaultStory: default
  height: 460px
seo:
  title: Withdrawal Form | Laioutr
  description: EU right-of-withdrawal (Widerruf) form with client-side validation and a submit handler you supply.
sitemap:
  loc: /laioutr-ui/cms/withdrawal-form
  lastmod: 2026-07-21
  changefreq: monthly
  priority: 1.0
---

::since-version{version="2.6.0" packages="@laioutr-core/ui" changelog="ui"}
::

## Overview

`WithdrawalForm` renders the statutory EU right-of-withdrawal (Widerruf) form. It collects the three legally-permitted fields — the customer's name, an order or contract reference, and an email address — validates them client-side, and hands the result to a `submitHandler` you provide. On success it shows a success toast and emits `close`, so a surrounding dialog can dismiss itself; on failure it renders the returned message inline.

Every label, placeholder, and the submit button text is overridable via props, and otherwise falls back to the `withdrawal.*` locale namespace, which ships in English and German. An optional `moreInfoHref` adds a link out to your full withdrawal policy.

The component owns the form and nothing else. You supply the transport: `submitHandler` receives `{ name, orderReference, email }` and returns a `Promise<{ success, message? }>`. In Studio, the withdrawal button wires this to the `ecommerce/legal/withdrawal` action; in code you can point it at any endpoint.

## Key Business & UX Benefits

- Ships the legally-required Widerruf fields and copy (EN/DE) out of the box, so you meet the EU obligation without assembling the form yourself.
- Client-side validation catches empty or malformed input before it reaches your handler and surfaces field-level errors inline.
- The `submitHandler` contract keeps the form transport-agnostic — wire it to an Orchestr action, an email endpoint, or a ticketing system without touching the component.
- Relabelling the reference field (for example "Policy number" or "Contract ID") adapts the same form to subscriptions, insurance, or service contracts.
- Emits `close` on success, so it drops straight into a dialog opened from the footer or a legal page.

## Usage

Provide a `submitHandler` that performs the request and reports the outcome. Return `{ success: true }` to trigger the success toast and `close` event, or `{ success: false, message }` to show an inline error:

```vue
<script setup lang="ts">
import type {
  WithdrawalFormData,
  WithdrawalSubmitResult,
} from '#ui/components/WithdrawalForm/WithdrawalForm.vue';

async function submitWithdrawal(data: WithdrawalFormData): Promise<WithdrawalSubmitResult> {
  try {
    await $fetch('/api/legal/withdrawal', { method: 'POST', body: data });
    return { success: true };
  } catch {
    return { success: false, message: 'We could not submit your request. Please try again.' };
  }
}
</script>

<template>
  <LWithdrawalForm
    :submit-handler="submitWithdrawal"
    more-info-href="/legal/right-of-withdrawal"
    @close="$emit('close')"
  />
</template>
```

For non-order contexts, relabel the reference field with `orderReferenceLabel` and `orderReferencePlaceholder` — for example `order-reference-label="Policy number"` on an insurance storefront — while keeping the same validation and submit flow.

## Feature List

::features
---
items:
  - "The three legally-permitted Widerruf fields: name, order or contract reference, email"
  - "Client-side validation with inline, field-level error messages"
  - "`submitHandler` returns `{ success, message? }` — the form owns the UI, you own the transport"
  - "Success shows a toast and emits `close`; failure renders the returned message inline"
  - "All labels, placeholders, and button text overridable, falling back to the `withdrawal.*` locale (EN/DE)"
  - "Optional `moreInfoHref` link out to your full withdrawal policy"
---
::

## API Reference

### WithdrawalForm

::component-meta{:name="WithdrawalForm"}
::

## Related

- [Footer](/laioutr-ui/navigation/footer): exposes a `bottomContent` slot where the withdrawal button, and the form's dialog, are commonly placed.
