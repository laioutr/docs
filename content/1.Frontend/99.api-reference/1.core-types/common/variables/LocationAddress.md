---
title: LocationAddress
description: declaration
---

> `const` **LocationAddress**: `z.ZodObject`<{ `address1`: `z.ZodString`; `address2`: `z.ZodOptional`<`z.ZodString`>; `city`: `z.ZodString`; `countryCode`: `z.ZodString`; `latitude`: `z.ZodOptional`<`z.ZodNumber`>; `longitude`: `z.ZodOptional`<`z.ZodNumber`>; `postalCode`: `z.ZodString`; `provinceCode`: `z.ZodOptional`<`z.ZodString`>; }, `z.core.$strip`>

Represents the address of a location.

If you are looking for the address of a person, use [MailingAddress](/api-reference/common/variables/mailingaddress) instead.

## See

- [schema.org PostalAddress](https://schema.org/PostalAddress)
- [Shopify LocationAddress](https://shopify.dev/docs/api/storefront/2025-01/objects/locationaddress)
