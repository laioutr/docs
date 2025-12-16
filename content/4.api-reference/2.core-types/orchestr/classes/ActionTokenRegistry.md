---
title: ActionTokenRegistry
description: declaration
---

## Constructors

### Constructor

> **new ActionTokenRegistry**(): `ActionTokenRegistry`

#### Returns

`ActionTokenRegistry`

## Methods

### all()

> **all**(): [`ActionTokenMetadata`](/api-reference/orchestr/interfaces/actiontokenmetadata)\<`string`, `ZodType`\<`unknown`, `unknown`, `$ZodTypeInternals`\<`unknown`, `unknown`\>\>, `ZodType`\<`unknown`, `unknown`, `$ZodTypeInternals`\<`unknown`, `unknown`\>\>\>[]

#### Returns

[`ActionTokenMetadata`](/api-reference/orchestr/interfaces/actiontokenmetadata)\<`string`, `ZodType`\<`unknown`, `unknown`, `$ZodTypeInternals`\<`unknown`, `unknown`\>\>, `ZodType`\<`unknown`, `unknown`, `$ZodTypeInternals`\<`unknown`, `unknown`\>\>\>[]

***

### getMetadata()

> **getMetadata**\<`TToken`\>(`actionToken`: `TToken`): `undefined` \| [`ActionTokenMetadataOf`](/api-reference/orchestr/type-aliases/actiontokenmetadataof)\<`TToken`\>

#### Type Parameters

<table>
<thead>
<tr>
<th>Type Parameter</th>
</tr>
</thead>
<tbody>
<tr>
<td>

`TToken` *extends* [`ActionToken`](/api-reference/orchestr/type-aliases/actiontoken)

</td>
</tr>
</tbody>
</table>

#### Parameters

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

`actionToken`

</td>
<td>

`TToken`

</td>
</tr>
</tbody>
</table>

#### Returns

`undefined` \| [`ActionTokenMetadataOf`](/api-reference/orchestr/type-aliases/actiontokenmetadataof)\<`TToken`\>

***

### register()

> **register**(`actionToken`: [`ActionToken`](/api-reference/orchestr/type-aliases/actiontoken), `metadata`: [`ActionTokenMetadata`](/api-reference/orchestr/interfaces/actiontokenmetadata)): `void`

#### Parameters

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

`actionToken`

</td>
<td>

[`ActionToken`](/api-reference/orchestr/type-aliases/actiontoken)

</td>
</tr>
<tr>
<td>

`metadata`

</td>
<td>

[`ActionTokenMetadata`](/api-reference/orchestr/interfaces/actiontokenmetadata)

</td>
</tr>
</tbody>
</table>

#### Returns

`void`
