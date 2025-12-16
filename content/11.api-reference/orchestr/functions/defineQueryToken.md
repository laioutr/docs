---
title: defineQueryToken
description: declaration
---

> **defineQueryToken**\<`TName`, `TMeta`\>(`query`: `TName`, `meta`: `TMeta`): [`QueryToken`](/api-reference/orchestr/type-aliases/querytoken)\<\{ `name`: `TName`; \} & `TMeta`\>

Define an query-token.

Returns a tagged string that can be used to identify the query.

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

`TMeta` *extends* `Omit`\<[`QueryTokenMetadata`](/api-reference/orchestr/interfaces/querytokenmetadata)\<`string`, `string`, [`QueryTokenType`](/api-reference/orchestr/type-aliases/querytokentype), `ZodType`\<`unknown`, `unknown`, `$ZodTypeInternals`\<`unknown`, `unknown`\>\>\>, `"name"`\>

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

`query`

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

[`QueryToken`](/api-reference/orchestr/type-aliases/querytoken)\<\{ `name`: `TName`; \} & `TMeta`\>
