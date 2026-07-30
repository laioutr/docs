---
title: Orchestr Wire Format
description: Detailed technical documentation of Laioutr's Orchestr API wire format and data structures
category: Essentials
order: 4
seo:
  title: Orchestr Wire Format
  description: Detailed technical documentation of Laioutr's Orchestr API wire format and data structures
sitemap:
  loc: /frontend/orchestr/wire-format
  lastmod: 2026-04-08
  changefreq: monthly
  priority: 1.0

---

The wire format is the HTTP protocol between the Orchestr client (running in the browser or during SSR) and the Orchestr server. All query and action traffic flows through two POST endpoints, encoded as [turbo-stream](https://github.com/jacob-ebey/turbo-stream) for streaming.

## Endpoints

| Purpose | Method | Path                                 | Response Content-Type |
| ------- | ------ | ------------------------------------ | --------------------- |
| Queries | POST   | `/api/orchestr/query`                | `text/x-script`       |
| Actions | POST   | `/api/orchestr/action/{actionToken}` | `text/x-script`       |

Both endpoints respond with `Cache-Control: no-cache`.

Orchestr serves a few side endpoints that are plain JSON rather than turbo-stream, because their callers are editor clients and the frontend's own head builder rather than the streaming query client:

| Purpose | Method | Path | Auth |
| ------- | ------ | ---- | ---- |
| [Page enumeration](/frontend/orchestr/page-index#endpoints) | POST | `/api/laioutr/orchestr/page-index/list` | Project secret |
| [Page lookup](/frontend/orchestr/page-index#endpoints) | POST | `/api/laioutr/orchestr/page-index/locate` | Project secret |
| [Page lookup](/frontend/orchestr/page-index#endpoints) | POST | `/api/orchestr/page-index/locate` | None |

They take the same untrusted `clientEnv` payload as the query endpoint and resolve it the same way.

## Query Request

The client sends a `QueryWireRequest` as a JSON POST body. It contains an array of queries, client environment data, and optional dev settings.

```json
{
  "queries": [
    {
      "id": "cp17r0j24ts002324tv1",
      "queryName": "productsByCategory",
      "arguments": { "categoryId": "shoes" },
      "components": ["Base", "Price", "Availability"],
      "links": {
        "Reviews": {
          "components": ["Base"],
          "pagination": { "offset": 0, "limit": 10 }
        },
        "CrossSell": {
          "components": ["Base", "Price"],
          "links": {}
        }
      },
      "filter": { "color": ["red", "blue"], "inStock": true },
      "sort": "price:asc",
      "pagination": { "offset": 0, "limit": 24 }
    }
  ],
  "clientEnv": {
    "marketId": "0190bad70001",
    "languageId": "0190bad70002",
    "locale": "en-US",
    "currency": "EUR",
    "isPreview": false,
    "custom": {}
  },
  "options": {
    "dev": {
      "enableTracing": false,
      "enableSummary": false,
      "disableCaching": false
    }
  }
}
```

`clientEnv` is the **wire** shape — the browser's claim about its environment, not what handlers receive. The server resolves `marketId` and `languageId` against the project's i18n config, verifies `previewToken` if one is present, and hands handlers a `ClientEnv` carrying full `market` and `language` objects. `locale` and `currency` are sent but not read by the server; they are derived from the resolved language and market. See [Client Environment](/frontend/orchestr/client-env) for both shapes and the trust boundary between them.

A [content preview](/frontend/features/content-preview) request adds the token, which is verified and then stripped before any handler runs:

```json
  "clientEnv": {
    "marketId": "0190bad70001",
    "languageId": "0190bad70002",
    "locale": "en-US",
    "currency": "EUR",
    "isPreview": true,
    "previewToken": "pvtk_3Qm…",
    "custom": {}
  }
```

Each query specifies exactly which `components` and `links` it needs. Links are recursive: a link can request its own components, nested links, filter, sort, and pagination. This tree structure lets the client declare its full data requirements in a single request.

Filter values support three shapes: a list of strings (`["red", "blue"]`), a boolean (`true`), or a range object (`{ "min": 10, "max": 50 }`).

## Query Response (Streamed Chunks)

The response is a turbo-stream of `QueryWireResponseChunk` objects. The server pushes chunks as data becomes available, so query results, entities, and link collections arrive incrementally.

Six chunk types exist:

### `queryResult`

The top-level result for a query. Contains entity IDs (not full entities), pagination totals, and available filters/sortings.

```json
{
  "type": "queryResult",
  "id": "cp17r0j24ts002324tv1",
  "status": "ok",
  "entityType": "Product",
  "entityIds": ["0190bad79ec1", "0190bad79ec2"],
  "entityTotal": 73,
  "limit": 24,
  "availableSortings": [
    { "id": "price:asc", "label": "Price ascending" }
  ],
  "availableFilters": [],
  "errors": []
}
```

`availableSortings` and `availableFilters` carry the facet metadata returned by the query handler. See [Filters](/frontend/orchestr/filters) for the full shape of each variant.

### `entity`

A single entity with its resolved components. Entities are deduplicated across queries; the same entity ID appears only once.

```json
{
  "type": "entity",
  "id": "0190bad79ec1",
  "entityType": "Product",
  "components": {
    "Base": {
      "name": "Deko-Figur Dackel Dario",
      "sku": "UGI0075240"
    },
    "Price": {
      "price": 899,
      "priceNet": 840,
      "orgPrice": 1299
    }
  }
}
```

### `linkCollection`

Links between entities (for example, product reviews or cross-sell products).

```json
{
  "type": "linkCollection",
  "linkName": "Reviews",
  "sourceQueryPath": ["cp17r0j24ts002324tv1"],
  "sourceEntityType": "Product",
  "targetEntityType": "ProductReview",
  "links": [
    {
      "sourceId": "0190bad79ec1",
      "targetIds": ["review-1", "review-2"],
      "entityTotal": 250,
      "limit": 10
    }
  ]
}
```

### `error`, `trace`, `executionSummary`

Error chunks carry a path and error details. Trace and summary chunks appear only when `options.dev.enableTracing` or `options.dev.enableSummary` is set in the request.

## Action Requests

Actions use a separate endpoint per action token. The POST body contains the action input (validated against the action's Zod schema) and the client environment.

```json
// POST /api/orchestr/action/addToCart
{
  "input": {
    "productId": "0190bad79ec1",
    "quantity": 1
  },
  "clientEnv": {
    "marketId": "0190bad70001",
    "languageId": "0190bad70002",
    "locale": "en-US",
    "currency": "EUR",
    "isPreview": false
  }
}
```

The response is a turbo-stream encoded value containing the action's return value (or `null` if the action returns `undefined`). Server errors return a standard HTTP error with a JSON body instead of a stream.

## Turbo-Stream Encoding

Both queries and actions use [turbo-stream](https://github.com/jacob-ebey/turbo-stream) for response encoding. Turbo-stream serializes JavaScript values (including `Date`, `Map`, `Set`, `BigInt`, and circular references) into a streamable text format.

On the server, `transformToTurboStream` pipes data through turbo-stream's `encode()`. On the client, `fetchTurboStream` decodes the response with `decode()`.

Query results, entities, and link collections are pushed as they resolve, so the client receives partial data before the full response completes.
