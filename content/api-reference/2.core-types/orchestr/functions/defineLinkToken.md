---
title: defineLinkToken
description: declaration
---

> **defineLinkToken**<`TName`, `TMeta`>(`link`: `TName`, `meta`: `TMeta`): [`LinkToken`](/api-reference/orchestr/type-aliases/linktoken)<{ `name`: `TName`; } & `TMeta`>

Define a link-token.

Returns a tagged string that can be used to identify the link.

## Type Parameters

| Type Parameter                                                                                                                                                                                                                                                                                   |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `TName` *extends* `string`                                                                                                                                                                                                                                                                       |
| `TMeta` *extends* `Omit`<[`LinkTokenMetadata`](/api-reference/orchestr/interfaces/linktokenmetadata)<`string`, `string`, `string`, [`LinkTokenType`](/api-reference/orchestr/type-aliases/linktokentype), `ZodType`<`unknown`, `unknown`, `$ZodTypeInternals`<`unknown`, `unknown`>>>, `"name"`> |

## Parameters

| Parameter | Type    |
| --------- | ------- |
| `link`    | `TName` |
| `meta`    | `TMeta` |

## Returns

[`LinkToken`](/api-reference/orchestr/type-aliases/linktoken)<{ `name`: `TName`; } & `TMeta`>
