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

> **all**(): [`ActionTokenMetadata`](/api-reference/orchestr/interfaces/actiontokenmetadata)<`string`, `ZodType`<`unknown`, `unknown`, `$ZodTypeInternals`<`unknown`, `unknown`>>, `ZodType`<`unknown`, `unknown`, `$ZodTypeInternals`<`unknown`, `unknown`>>> []

#### Returns

[`ActionTokenMetadata`](/api-reference/orchestr/interfaces/actiontokenmetadata)<`string`, `ZodType`<`unknown`, `unknown`, `$ZodTypeInternals`<`unknown`, `unknown`>>, `ZodType`<`unknown`, `unknown`, `$ZodTypeInternals`<`unknown`, `unknown`>>> []

---

### getMetadata()

> **getMetadata**<`TToken`>(`actionToken`: `TToken`): `undefined` | [`ActionTokenMetadataOf`](/api-reference/orchestr/type-aliases/actiontokenmetadataof)<`TToken`>

#### Type Parameters

| Type Parameter                                                                       |
| ------------------------------------------------------------------------------------ |
| `TToken` *extends* [`ActionToken`](/api-reference/orchestr/type-aliases/actiontoken) |

#### Parameters

| Parameter     | Type     |
| ------------- | -------- |
| `actionToken` | `TToken` |

#### Returns

`undefined` | [`ActionTokenMetadataOf`](/api-reference/orchestr/type-aliases/actiontokenmetadataof)<`TToken`>

---

### register()

> **register**(`actionToken`: [`ActionToken`](/api-reference/orchestr/type-aliases/actiontoken), `metadata`: [`ActionTokenMetadata`](/api-reference/orchestr/interfaces/actiontokenmetadata)): `void`

#### Parameters

| Parameter     | Type                                                                            |
| ------------- | ------------------------------------------------------------------------------- |
| `actionToken` | [`ActionToken`](/api-reference/orchestr/type-aliases/actiontoken)               |
| `metadata`    | [`ActionTokenMetadata`](/api-reference/orchestr/interfaces/actiontokenmetadata) |

#### Returns

`void`
