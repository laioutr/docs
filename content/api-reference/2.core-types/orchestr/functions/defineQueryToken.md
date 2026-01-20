---
title: defineQueryToken
description: declaration
---

> **defineQueryToken**<`TName`, `TMeta`>(`query`: `TName`, `meta`: `TMeta`): [`QueryToken`](/api-reference/orchestr/type-aliases/querytoken)<{ `name`: `TName`; } & `TMeta`>

Define an query-token.

Returns a tagged string that can be used to identify the query.

## Type Parameters

| Type Parameter                                                                                                                                                                                                                                                                             |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `TName` *extends* `string`                                                                                                                                                                                                                                                                 |
| `TMeta` *extends* `Omit`<[`QueryTokenMetadata`](/api-reference/orchestr/interfaces/querytokenmetadata)<`string`, `string`, [`QueryTokenType`](/api-reference/orchestr/type-aliases/querytokentype), `ZodType`<`unknown`, `unknown`, `$ZodTypeInternals`<`unknown`, `unknown`>>>, `"name"`> |

## Parameters

| Parameter | Type    |
| --------- | ------- |
| `query`   | `TName` |
| `meta`    | `TMeta` |

## Returns

[`QueryToken`](/api-reference/orchestr/type-aliases/querytoken)<{ `name`: `TName`; } & `TMeta`>
