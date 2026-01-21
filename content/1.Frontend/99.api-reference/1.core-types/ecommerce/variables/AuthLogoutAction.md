---
title: AuthLogoutAction
description: declaration
---

> `const` **AuthLogoutAction**: [`ActionToken`](/api-reference/orchestr/type-aliases/actiontoken)<{ `input`: `ZodObject`; `name`: `"ecommerce/auth/logout"`; `output`: `ZodVoid`; }>

Logout a customer.

Implementations should remove any user-identifying information from the session or cookies.
