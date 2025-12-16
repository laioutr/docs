---
title: ProductVariantShipping
description: declaration
---

> `const` **ProductVariantShipping**: \{ `~schema`: \{ `forecast?`: \{ `cutoffTime?`: \{ `time`: `string`; \}; `maxDays?`: `number`; `minDays?`: `number`; \}; `rate`: \{ `amount`: `number`; `currency`: `string`; \}; `required`: `boolean`; \}; \}

Represents the shipping information for a product variant.

## Type declaration

<table>
<thead>
<tr>
<th>Name</th>
<th>Type</th>
<th>Default value</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>

<a id="schema"></a> `~schema`

</td>
<td>

\{ `forecast?`: \{ `cutoffTime?`: \{ `time`: `string`; \}; `maxDays?`: `number`; `minDays?`: `number`; \}; `rate`: \{ `amount`: `number`; `currency`: `string`; \}; `required`: `boolean`; \}

</td>
<td>

&hyphen;

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

`~schema.forecast?`

</td>
<td>

\{ `cutoffTime?`: \{ `time`: `string`; \}; `maxDays?`: `number`; `minDays?`: `number`; \}

</td>
<td>

&hyphen;

</td>
<td>

Forecasted shipping time. Handling time + transit time.

**See**

https://schema.org/ShippingDeliveryTime

</td>
</tr>
<tr>
<td>

`~schema.forecast.cutoffTime?`

</td>
<td>

\{ `time`: `string`; \}

</td>
<td>

&hyphen;

</td>
<td>

Order cutoff time allows merchants to describe the time after which they will no longer process orders received on that day.

**See**

https://schema.org/cutoffTime

</td>
</tr>
<tr>
<td>

`~schema.forecast.cutoffTime.time`

</td>
<td>

`string`

</td>
<td>

&hyphen;

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

`~schema.forecast.maxDays?`

</td>
<td>

`number`

</td>
<td>

&hyphen;

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

`~schema.forecast.minDays?`

</td>
<td>

`number`

</td>
<td>

&hyphen;

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

`~schema.rate`

</td>
<td>

\{ `amount`: `number`; `currency`: `string`; \}

</td>
<td>

`Money`

</td>
<td>

The shipping cost for the product variant.

</td>
</tr>
<tr>
<td>

`~schema.rate.amount`

</td>
<td>

`number`

</td>
<td>

&hyphen;

</td>
<td>

Amount in smallest unit of currency. E.g. cents, pence, etc.

</td>
</tr>
<tr>
<td>

`~schema.rate.currency`

</td>
<td>

`string`

</td>
<td>

&hyphen;

</td>
<td>

ISO 4217 currency code. E.g. 'USD', 'EUR', 'GBP', etc.

</td>
</tr>
<tr>
<td>

`~schema.required`

</td>
<td>

`boolean`

</td>
<td>

&hyphen;

</td>
<td>

If true, the product variant requires shipping. E.g. it is a physical good.

</td>
</tr>
</tbody>
</table>

## See

 - https://schema.org/OfferShippingDetails
 - https://schema.org/ShippingDeliveryTime
 - https://support.google.com/merchants/answer/14949917?hl=en&sjid=12076696190966471938-EU
