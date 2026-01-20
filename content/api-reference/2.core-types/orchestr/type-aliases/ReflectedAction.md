---
title: ReflectedAction
description: declaration
---

> **ReflectedAction** = `Omit`<[`ActionTokenMetadata`](/api-reference/orchestr/interfaces/actiontokenmetadata), `"input"` | `"output"`> & { `implementations`: [`ReflectedActionImplementation`](/api-reference/orchestr/interfaces/reflectedactionimplementation)[] ; `input`: `JSONSchema`; `output`: `JSONSchema`; }

## Type declaration

| Name              | Type                                                                                                  |
| ----------------- | ----------------------------------------------------------------------------------------------------- |
| `implementations` | [`ReflectedActionImplementation`](/api-reference/orchestr/interfaces/reflectedactionimplementation)[] |
| `input`           | `JSONSchema`                                                                                          |
| `output`          | `JSONSchema`                                                                                          |
