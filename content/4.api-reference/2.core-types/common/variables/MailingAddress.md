---
title: MailingAddress
description: declaration
---

> `const` **MailingAddress**: `z.ZodObject`\<\{ `address1`: `z.ZodString`; `address2`: `z.ZodOptional`\<`z.ZodString`\>; `city`: `z.ZodString`; `company`: `z.ZodOptional`\<`z.ZodString`\>; `countryCode`: `z.ZodString`; `firstName`: `z.ZodString`; `lastName`: `z.ZodString`; `latitude`: `z.ZodOptional`\<`z.ZodNumber`\>; `longitude`: `z.ZodOptional`\<`z.ZodNumber`\>; `phone`: `z.ZodOptional`\<`z.ZodString`\>; `postalCode`: `z.ZodString`; `provinceCode`: `z.ZodOptional`\<`z.ZodString`\>; `salutation`: `z.ZodOptional`\<`z.ZodString`\>; `title`: `z.ZodOptional`\<`z.ZodString`\>; \}, `z.core.$strip`\>

Represents a mailing address for customers and shipping.

If you are looking for just a location address, use [LocationAddress](/api-reference/common/variables/locationaddress) instead.

## See

 - [schema.org PostalAddress](https://schema.org/PostalAddress)
 - [Shopify MailingAddress](https://shopify.dev/docs/api/storefront/2025-01/objects/mailingaddress)
