# Code Block File Names

When a code example shows the contents of a real file, put the path in the code block's meta (between the language and any other modifiers like `twoslash`), not as a leading `// path/to/file.ts` comment inside the block.

## Use this

````md
```ts [server/orchestr/cart/add-items.action.ts]
export default defineMyAppAction(...)
```

```typescript [shared/tokens/newsletter/custom.action.ts] twoslash
import { z } from 'zod/v4';
// ...
```
````

## Don't do this

````md
```ts
// src/runtime/server/orchestr/cart/add-items.action.ts
export default defineMyAppAction(...)
```
````

## Why

Docus renders the meta as a header/badge above the code block, which is more scannable than a comment that the reader has to mentally strip out. It also keeps the code itself focused on what it does, not where it lives.

## Notes

- Drop the `src/runtime/` prefix in the meta when it's not load-bearing — `server/orchestr/cart/add-items.action.ts` is plenty.
- If you need to label a snippet that isn't a real file (a sketch of an idea, a one-liner), no meta is needed.
- The filename meta works alongside `twoslash` and other modifiers: ```` ```ts [path] twoslash ````.
