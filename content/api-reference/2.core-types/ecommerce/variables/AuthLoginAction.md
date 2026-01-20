---
title: AuthLoginAction
description: declaration
---

> `const` **AuthLoginAction**: [`ActionToken`](/api-reference/orchestr/type-aliases/actiontoken)<{ `input`: `ZodObject`; `name`: `"ecommerce/auth/login"`; `output`: `ZodVoid`; }>

Login a customer using email and password.

After successful login, the customer will be authenticated and can access their account.

Implementations should store any user-identifying information in the session or cookies.

Laioutr frontend-core does not provide a session-implementation at the moment. To store user-data,
use either a cookie or an encrypted cookie (using [nuxt-auth-utils](https://github.com/atinux/nuxt-auth-utils)).

## Throws

[InvalidCredentialsError](/api-reference/ecommerce/classes/invalidcredentialserror)
