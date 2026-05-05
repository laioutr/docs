---
title: Identity cookies (cart and visitor IDs)
description: Read-or-create-and-set patterns for cart, session, and visitor identity cookies. Where to put the bootstrap depends on when you need the ID.
seo:
  title: Identity cookies in Orchestr | Laioutr
  description: Read-or-create-and-set patterns for cart, session, and visitor identity cookies in Orchestr.
sitemap:
  loc: /frontend/orchestr/recipes/identity-cookies
  lastmod: 2026-05-05
  changefreq: monthly
  priority: 0.9

---

A customer hits "Add to cart" for the first time. Your action handler needs a cart ID to call the backend's `addLineItem` mutation, but the cookie is empty because this customer has never had a cart. Or your tracking integration needs a stable visitor ID across requests so it can attribute pageviews to one session, and that ID has to live somewhere durable but anonymous.

Both problems share the same shape: read a cookie; if missing, create the underlying record; set the cookie; return the ID. The decision worth thinking about is where to run this logic: in `extendRequest` (every request gets the ID) or inside the action handler (only mutations create one).

```ts
// Pattern (placement varies)
let id = getCookie(event, ID_COOKIE);
if (!id) {
  id = await createIdentityRecord();
  setCookie(event, ID_COOKIE, id, secureCookieOptions);
}
return { id };
```

## Wrap setCookie once, not per call site

Every identity cookie you set should be `httpOnly`, `secure`, `sameSite: 'strict'`, and have an explicit `path`. Missing one leaks an attack vector. Wrap `setCookie` once with the defaults locked in:

```ts [server/myapp-helper/cookie-helper.ts]
import { CookieOptions } from 'nuxt/app';
import { setCookie } from '#imports';
import type { H3Event } from 'h3';

const defaults = {
  httpOnly: true,
  secure: true,
  sameSite: 'strict',
  path: '/',
} as const;

export const cookieHelper = {
  setCookie: (event: H3Event, name: string, value: string, options: CookieOptions = {}) => {
    setCookie(event, name, value, { ...defaults, ...options } as CookieOptions);
  },
};
```

Each app keeps its own copy with whatever defaults match its security posture. The Nimstrata app, for example, drops `secure` to `process.env.NODE_ENV === 'production'` because its dev server runs over HTTP; everything else stays the same.

## When to bootstrap in extendRequest

Use `extendRequest` when the ID is needed by every read, not just mutations. Tracking visitor IDs are the canonical case: they're attached to analytics events sent from queries and links, so they must exist before any handler runs.

```ts [server/middleware/defineNimstrata.ts]
import { defineOrchestr } from '#imports';
import { ensureVisitorId } from '../utils/nimstrata';

export const defineNimstrata = defineOrchestr
  .meta({ app: '@laioutr-app/nimstrata', label: 'Nimstrata' })
  .extendRequest(({ event }) => {
    const visitorId = ensureVisitorId(event);
    return { context: { visitorId } };
  });
```

```ts [server/utils/nimstrata.ts]
import { getCookie, setCookie } from '#imports';
import type { H3Event } from 'h3';
import { VISITOR_ID_COOKIE } from '../const/cookies';
import UUIDV4 from './uuid';

export const ensureVisitorId = (event: H3Event): string => {
  let visitorId = getCookie(event, VISITOR_ID_COOKIE);

  if (!UUIDV4.validate(visitorId)) {
    visitorId = UUIDV4.random();
    setCookie(event, VISITOR_ID_COOKIE, visitorId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 365,
    });
  }

  return visitorId;
};
```

This works because `extendRequest` is one of the two slots where you can still mutate response headers (see the [response-streaming constraint](/frontend/orchestr/middleware#setting-cookies-and-response-headers)). Every handler that runs afterwards reads `context.visitorId`.

## When to bootstrap in the action handler

Use the action-handler placement when the ID is only meaningful for mutations. Cart IDs are the canonical case: read-only handlers (browsing products, viewing categories) shouldn't create a cart for a customer who just landed on the homepage. That cart will never be touched again and pollutes your backend's cart table forever.

```ts [server/utils/orchestr/cart/index.ts]
import type { H3Event } from 'h3';
import { getCookie } from '#imports';
import { cookieHelper } from '../../../myapp-helper/cookie-helper';
import { CART_ID_COOKIE } from '../../../const/keys';
import type { MyApiClient } from '../../../client/sdk';

export const assertCartIdExists = async (event: H3Event, client: MyApiClient) => {
  let cartId = getCookie(event, CART_ID_COOKIE);
  if (cartId) return { cartId };

  const { cart_id } = await client.createEmptyCart();
  cookieHelper.setCookie(event, CART_ID_COOKIE, cart_id, {
    maxAge: 60 * 60 * 24 * 30,
  });
  return { cartId: cart_id };
};
```

Each cart-mutating action calls `assertCartIdExists` at the top:

```ts [server/orchestr/cart/add-items.action.ts]
export default defineMyAppAction(CartAddItemsAction, async ({ input, context, event }) => {
  const { cartId } = await assertCartIdExists(event, context.myApiClient);
  // ... call client.addToCart(cartId, input.items)
});
```

This works because the action handler runs to completion before Orchestr starts writing the response: `runAction` returns its result first, then `setHeader` and `sendStream` execute. The `setCookie` call inside the handler mutates the response while headers are still mutable. A query handler runs inside the streaming iterator that `sendStream` is already consuming, so by the time the handler executes the headers have been flushed.

## Rule of thumb

If the storefront expects to read state derived from this ID on the very first page load (visitor segmentation, locale preferences from a logged-in session), bootstrap in `extendRequest`. If the ID is only consulted when something is being created or changed, bootstrap inside the action handler. The customer who never converts then never gets an empty cart created in your backend.

## Related

- [Middleware: Setting cookies and response headers](/frontend/orchestr/middleware#setting-cookies-and-response-headers): the streaming constraint that determines which middleware slots can write cookies.
- [System bootstrap in extendRequest](./system-bootstrap) (recipe): another `extendRequest` pattern that combines naturally with identity bootstrap when an app needs both.
