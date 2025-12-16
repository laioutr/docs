---
title: ProductPrices
description: declaration
---

> `const` **ProductPrices**: \{ `~schema`: \{ `isOnSale`: `boolean`; `isStartingFrom`: `boolean`; `price`: \{ `amount`: `number`; `currency`: `string`; \}; `savingsPercent?`: `number`; `strikethroughPrice?`: \{ `amount`: `number`; `currency`: `string`; \}; `unitPrice?`: \{ `price`: \{ `amount`: `number`; `currency`: `string`; \}; `quantity`: \{ `unit`: `MeasurementUnit`; `value`: `number`; \}; `reference`: \{ `unit`: `MeasurementUnit`; `value`: `number`; \}; \}; \}; \}

Represents an aggregate of all prices for a product.

This is a convenience component that aggregates the prices of all variants.

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

\{ `isOnSale`: `boolean`; `isStartingFrom`: `boolean`; `price`: \{ `amount`: `number`; `currency`: `string`; \}; `savingsPercent?`: `number`; `strikethroughPrice?`: \{ `amount`: `number`; `currency`: `string`; \}; `unitPrice?`: \{ `price`: \{ `amount`: `number`; `currency`: `string`; \}; `quantity`: \{ `unit`: `MeasurementUnit`; `value`: `number`; \}; `reference`: \{ `unit`: `MeasurementUnit`; `value`: `number`; \}; \}; \}

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

`~schema.isOnSale`

</td>
<td>

`boolean`

</td>
<td>

&hyphen;

</td>
<td>

If true, indicates that the product is discounted from its original price.
See `strikethroughPrice` for the original price and `savingsPercent` for the percentage of discount.

</td>
</tr>
<tr>
<td>

`~schema.isStartingFrom`

</td>
<td>

`boolean`

</td>
<td>

&hyphen;

</td>
<td>

If true, indicates that there are multiple variants with different prices.

Can be used in the frontend to indicate a starting-from price, e.g. "from 100 EUR".

</td>
</tr>
<tr>
<td>

`~schema.price`

</td>
<td>

\{ `amount`: `number`; `currency`: `string`; \}

</td>
<td>

`Money`

</td>
<td>

Advertised selling price of the product. Generally the lowest price of all variants.

</td>
</tr>
<tr>
<td>

`~schema.price.amount`

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

`~schema.price.currency`

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

`~schema.savingsPercent?`

</td>
<td>

`number`

</td>
<td>

&hyphen;

</td>
<td>

Percentage of discount from the `strikethroughPrice`.

</td>
</tr>
<tr>
<td>

`~schema.strikethroughPrice?`

</td>
<td>

\{ `amount`: `number`; `currency`: `string`; \}

</td>
<td>

&hyphen;

</td>
<td>

Original price of the product, non-discounted price or recommended retail price.
If the product has multiple variants, this is the lowest non-discounted price of all variants.

**See**

https://support.google.com/merchants/answer/9017019?hl=en

</td>
</tr>
<tr>
<td>

`~schema.strikethroughPrice.amount`

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

`~schema.strikethroughPrice.currency`

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

`~schema.unitPrice?`

</td>
<td>

\{ `price`: \{ `amount`: `number`; `currency`: `string`; \}; `quantity`: \{ `unit`: `MeasurementUnit`; `value`: `number`; \}; `reference`: \{ `unit`: `MeasurementUnit`; `value`: `number`; \}; \}

</td>
<td>

&hyphen;

</td>
<td>

Price per unit of the product. E.g. 100 EUR per 100g.

**See**

https://support.google.com/merchants/answer/6324455?hl=en&sjid=12076696190966471938-EU

</td>
</tr>
<tr>
<td>

`~schema.unitPrice.price`

</td>
<td>

\{ `amount`: `number`; `currency`: `string`; \}

</td>
<td>

`Money`

</td>
<td>

Price for the given reference measurement.

</td>
</tr>
<tr>
<td>

`~schema.unitPrice.price.amount`

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

`~schema.unitPrice.price.currency`

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

`~schema.unitPrice.quantity`

</td>
<td>

\{ `unit`: `MeasurementUnit`; `value`: `number`; \}

</td>
<td>

`Measurement`

</td>
<td>

The quantity in the product variant. E.g. a bottle might be 330ml

</td>
</tr>
<tr>
<td>

`~schema.unitPrice.quantity.unit`

</td>
<td>

`MeasurementUnit`

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

`~schema.unitPrice.quantity.value`

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

`~schema.unitPrice.reference`

</td>
<td>

\{ `unit`: `MeasurementUnit`; `value`: `number`; \}

</td>
<td>

`Measurement`

</td>
<td>

The reference quantity for showing the price per unit. E.g. xx EUR / _100ml_

</td>
</tr>
<tr>
<td>

`~schema.unitPrice.reference.unit`

</td>
<td>

`MeasurementUnit`

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

`~schema.unitPrice.reference.value`

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
</tbody>
</table>
