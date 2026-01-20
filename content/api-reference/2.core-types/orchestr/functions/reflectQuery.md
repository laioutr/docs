---
title: reflectQuery
description: declaration
---

> **reflectQuery**(`query`: [`QueryTokenMetadata`](/api-reference/orchestr/interfaces/querytokenmetadata), `implementations`: [`ReflectedQueryImplementation`](/api-reference/orchestr/interfaces/reflectedqueryimplementation)[] ): { `defaultLimit?`: `number`; `description?`: `string`; `entity`: `string`; `implementations`: [`ReflectedQueryImplementation`](/api-reference/orchestr/interfaces/reflectedqueryimplementation)[] ; `input`: `JSONSchema`; `label`: `string`; `name`: `string`; `type`: [`QueryTokenType`](/api-reference/orchestr/type-aliases/querytokentype); }

## Parameters

| Parameter         | Type                                                                                                | Default value |
| ----------------- | --------------------------------------------------------------------------------------------------- | ------------- |
| `query`           | [`QueryTokenMetadata`](/api-reference/orchestr/interfaces/querytokenmetadata)                       | `undefined`   |
| `implementations` | [`ReflectedQueryImplementation`](/api-reference/orchestr/interfaces/reflectedqueryimplementation)[] | `[]`          |

## Returns

{ `defaultLimit?`: `number`; `description?`: `string`; `entity`: `string`; `implementations`: [`ReflectedQueryImplementation`](/api-reference/orchestr/interfaces/reflectedqueryimplementation)[] ; `input`: `JSONSchema`; `label`: `string`; `name`: `string`; `type`: [`QueryTokenType`](/api-reference/orchestr/type-aliases/querytokentype); }

| Name              | Type                                                                                                |
| ----------------- | --------------------------------------------------------------------------------------------------- |
| `defaultLimit?`   | `number`                                                                                            |
| `description?`    | `string`                                                                                            |
| `entity`          | `string`                                                                                            |
| `implementations` | [`ReflectedQueryImplementation`](/api-reference/orchestr/interfaces/reflectedqueryimplementation)[] |
| `input`           | `JSONSchema`                                                                                        |
| `label`           | `string`                                                                                            |
| `name`            | `string`                                                                                            |
| `type`            | [`QueryTokenType`](/api-reference/orchestr/type-aliases/querytokentype)                             |
