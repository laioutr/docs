# Laioutr Mock Type Patterns

Laioutr provides mock type exports specifically for documentation. These mocks have the same type signatures as the real runtime functions but are lightweight stubs that twoslash can compile without the full Orchestr runtime.

## Why Mocks?

The real `defineOrchestr` is a runtime function that depends on server-side Nuxt context. Twoslash compiles code in isolation, so it can't use the real runtime. The mock exports provide identical TypeScript types without runtime dependencies.

## Available Mocks

All mocks are exported from `@laioutr-core/orchestr/types`:

| Mock Export | Real Function | Use Case |
|---|---|---|
| `defineOrchestrMock` | `defineOrchestr` | Orchestr builder (actions, queries, middleware) |
| `defineActionHandlerMock` | `defineActionHandler` | Shortcut for action handlers |
| `defineQueryHandlerMock` | `defineQueryHandler` | Query handlers |
| `defineLinkHandlerMock` | `defineLinkHandler` | Link handlers |
| `defineComponentResolverMock` | `defineComponentResolver` | Component resolvers |
| `useMutationActionMock` | `useMutationAction` | Frontend mutation composable |
| `useQueryActionMock` | `useQueryAction` | Frontend query composable |
| `fetchActionMock` | `fetchAction` | Server-side action fetch |
| `useFetchActionMock` | `useFetchAction` | Frontend fetch composable |

## The Aliasing Pattern

Import the mock with an alias so readers see the real API name:

```ts twoslash
import { defineOrchestrMock as defineOrchestr } from '@laioutr-core/orchestr/types';
// ---cut---
export default defineOrchestr.actionHandler({
  async handler(event) {
    return { items: [] };
  },
});
```

The reader sees `defineOrchestr.actionHandler(...)` -- the real API. The mock import is hidden above `---cut---`.

## Pattern: Action Handler

```ts twoslash
import { defineOrchestrMock as defineOrchestr } from '@laioutr-core/orchestr/types';
declare const subscribeToNewsletter: (email: string) => Promise<void>;
// ---cut---
import { SubscribeAction } from '@laioutr-core/canonical-types/newsletter';

export default defineOrchestr.actionHandler(SubscribeAction, async ({ input }) => {
  await subscribeToNewsletter(input.email);
  return { status: 'success' as const };
});
```

Note: `declare const` is used for external functions that the handler calls. These go above `---cut---` too.

## Pattern: Action Handler Shortcut

```ts twoslash
import { defineActionHandlerMock as defineActionHandler } from '@laioutr-core/orchestr/types';
// ---cut---
import { CartAddItemsAction } from '@laioutr-core/canonical-types/ecommerce';

export default defineActionHandler(CartAddItemsAction, async ({ input }) => {
  return { success: true };
});
```

## Pattern: Middleware

```ts twoslash
import { defineOrchestrMock as defineOrchestr } from '@laioutr-core/orchestr/types';
declare const createCrmClient: () => { subscribe: (email: string) => Promise<void> };
// ---cut---
const defineMyPackage = defineOrchestr.use((args, next) => {
  return next({
    context: { client: createCrmClient() }
  });
});
```

## Pattern: Frontend Composable

```ts twoslash
import { useMutationActionMock as useMutationAction } from '@laioutr-core/orchestr/types';
// ---cut---
import { CartAddItemsAction } from '@laioutr-core/canonical-types/ecommerce';

const { mutate, status } = useMutationAction(CartAddItemsAction);

await mutate({
  productId: 'nike-air-max-90',
  quantity: 1,
});
```

## Pattern: Using clientEnv

```ts twoslash
import { defineActionHandlerMock as defineActionHandler } from '@laioutr-core/orchestr/types';
declare const getLanguageByLocale: (locale: string) => string;
// ---cut---
import { AuthRegisterAction } from '@laioutr-core/canonical-types/ecommerce';

export default defineActionHandler(AuthRegisterAction, async ({ clientEnv }) => {
  const userLanguage = getLanguageByLocale(clientEnv.locale);
  // ...
});
```

## Pattern: Error Handling

```ts twoslash
import { defineActionHandlerMock as defineActionHandler } from '@laioutr-core/orchestr/types';
// ---cut---
import { CartAddItemsAction, ProductNotFoundError } from '@laioutr-core/canonical-types/ecommerce';

export default defineActionHandler(CartAddItemsAction, async ({ input }) => {
  throw new ProductNotFoundError('product-123');
});
```

## Rules for Using Mocks

1. **Always alias to the real name** -- `defineOrchestrMock as defineOrchestr`, never show the mock name to readers
2. **Always hide mock imports with `---cut---`** -- readers should see production-like code
3. **Use `declare const` for external dependencies** -- above `---cut---` for helpers the handler calls
4. **Import canonical types below the cut** -- `import { SubscribeAction } from '...'` is real code the reader writes
5. **Match the real file path in the code block label** -- `[server/orchestr/newsletter/subscribe.ts]`
