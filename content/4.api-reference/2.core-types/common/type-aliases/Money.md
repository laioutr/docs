---
title: Money
description: declaration
---

> **Money** = \{ `amount`: `number`; `currency`: `string`; \}

A Money object describes a monetary value.

You can use e.g. `@screeny05/ts-money` to create and manipulate Money objects.

## Type declaration

<table>
<thead>
<tr>
<th>Name</th>
<th>Type</th>
</tr>
</thead>
<tbody>
<tr>
<td>

<a id="amount"></a> `amount`

</td>
<td>

`number`

</td>
</tr>
<tr>
<td>

<a id="currency"></a> `currency`

</td>
<td>

`string`

</td>
</tr>
</tbody>
</table>

## See

https://martinfowler.com/eaaCatalog/money.html

## Example

```ts
Money.from(product.price).multiply(quantity) // => Money
```
