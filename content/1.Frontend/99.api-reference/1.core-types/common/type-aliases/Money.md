---
title: Money
description: declaration
---

> **Money** = { `amount`: `number`; `currency`: `string`; }

A Money object describes a monetary value.

You can use e.g. `@screeny05/ts-money` to create and manipulate Money objects.

## Type declaration

| Name                       | Type     |
| -------------------------- | -------- |
| [](){#amount} `amount`     | `number` |
| [](){#currency} `currency` | `string` |

## See

<https://martinfowler.com/eaaCatalog/money.html>

## Example

```ts
Money.from(product.price).multiply(quantity) // => Money
```
