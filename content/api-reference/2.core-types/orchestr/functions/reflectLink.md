---
title: reflectLink
description: declaration
---

> **reflectLink**(`link`: [`LinkTokenMetadata`](/api-reference/orchestr/interfaces/linktokenmetadata), `implementations`: [`ReflectedLinkImplementation`](/api-reference/orchestr/interfaces/reflectedlinkimplementation)[] ): { `defaultLimit?`: `number`; `description?`: `string`; `implementations`: [`ReflectedLinkImplementation`](/api-reference/orchestr/interfaces/reflectedlinkimplementation)[] ; `input`: `JSONSchema`; `label`: `string`; `name`: `string`; `source`: `string`; `target`: `string`; `type`: [`LinkTokenType`](/api-reference/orchestr/type-aliases/linktokentype); }

## Parameters

| Parameter         | Type                                                                                              | Default value |
| ----------------- | ------------------------------------------------------------------------------------------------- | ------------- |
| `link`            | [`LinkTokenMetadata`](/api-reference/orchestr/interfaces/linktokenmetadata)                       | `undefined`   |
| `implementations` | [`ReflectedLinkImplementation`](/api-reference/orchestr/interfaces/reflectedlinkimplementation)[] | `[]`          |

## Returns

{ `defaultLimit?`: `number`; `description?`: `string`; `implementations`: [`ReflectedLinkImplementation`](/api-reference/orchestr/interfaces/reflectedlinkimplementation)[] ; `input`: `JSONSchema`; `label`: `string`; `name`: `string`; `source`: `string`; `target`: `string`; `type`: [`LinkTokenType`](/api-reference/orchestr/type-aliases/linktokentype); }

| Name              | Type                                                                                              |
| ----------------- | ------------------------------------------------------------------------------------------------- |
| `defaultLimit?`   | `number`                                                                                          |
| `description?`    | `string`                                                                                          |
| `implementations` | [`ReflectedLinkImplementation`](/api-reference/orchestr/interfaces/reflectedlinkimplementation)[] |
| `input`           | `JSONSchema`                                                                                      |
| `label`           | `string`                                                                                          |
| `name`            | `string`                                                                                          |
| `source`          | `string`                                                                                          |
| `target`          | `string`                                                                                          |
| `type`            | [`LinkTokenType`](/api-reference/orchestr/type-aliases/linktokentype)                             |
