---
title: defineLinkToken
description: declaration
---

> **defineLinkToken**\<`TName`, `TMeta`\>(`link`: `TName`, `meta`: `TMeta`): [`LinkToken`](/api-reference/orchestr/type-aliases/linktoken)\<\{ `name`: `TName`; \} & `TMeta`\>

Define a link-token.

Returns a tagged string that can be used to identify the link.

## Type Parameters

<table>
<thead>
<tr>
<th>Type Parameter</th>
</tr>
</thead>
<tbody>
<tr>
<td>

`TName` *extends* `string`

</td>
</tr>
<tr>
<td>

`TMeta` *extends* `Omit`\<[`LinkTokenMetadata`](/api-reference/orchestr/interfaces/linktokenmetadata)\<`string`, `string`, `string`, [`LinkTokenType`](/api-reference/orchestr/type-aliases/linktokentype), `ZodType`\<`unknown`, `unknown`, `$ZodTypeInternals`\<`unknown`, `unknown`\>\>\>, `"name"`\>

</td>
</tr>
</tbody>
</table>

## Parameters

<table>
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
</tr>
</thead>
<tbody>
<tr>
<td>

`link`

</td>
<td>

`TName`

</td>
</tr>
<tr>
<td>

`meta`

</td>
<td>

`TMeta`

</td>
</tr>
</tbody>
</table>

## Returns

[`LinkToken`](/api-reference/orchestr/type-aliases/linktoken)\<\{ `name`: `TName`; \} & `TMeta`\>
