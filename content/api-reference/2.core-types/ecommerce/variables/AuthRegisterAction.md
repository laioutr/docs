---
title: AuthRegisterAction
description: declaration
---

> `const` **AuthRegisterAction**: [`ActionToken`](/api-reference/orchestr/type-aliases/actiontoken)<{ `input`: `ZodObject`; `name`: `"ecommerce/auth/register"`; `output`: `ZodVoid`; }>

Register a new customer.

After successful registration, the customer will be authenticated and can access their account.

## Throws

[InvalidFieldError](/api-reference/ecommerce/classes/invalidfielderror)
