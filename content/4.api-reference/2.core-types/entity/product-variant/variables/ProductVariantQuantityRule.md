---
title: ProductVariantQuantityRule
description: declaration
---

> `const` **ProductVariantQuantityRule**: \{ `~schema`: \{ `increment`: `number`; `max?`: `number`; `min`: `number`; \}; \}

Represents the quantity rule for a product variant.

## Type declaration

<table>
<thead>
<tr>
<th>Name</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>

<a id="schema"></a> `~schema`

</td>
<td>

\{ `increment`: `number`; `max?`: `number`; `min`: `number`; \}

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

`~schema.increment`

</td>
<td>

`number`

</td>
<td>

The quantity increment between min and max. All valid quantities must be divisible by this value.
Must be less than or equal to min and max.

</td>
</tr>
<tr>
<td>

`~schema.max?`

</td>
<td>

`number`

</td>
<td>

If set, must be lower than or equal to the minimum. Must be a multiple of the increment.

</td>
</tr>
<tr>
<td>

`~schema.min`

</td>
<td>

`number`

</td>
<td>

Minimum quantity a user has to purchase. Must be a multiple of the increment.

</td>
</tr>
</tbody>
</table>

## See

https://shopify.dev/docs/api/storefront/2025-01/objects/quantityrule
