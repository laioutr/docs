---
name: technical-writing-api-reference
description: Use when writing API reference documentation for Laioutr Orchestr actions, queries, REST endpoints, or webhook configurations. Use when documenting parameters, request/response schemas, or error codes.
---

# API Reference Documentation

Write API reference documentation following Stripe-style patterns. Uses Laioutr's existing documentation components for Orchestr actions, queries, and entity schemas.

## When to Use

- Documenting Orchestr actions or queries
- Writing REST API endpoint references
- Documenting webhook payload schemas
- Creating parameter/field documentation for any Laioutr API surface

## When NOT to Use

- Tutorials or how-to guides that happen to involve APIs - use `technical-writing` instead
- UI component documentation - use `technical-writing-ui-components` instead

## Available Components

### Orchestr Actions (auto-generated)

```markdown
::action-meta{:name="AddToCart"}
::
```

Generates complete documentation from the action's TypeScript types: input schema, output schema, description.

### Orchestr Queries (auto-generated)

```markdown
::query-meta{:name="GetProductDetails"}
::
```

Generates complete documentation from the query's TypeScript types.

### Entity Component Schemas (auto-generated)

```markdown
::entity-component-meta{entity="Product" component="ProductCard"}
::
```

Generates schema documentation for entity-component relationships.

### Parameter Tables (manual)

Use `::field-group` with `:::field` for manually documenting parameters:

```markdown
::field-group
  :::field{name="productId" type="string" required}
  The unique identifier of the product to add.
  :::
  :::field{name="quantity" type="number"}
  Number of items to add. Default: `1`.
  :::
  :::field{name="variantId" type="string"}
  Optional variant identifier (e.g., size, color).
  :::
::
```

### Request/Response Examples

Use `::code-group` for showing the same request in multiple formats:

```markdown
::code-group
```bash [curl]
curl -X POST https://api.laioutr.cloud/v1/cart/add \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"productId": "nike-air-max-90", "quantity": 1}'
```
```typescript [TypeScript]
const result = await orchestr.action('addToCart', {
  productId: 'nike-air-max-90',
  quantity: 1,
});
```
::
```

## Structure Template

```markdown
## [Action/Endpoint Name]

Brief description of what this does and when you'd use it.

### Parameters

::field-group
  :::field{name="param" type="string" required}
  Description. Default: `value`.
  :::
::

### Example

::code-group
```bash [curl]
curl -X POST ...
```
```typescript [TypeScript]
const result = await action({...});
```
::

### Response

```json
{
  "status": "success",
  "data": { ... }
}
```

### Errors

| Code | Description | Resolution |
|------|-------------|------------|
| `INVALID_PRODUCT` | Product ID not found | Verify the product exists in your catalog |
| `OUT_OF_STOCK` | Requested quantity unavailable | Check inventory or reduce quantity |
```

## Patterns

### Two-Panel Concept

Stripe's API docs use explanation on the left, code on the right. In Docus, achieve this with prose paragraphs followed by code blocks. Keep explanations short - the code should be self-documenting.

### Error Documentation

Document every error code with:
- The error code/name
- What causes it
- How to resolve it

Developers hit errors at 2am. Make error docs complete.

### Progressive Complexity

Start with the minimal working example. Add optional parameters and advanced usage below, using `::accordion` for less common patterns.

## Common Mistakes

- **Missing error documentation.** Every action/endpoint should document its error cases.
- **Using auto-generated docs alone.** `::action-meta` generates type info but not usage context. Add a brief description and example above it.
- **No curl example.** Not everyone uses TypeScript. Include a curl example for quick testing.
- **Undocumented defaults.** State the default value for every optional parameter.
