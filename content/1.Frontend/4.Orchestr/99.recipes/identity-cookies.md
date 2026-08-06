---
title: Identity cookies (cart and visitor IDs)
description: Read-or-create-and-set patterns for cart, session, and visitor identity cookies. Where to put the bootstrap depends on when you need the ID.
seo:
  title: Identity cookies in Orchestr
  description: Read-or-create-and-set patterns for cart, session, and visitor identity cookies in Orchestr.
sitemap:
  loc: /frontend/orchestr/recipes/identity-cookies
  lastmod: 2026-08-06
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
  setManagedCookie(event, ID_COOKIE, id, { httpOnly: true, sameSite: 'strict', path: '/' });
}
return { id };
```

## Write cookies with setManagedCookie

::since-version{version="0.40.2" packages="@laioutr-core/frontend-core" changelog="frontend"}
::

frontend-core auto-imports three helpers into every app's server code:

| Auto-import | What it does |
| --- | --- |
| `setManagedCookie(event, name, value, options?)` | `setCookie` with the platform's transport policy applied |
| `deleteManagedCookie(event, name, options?)` | `deleteCookie` addressing the same cookie the set produced |
| `isStudioEmbedRequest(event)` | Whether this request came from the Studio preview frame |

Use them instead of h3's `setCookie` and `deleteCookie` for anything a browser has to send back — cart IDs, session tokens, visitor IDs. A cookie written with the raw h3 functions is accepted inside the Studio preview but never returned, so an editor building a cart in Studio watches it reset on every request.

The options are h3's minus `secure` and `partitioned`, which the platform owns:

```ts
type ManagedCookieOptions = Omit<CookieSerializeOptions, 'secure' | 'partitioned'>;
```

`secure` is derived from the request origin rather than passed, because getting it wrong fails in both directions: hardcoding `secure: true` loses the cookie on a plain-HTTP dev hostname, and a `SameSite=None` cookie without `Secure` is rejected outright by Chrome. An origin counts as secure if it is `https:` or a loopback host — `localhost`, `127.0.0.1`, `[::1]`, and any `*.localhost` name.

You still want app-level defaults, so keep the wrapper — it just carries policy now, not security attributes:

```ts [server/myapp-helper/cookie-helper.ts]
import { deleteManagedCookie, setManagedCookie } from '#imports';
import type { ManagedCookieOptions } from '@laioutr-core/frontend-core/runtime';
import type { H3Event } from 'h3';

const commonCookieOptions: ManagedCookieOptions = {
  httpOnly: true,
  sameSite: 'strict',
  path: '/',
};

export const cookieHelper = {
  setCookie: (event: H3Event, name: string, value: string, options: ManagedCookieOptions = {}) => {
    setManagedCookie(event, name, value, { ...commonCookieOptions, ...options });
  },

  deleteCookie: (event: H3Event, name: string) => {
    deleteManagedCookie(event, name, { path: commonCookieOptions.path });
  },
};
```

Route deletions through `deleteManagedCookie` as well. A cookie set inside the preview carries `Partitioned`, and a deletion that omits it addresses the unpartitioned jar instead: the browser accepts the `Set-Cookie`, deletes nothing, and the cookie you meant to clear is still there on the next request. Logout is where this shows up.

Repeat the `path` your sets used when deleting. h3 supplies no default, so a deletion issued from a nested route is scoped to that route and leaves the root cookie in place.

## Cookies in the Studio preview

Studio renders the storefront in an iframe on a different site (`cockpit.laioutr.cloud` framing your storefront domain), which makes every cookie in that frame a third-party cookie. Two things have to be true for one to survive:

- `SameSite=None`, or the browser never sends it back to the frame at all.
- `Partitioned`, so the frame gets its own jar keyed on `(cockpit, your storefront)` — [CHIPS](https://developer.mozilla.org/en-US/docs/Web/Privacy/Guides/Privacy_sandbox/Partitioned_cookies). Browsers restrict third-party cookies differently — Safari blocks them, Firefox partitions them silently — so an unpartitioned cookie behaves differently in each. Declaring `Partitioned` is what makes the outcome the same everywhere.

`setManagedCookie` applies both, but only for requests it recognizes as coming from the preview frame. Top-level storefront traffic keeps whatever `sameSite` you passed, so a shopper's cart cookie stays `Strict` in production. Nothing to opt into.

The partition is a genuine boundary, not a formality: a cart built in the Studio preview is invisible to the same shop opened in a normal tab, and vice versa. That is the intended behavior — an editor clicking around a test cart should not disturb their own session.

### Detecting the preview yourself

Reach for `isStudioEmbedRequest` when the app's own behavior has to change inside a frame, not just its cookies:

```ts [server/routes/app-myapp/checkout.ts]
import { defineEventHandler, isStudioEmbedRequest, sendRedirect } from '#imports';
import { createHostedCheckout, renderOpenInNewTab } from '../../myapp-helper/checkout';

export default defineEventHandler(async (event) => {
  const { url } = await createHostedCheckout(event);

  // The hosted checkout sends `X-Frame-Options: DENY`, so redirecting inside
  // the preview renders a blank frame. Give the editor a link out instead.
  if (isStudioEmbedRequest(event)) {
    return renderOpenInNewTab(url);
  }

  return sendRedirect(event, url, 302);
});
```

Detection bootstraps from a handshake on the frame's first navigation and is then carried by a partitioned `__Host-laioutr-embed` marker cookie. The marker is the only durable signal — the handshake query does not survive client-side navigation, and a `fetch` from the frame to its own origin reports `Sec-Fetch-Site: same-origin`, which is indistinguishable from top-level traffic.

::note
The marker is `HttpOnly`, so client-side code cannot read it. `isStudioEmbedRequest` is server-only.
::

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
import { getCookie, setManagedCookie } from '#imports';
import type { H3Event } from 'h3';
import { VISITOR_ID_COOKIE } from '../const/cookies';
import UUIDV4 from './uuid';

export const ensureVisitorId = (event: H3Event): string => {
  let visitorId = getCookie(event, VISITOR_ID_COOKIE);

  if (!UUIDV4.validate(visitorId)) {
    visitorId = UUIDV4.random();
    setManagedCookie(event, VISITOR_ID_COOKIE, visitorId, {
      httpOnly: true,
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
