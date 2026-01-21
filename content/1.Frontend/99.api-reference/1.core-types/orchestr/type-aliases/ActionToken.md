---
title: ActionToken
description: declaration
---

> **ActionToken**<`TMetadata`> = `Tagged`<`string`, `"ActionToken"`, `TMetadata`>

An action-token represents a unique action-identifier that can be implemented by a handler

Use [defineActionToken](/api-reference/orchestr/functions/defineactiontoken) to create a new action-token.

Use [actionTokenRegistry](/api-reference/orchestr/variables/actiontokenregistry) to retrieve token-meta from a token.

## Type Parameters

| Type Parameter                                                                                        | Default type                                                                    |
| ----------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| `TMetadata` *extends* [`ActionTokenMetadata`](/api-reference/orchestr/interfaces/actiontokenmetadata) | [`ActionTokenMetadata`](/api-reference/orchestr/interfaces/actiontokenmetadata) |
