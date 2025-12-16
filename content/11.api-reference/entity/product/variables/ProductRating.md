---
title: ProductRating
description: declaration
---

> `const` **ProductRating**: \{ `~schema`: \{ `average`: `number`; `count`: `number`; \}; \}

Product rating and review count.

## Type declaration

<table>
<thead>
<tr>
<th>Name</th>
<th>Type</th>
<th>Default value</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>

<a id="schema"></a> `~schema`

</td>
<td>

\{ `average`: `number`; `count`: `number`; \}

</td>
<td>

&hyphen;

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

`~schema.average`

</td>
<td>

`number`

</td>
<td>

`Rating`

</td>
<td>

Average rating of the product.

A rating between 1 and 5. No other scale is supported at the moment. Decimals are allowed.

</td>
</tr>
<tr>
<td>

`~schema.count`

</td>
<td>

`number`

</td>
<td>

&hyphen;

</td>
<td>

Number of ratings.

</td>
</tr>
</tbody>
</table>

## See

https://schema.org/AggregateRating
