---
title: defineEntityComponentToken
description: declaration
---

> **defineEntityComponentToken**<`TName`, `TMeta`>(`name`: `TName`, `meta`: `TMeta`): { `~schema`: `output`<`TMeta`\[`"schema"`]>; }

## Type Parameters

| Type Parameter                                                                                                                          |
| --------------------------------------------------------------------------------------------------------------------------------------- |
| `TName` *extends* `string`                                                                                                              |
| `TMeta` *extends* `Omit`<[`EntityComponentTokenMetadata`](/api-reference/orchestr/type-aliases/entitycomponenttokenmetadata), `"name"`> |

## Parameters

| Parameter | Type    |
| --------- | ------- |
| `name`    | `TName` |
| `meta`    | `TMeta` |

## Returns

{ `~schema`: `output`<`TMeta`\[`"schema"`]>; }

| Name      | Type                           |
| --------- | ------------------------------ |
| `~schema` | `output`<`TMeta`\[`"schema"`]> |
