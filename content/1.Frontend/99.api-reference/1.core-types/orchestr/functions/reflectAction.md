---
title: reflectAction
description: declaration
---

> **reflectAction**(`action`: [`ActionTokenMetadata`](/api-reference/orchestr/interfaces/actiontokenmetadata), `implementations`: [`ReflectedActionImplementation`](/api-reference/orchestr/interfaces/reflectedactionimplementation)[] ): { `implementations`: [`ReflectedActionImplementation`](/api-reference/orchestr/interfaces/reflectedactionimplementation)[] ; `input`: `JSONSchema`; `name`: `string`; `output`: `JSONSchema`; }

## Parameters

| Parameter         | Type                                                                                                  | Default value |
| ----------------- | ----------------------------------------------------------------------------------------------------- | ------------- |
| `action`          | [`ActionTokenMetadata`](/api-reference/orchestr/interfaces/actiontokenmetadata)                       | `undefined`   |
| `implementations` | [`ReflectedActionImplementation`](/api-reference/orchestr/interfaces/reflectedactionimplementation)[] | `[]`          |

## Returns

{ `implementations`: [`ReflectedActionImplementation`](/api-reference/orchestr/interfaces/reflectedactionimplementation)[] ; `input`: `JSONSchema`; `name`: `string`; `output`: `JSONSchema`; }

| Name              | Type                                                                                                  |
| ----------------- | ----------------------------------------------------------------------------------------------------- |
| `implementations` | [`ReflectedActionImplementation`](/api-reference/orchestr/interfaces/reflectedactionimplementation)[] |
| `input`           | `JSONSchema`                                                                                          |
| `name`            | `string`                                                                                              |
| `output`          | `JSONSchema`                                                                                          |
