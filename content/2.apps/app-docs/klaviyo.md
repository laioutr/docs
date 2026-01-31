---
title: Klaviyo
description: Developer documentation for the Laioutr Klaviyo app package. Integrate Klaviyo newsletter signup into your Nuxt app via the Klaviyo Client API.
---

## Overview

The **@laioutr/app-klaviyo** package integrates a Laioutr-powered Nuxt app with [Klaviyo](https://www.klaviyo.com/). It uses the **Klaviyo Client API** to subscribe profiles to a list (newsletter signup). The package registers with the Laioutr orchestr and exposes a single action: **SubscribeAction**. No cart, product, or menu capabilities are included; the focus is email/list subscription.

Configuration is minimal: Klaviyo company ID, API base URL, and a default list ID for subscriptions. The module installs **@laioutr-core/frontend-core**, **@laioutr-core/orchestr**, **@nuxt/image**, and **@laioutr-app/ui** on prepare. Placeholder directories for app blocks and sections exist for future use.

## Configuration requirements

The module expects configuration under the key **`@laioutr/app-klaviyo`** in `nuxt.config.ts` (or via `runtimeConfig`). Two options are required; one is optional.

### Module options

| Option | Type | Description |
|--------|------|-------------|
| **`baseURL`** | `string` | Klaviyo API base URL. Default: `https://a.klaviyo.com`. |
| **`companyId`** | `string` | Klaviyo company (account) ID. Sent as `company_id` on every API request. |
| **`defaultNewsletterListId`** | `string` | Default list ID for newsletter subscriptions when the action input does not specify a list. |

### Example configuration

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@laioutr/app-klaviyo', '@laioutr-core/orchestr'],
  '@laioutr/app-klaviyo': {
    baseURL: process.env.KLAVIYO_BASE_URL ?? 'https://a.klaviyo.com',
    companyId: process.env.KLAVIYO_COMPANY_ID!,
    defaultNewsletterListId: process.env.KLAVIYO_DEFAULT_NEWSLETTER_LIST_ID!,
  },
});
```

Use environment variables for `companyId` and `defaultNewsletterListId` in production; do not commit them if they are sensitive.

### Runtime behavior

- **Klaviyo SDK**  
  The package builds a **KlaviyoSDK** instance per request with `baseURL` and `companyId`. All requests are sent as POST with `Content-Type: application/json` and the Klaviyo API **revision** header (`2025-07-15`). The SDK is passed into the orchestr context as `klaviyoClient`; `defaultNewsletterListId` is also in context for the subscribe action.

- **Errors**  
  The SDK parses the response body; if Klaviyo returns `errors`, it throws an **AggregateError** with one Error per API error (title and detail). Non-OK responses without a JSON error body throw a generic Error with status and body.

## Capabilities

The package implements the canonical **SubscribeAction** from `@laioutr-core/canonical-types/newsletter`. No queries, links, or component resolvers are provided.

### Actions

- **Newsletter**  
  - **SubscribeAction** – Subscribes a profile to a Klaviyo list. Uses **Create Client Subscription** ([Klaviyo API](https://developers.klaviyo.com/en/reference/create_client_subscription)).  
  - **Input:** `listId` (optional; falls back to `defaultNewsletterListId`), `email`, `source` (optional custom source), `phone`, `person` (firstName, lastName, title), `address` (address1, address2, city, countryCode, provinceCode, postalCode, latitude, longitude), `customFields` (mapped to profile properties).  
  - **Output:** `{ status: 'success' }`.  
  - **Mapping:** Address fields are mapped to Klaviyo’s location shape (address1, address2, city, country, region, zip, latitude, longitude). Profile attributes are email, phone, firstName, lastName, title, location, and custom properties.

## Backend requirements

- **Klaviyo account** – Create an account and obtain your **company ID** (used as `company_id` in API calls).
- **List** – Create at least one list in Klaviyo for newsletter signups and use its ID as `defaultNewsletterListId` (or pass `listId` in the action input).
- **API access** – The Client API endpoint used is `/client/subscriptions` (create client subscription). Ensure your Klaviyo plan and settings allow this endpoint and the revision `2025-07-15`.

## Cookies and context

This package does not set or read any cookies. Subscription is stateless per request.

## Summary checklist

- Add `@laioutr/app-klaviyo` and `@laioutr-core/orchestr` to Nuxt modules.
- Set `baseURL` (optional), `companyId`, and `defaultNewsletterListId` under `@laioutr/app-klaviyo` (e.g. from env).
- Create a Klaviyo list and use its ID as the default newsletter list.
- Invoke **SubscribeAction** from your UI (e.g. newsletter form) with at least `email`; optionally pass `listId`, `source`, `phone`, `person`, `address`, and `customFields`.
