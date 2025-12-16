---
title: defineActionToken
description: declaration
---

> **defineActionToken**\<`TName`, `TInput`, `TOutput`\>(`action`: `TName`, `meta`: \{ `input?`: `TInput`; `output?`: `TOutput`; \}): [`ActionToken`](/api-reference/orchestr/type-aliases/actiontoken)\<\{ `input`: `TInput`; `name`: `TName`; `output`: `TOutput`; \}\>

Define an action-token.

Returns a tagged string that can be used to identify the action.

It is recommended to use a namespaced name like `my-package/newsletter/custom-action` to avoid conflicts with other packages.

## Type Parameters

<table>
<thead>
<tr>
<th>Type Parameter</th>
<th>Default type</th>
</tr>
</thead>
<tbody>
<tr>
<td>

`TName` *extends* `string`

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

`TInput` *extends* `ZodType`\<`unknown`, `unknown`, `$ZodTypeInternals`\<`unknown`, `unknown`\>\>

</td>
<td>

`ZodUndefined`

</td>
</tr>
<tr>
<td>

`TOutput` *extends* `ZodType`\<`unknown`, `unknown`, `$ZodTypeInternals`\<`unknown`, `unknown`\>\>

</td>
<td>

`ZodVoid`

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

`action`

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

\{ `input?`: `TInput`; `output?`: `TOutput`; \}

</td>
</tr>
<tr>
<td>

`meta.input?`

</td>
<td>

`TInput`

</td>
</tr>
<tr>
<td>

`meta.output?`

</td>
<td>

`TOutput`

</td>
</tr>
</tbody>
</table>

## Returns

[`ActionToken`](/api-reference/orchestr/type-aliases/actiontoken)\<\{ `input`: `TInput`; `name`: `TName`; `output`: `TOutput`; \}\>
