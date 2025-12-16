---
title: Money
description: declaration
---

> `const` **Money**: `z.ZodObject`\<[`Money`](/api-reference/common/type-aliases/money)\>

A Money object describes a monetary value.

You can use e.g. `@screeny05/ts-money` to create and manipulate Money objects.

## See

https://martinfowler.com/eaaCatalog/money.html

## Example

```ts
Money.from(product.price).multiply(quantity) // => Money
```
