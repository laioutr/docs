# Twoslash Reference

Complete reference for twoslash annotations in Laioutr documentation code examples. Twoslash runs the TypeScript compiler against your code blocks, enabling type-checked documentation.

## Enabling Twoslash

Add `twoslash` to the code block meta:

````markdown
```ts twoslash
const x = 1;
```
````

The code block must compile. Non-compiling twoslash blocks break the docs build.

## Type Display Annotations

### `^?` - Show Inferred Type

Place on the line below an identifier. The caret must align with the identifier's position.

```ts twoslash
const cart = { items: [], total: 0 };
//    ^?
```

Output: displays the inferred type `{ items: never[]; total: number }` as a hover popup.

### `^|` - Show Autocomplete

Place on the line below a dot accessor to show available completions.

```ts twoslash
const str = "hello";
str.
//  ^|
```

Output: displays autocomplete suggestions (charAt, charCodeAt, concat, etc.)

### `^^^` - Highlight Range

Underline a range of characters on the line above. The number of carets determines the highlight width.

```ts twoslash
const productName = "Nike Air Max 90";
//    ^^^^^^^^^^^
```

## Cut Markers

### `// ---cut---` - Hide Code Above

Everything above this marker is compiled but not shown in output. Use for imports, mocks, and setup.

```ts twoslash
import { defineOrchestrMock as defineOrchestr } from '@laioutr-core/orchestr/types';
// ---cut---
export default defineOrchestr.actionHandler({
  async handler(event) {
    return { items: [] };
  },
});
```

Reader sees only the `export default` and below.

### `// ---cut-after---` - Hide Code Below

Everything below this marker is compiled but not shown. Use for cleanup or assertions.

```ts twoslash
const result = await fetch('/api/products');
// ---cut-after---
console.assert(result.ok);
```

### `// ---cut-start---` / `// ---cut-end---` - Hide Section

Hide a section in the middle of the code.

```ts twoslash
const config = {
// ---cut-start---
  // Internal implementation details
  _cache: new Map(),
// ---cut-end---
  timeout: 5000,
};
```

## Error Handling

### `// @errors: CODE` - Declare Expected Errors

When showing intentionally broken code ("don't do this" patterns), declare the expected TypeScript error codes.

```ts twoslash
// @errors: 2322
const price: number = "not a number";
```

Multiple error codes separated by spaces: `// @errors: 2304 2588`

### `// @noErrors` - Suppress All Errors

Suppress all TypeScript errors for the entire block. Use sparingly - prefer `@errors:` for specific codes.

```ts twoslash
// @noErrors
const x: string = 123;
```

## Multi-File Examples

### `// @filename: path.ts` - Virtual Files

Create virtual files within a single code block. Essential for Orchestr handler examples spanning multiple files.

```ts twoslash
// @filename: shared/tokens/cart.ts
import { z } from 'zod/v4';
import { defineActionToken } from '@laioutr-core/core-types/orchestr';
export const AddToCartAction = defineActionToken('ecommerce/cart/add', {
  input: z.object({ productId: z.string(), quantity: z.number() }),
  output: z.object({ success: z.boolean() }),
});

// @filename: server/orchestr/cart/add.ts
import { defineOrchestrMock as defineOrchestr } from '@laioutr-core/orchestr/types';
// ---cut---
import { AddToCartAction } from '../../../shared/tokens/cart';

export default defineOrchestr.actionHandler(AddToCartAction, async ({ input }) => {
  return { success: true };
});
```

## Compiler Option Overrides

### `// @OPTION: VALUE`

Override TypeScript compiler options for a single block.

| Override | Example |
|---|---|
| `// @strict: true` | Enable strict mode |
| `// @target: ES2020` | Set compilation target |
| `// @module: ESNext` | Set module system |
| `// @lib: ES2020,DOM` | Set available libraries |
| `// @noImplicitAny: false` | Disable implicit any check |

## Custom Annotations

### `// @log: message`

Add a custom log annotation to the output.

### `// @warn: message`

Add a custom warning annotation to the output.

## Laioutr-Specific Configuration

The Laioutr docs twoslash setup (in `mdc.config.ts`) includes:
- Floating Vue popups for type hovers (rendered with `rendererFloatingVue`)
- Strict mode enabled by default
- `verbatimModuleSyntax: true`
- Vue JSX support
- Browser fallback: strips twoslash notation client-side (no re-compilation)

## Common Issues

| Issue | Cause | Fix |
|---|---|---|
| "Cannot find module" | Missing mock import | Add import above `---cut---` |
| Duplicate identifier | Multi-file without `@filename:` | Add `// @filename:` markers |
| Type error in hidden code | Mock type mismatch | Check `@laioutr-core/orchestr/types` exports |
| Build hangs | Infinite type recursion | Simplify types or use `@noErrors` |
| Browser shows raw annotations | Client-side rendering | Normal - fallback strips annotations |
