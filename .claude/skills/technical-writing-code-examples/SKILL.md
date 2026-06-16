---
name: technical-writing-code-examples
description: Use when writing or reviewing code examples in Laioutr documentation, when enforcing twoslash TypeScript type annotations, or when code blocks need quality review for copy-pasteability and realistic values.
---

# Code Examples Quality

Enforce code example quality in Laioutr technical documentation. Deep twoslash integration for TypeScript type explanations. Invoked by `technical-writing` during writing and QA steps.

## When to Use

- Writing code examples for any Laioutr documentation page
- Reviewing existing code examples for quality
- Adding twoslash type annotations to TypeScript examples
- Creating multi-file Orchestr handler examples

## Core Rules

### 1. Every code example must compile

Twoslash runs the TypeScript compiler. Non-compiling docs are bugs. If a code block has ` ```ts twoslash `, it must pass the compiler.

### 2. Use `// ---cut---` to hide setup

Imports, mock declarations, and boilerplate go above the cut. The reader sees only the relevant code.

```ts twoslash
import { defineOrchestrMock as defineOrchestr } from '@laioutr-core/orchestr/types';
// ---cut---
export default defineOrchestr.actionHandler({
  async handler(event) {
    return { items: [] };
  },
});
```

### 3. Use Laioutr's mock type pattern

Import mock type creators from `@laioutr-core/orchestr/types` with aliased names so the reader sees the real API:

```ts twoslash
import { defineOrchestrMock as defineOrchestr } from '@laioutr-core/orchestr/types';
// ---cut---
export default defineOrchestr.actionHandler(/* reader sees this */);
```

Full mock pattern reference: see `reference/laioutr-mock-patterns.md`

### 4. Show types with `^?`

Use query annotations to display inferred TypeScript types inline:

```ts twoslash
const cart = { items: [{ id: 'nike-air-max', qty: 1 }], total: 99.99 };
//    ^?
```

### 5. Use `// @errors:` for intentional errors

When showing "don't do this" patterns, declare expected error codes:

```ts twoslash
// @errors: 2322
const price: number = "not a number";
```

### 6. Code-group for multi-environment

Use `::code-group` with tabs for npm/pnpm/yarn or different app integrations.

### 7. Realistic values only

Use Laioutr domain values: product names (`nike-air-max-90`), cart actions (`addToCart`), Orchestr queries (`getProductDetails`). Never foo/bar/baz. Also use correct API names from the actual library — e.g. pinia-colada exposes `isPending` not `isLoading` on mutation/query composables.

### 8. Show expected output

After every executable example, show what the reader should see.

### 9. Combine with `::steps`

Each tutorial step gets its own progressive code block, building on the previous one.

### 10. Use `// @filename:` for multi-file patterns

Essential for Orchestr handlers spanning multiple files:

```ts twoslash
// @filename: server/orchestr/actions/cart/add.ts
import { defineOrchestrMock as defineOrchestr } from '@laioutr-core/orchestr/types';
// ---cut---
export default defineOrchestr.actionHandler({
  async handler(event) {
    const { productId, quantity } = event.body;
    return { success: true };
  },
});
```

### File-path labels on code blocks

Always add a file-path label to code blocks so readers know where the code lives:

````markdown
```typescript [server/orchestr/cart/add.ts]
```
```vue [app/components/AddToCartButton.vue]
```
```ini [.env]
```
````

## Twoslash Quick Reference

| Annotation | Purpose |
|---|---|
| `// ^?` | Show inferred type of identifier above |
| `// ^|` | Show autocomplete suggestions |
| `// ^^^` | Highlight range on line above |
| `// ---cut---` | Hide all code above from output |
| `// ---cut-after---` | Hide all code below from output |
| `// ---cut-start---` / `// ---cut-end---` | Hide section between markers |
| `// @errors: 2304 2588` | Declare expected TypeScript errors |
| `// @noErrors` | Suppress all TypeScript errors |
| `// @filename: path.ts` | Create virtual file for multi-file examples |
| `// @log: message` | Custom log annotation |
| `// @warn: message` | Custom warning annotation |

Full twoslash reference: see `reference/twoslash-reference.md`

## Common Mistakes

- **Non-compiling twoslash blocks.** If you use ` ```ts twoslash `, the compiler will run. Fix all type errors or use `// @errors:` to declare intentional ones.
- **Showing imports the reader doesn't need.** Use `// ---cut---` to hide mock imports and setup.
- **Missing `// @filename:` in multi-file examples.** Without it, twoslash treats everything as one file and you get duplicate identifier errors.
- **Placeholder values.** "foo" and "myVariable" teach nothing. Use `productId`, `cartTotal`, `addToCart`.
- **No expected output.** The reader needs to verify they're on track. Show what they should see.
