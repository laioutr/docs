---
title: defineEntityComponentToken
description: declaration
---

> **defineEntityComponentToken**\<`TName`, `TMeta`\>(`name`: `TName`, `meta`: `TMeta`): \{ `~schema`: `output`\<`TMeta`\[`"schema"`\]\>; \}

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

`TMeta` *extends* `Omit`\<[`EntityComponentTokenMetadata`](/api-reference/orchestr/type-aliases/entitycomponenttokenmetadata), `"name"`\>

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

`name`

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

\{ `~schema`: `output`\<`TMeta`\[`"schema"`\]\>; \}

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

`~schema`

</td>
<td>

`output`\<`TMeta`\[`"schema"`\]\>

</td>
</tr>
</tbody>
</table>
