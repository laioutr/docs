---
title: Orchestr Wire Format
description: Detailed technical documentation of Laioutr's Orchestr API wire format and data structures
category: Essentials
order: 4
---

::caution
This document is outdated and will be updated soon.
::

Orchestr is laioutrs API layer which is used to provide **queries** and **mutations**. This document describes the query-part of the api.

## Key Concepts

At the core of the query-system are **entities**, which can represent various elements within an online shop, such as products, categories or users. Each entity is an object, defined by:

- An **id**: A string for referencing to this entity in external systems.
- A **type**: A string representing the kind of entity (e.g., "Product" or "Category")
- An array of **components**: Each component contains specific, modular data related to the entity, such as base product information, pricing, media, etc.
- An array of **linked entities**: Entities which are in relation with this entity. For example an entity of type "Product" may have a list of linked "Product Reviews".

### Canonical and Non-Canonical Entities

Orchestr provides a set of **canonical entities**, which are entities with a set of predefined **canoncial components**. These canonical entities streamline development by offering a standard structure for commonly used entity types like products. However, developers are also free to attach **non-canonical components** to these entities or providing custom **non-canonical entites**, enabling further customization and extensibility of the data model.

### Flexible API Query System

Orchestr's API allows developers to query for entities using a highly flexible structure. Developers can specify not only the entity types they want to retrieve but also the exact components they need for each entity type. This reduces over-fetching and improves performance, as only relevant data is returned.

## Implementation Details

### Entity Component Token

```ts
// EntityComponentToken
export default defineEntityComponentToken('LtrBase', {
  entityType: 'LtrProduct',
  // Has to be a zod-schema so we have type-safety in query-resolvers and are able to generate a typescript-type in the build-process.
  // Also ideal for reflections in the studio.
  schema: z.object({
    name: z.string(),
    sku: z.string(),
  }),
});
```

### Query Handler Definition

```ts
// QueryHandlerDefinition
export default defineQueryHandler({
  label: 'Shopware PLP',
  query: 'ltrProductsByCategory',
  arguments: {
    // LaioutrFieldsetDefinition
  },
});
```

### Component Resolver

```ts
// ComponentResolver
{
  "label": "Shopware Product Connector",
  "entityType": "LtrProduct",
  "provides": ["LtrBase", "LtrAvailability", "LtrPrice"]
}

// other ComponentResolver
import LtrRating from "../components/LtrRating";

export default defineComponentResolver({
  label: "reviews.io Product Rating Connector",
  entityType: "LtrProduct",
  provides: [LtrRating],
  resolve: async ({ entityId, requestedComponents, arguments, context }) => {
    // ...
  }
});
```

### Link Handler

```ts
// LinkHandler
export default defineLinkHandler({
  label: 'Prudsys Product Recommendation Connector',
  linkName: 'LtrCrossAlsoBought',
  sourceEntityType: 'LtrProduct',
  targetEntityType: 'LtrProduct',
  arguments: {
    // LaioutrFieldsetDefinition
  },
});

// other LinkHandler
export default defineLinkHandler({
  label: 'reviews.io Product Review Connector',
  linkName: 'LtrReviews',
  sourceEntityType: 'LtrProduct',
  targetEntityType: 'LtrProductReview',
  arguments: {
    // LaioutrFieldsetDefinition
  },
});
```

## Type Graph

This is the internal reflection api which is used to fetch the type-graph. It is also used by the studio to render the fieldset for the query.

```json
// (Orchestr)QueryTypeGraph
{
  "query": "ltrProductsByCategory",
  "label": "Shopware PLP",
  "arguments": {
    // LaioutrFieldsetDefinition
    // Must include complete fieldset-definition as this will also be used in studio to render the fieldset
  },
  "entities": {
    "LtrProduct": {
      "components": ["LtrBase", "LtrAvailability", "LtrPrice", "LtrRating"],
      "links": {
        "LtrReviews": {
          "entity": "LtrProductReview"
        },
        "LtrCrossAlsoBought": {
          "entity": "LtrProduct"
        },
        "LtrCrossSimilar": {
          "entity": "LtrProduct"
        }
      }
    },
    "LtrProductReview": {
      "components": ["LtrBase"]
    }
  }
}
```

## Block Definition

```json
// (Laioutr)BlockDefinition
{
  "label": "Product Details",
  "component": "Laioutr Product Details",
  "schema": [
    {
      "label": "Product Data",
      "fields": [
        {
          "label": "Source",
          "type": "query",
          "name": "products",
          "entityType": "LtrProduct",
          // The block has to define what it needs from the entity
          "fetch": [
            "LtrBase",
            "LtrAvailability",
            "LtrPrice",
            "LtrRating",
            ["LtrReviews", { "fetch": ["LtrBase"] }],
            ["LtrCrossAlsoBought", { "fetch": ["LtrBase", "LtrPrice"] }],
            ["LtrCrossSimilar", { "fetch": ["LtrBase"] }]
          ]
        }
      ]
    }
  ]
}
```

## Configuration

A RcQuery is the configuration of a single query in the laioutrrc.json. The block-configuration itself only contains a link to the RcQuery via its id.

```json
// (Orchestr)RcQuery
[
  {
    "id": "cp17r0j24ts002324tv1",
    "urlAlias": "_",
    "queryName": "ltrProductsByCategory",
    "arguments": {
      "categoryId": {
        "type": "LtrShopwareSeoResolver",
        "arguments": {
          "prefix": "c/"
        }
      }
    },
    "fetchConfiguration": {
      "LtrReviews": {
        "urlAlias": "reviews",
        "pagination": {
          "offset": 0,
          "limit": 10
        }
      }
    }
  }
]
```

## URL Structure

URL Alias will be used to prefix filter, sorting and pagination query-params. Also works for linked queries like reviews for products here:

```ts
// PLP, filter, sorting and pagination
// https://demo.laioutr.com/c/deko-wohnen?_[filter][color]=123&_[sort]=popularity:desc&_[p]=1

// NestedSearchParams
=> {
    "_": {
        "filter": {
            "color": 123
        },
        "sort": "popularity:desc",
        "p": 1
    }
}

// PDP, page 2 of reviews (linked query)
// https://demo.laioutr.com/p/deko-figur-dackel-dario?_[0190bad79ec17d60a77caa86beaf7e04][reviews][p]=2
```

## Wire Request Format

```ts
type QueryWireRequestQuery = {
  id: RcQuery['id'];
  queryName: RcQuery['queryName'];
  arguments: ResolveRcQueryArguments<RcQuery['arguments']>;

  sort: UrlQueryArguments['sort'];
  pagination: UrlQueryArguments['pagination'];
  filter: UrlQueryArguments['filter'];

  components: LaioutrFieldDefinitionQuery['components'];
  links: LaioutrFieldDefinitionQuery['links'];
};
```

## Wire Response Format

```json
// (Orchestr)QueryWireResponse
{
  "results": {
    "ltrProductsByCategory:cp17r0j24ts002324tv1": {
      "type": "EntityCollection",
      "status": "ok",
      "errors": [
        {
          "message": "Not found",
          "code": "EENTITYNOTFOUND",
          "path": null
        }
      ],
      "urlAlias": "_",
      "urlSearchParam": "_",
      "entityTotal": 73,
      "availableSortings": [
        "popularity:asc",
        "price:asc",
        "price:desc",
        "releaseDate:desc",
        "properties.storageSpace:desc",
        "properties.storageSpace:asc"
      ],
      "availableFilters": [],
      "entities": ["LtrProduct:0190bad79ec17d60a77caa86beaf7e04"]
    }
  },
  "entities": {
    "LtrProduct:0190bad79ec17d60a77caa86beaf7e04": {
      "uri": "LtrProduct:0190bad79ec17d60a77caa86beaf7e04",
      "id": "0190bad79ec17d60a77caa86beaf7e04",
      "type": "LtrProduct",
      "components": {
        "LtrBase": {
          "name": "Deko-Figur Dackel Dario, magnetisch",
          "sku": "UGI0075240"
        },
        "LtrAvailability": {
          "stock": 10,
          "deliveryTime": {
            "min": 1,
            "max": 3,
            "unit": "days",
            "label": "1 - 3 Tage"
          }
        },
        "LtrPrice": {
          "price": 899,
          "priceNet": 840,
          "orgPrice": 1299,
          "orgPriceNet": 1214
        },
        "LtrRating": {
          "value": 4,
          "count": 250
        }
      }
    }
  }
}
```

## Client-Side Data Structure

```json
// Returned in typescript when using the data for the query `ltrProductsByCategory`
// EntityCollections are marked as loading if not all components or linked queries have been fully loaded.

// OrchestrEntityCollection / OrchestrEntityCollectionLoading? / OrchestrLazyQueryResponse
{
  "type": "EntityCollection",
  "status": "ok",
  "isLoading": true,
  "errors": [],
  "urlAlias": "_",
  "urlSearchParam": "_",
  "pagination": {},
  "entities": [
    {
      "uri": "LtrProduct:0190bad79ec17d60a77caa86beaf7e04",
      "id": "0190bad79ec17d60a77caa86beaf7e04",
      "type": "LtrProduct",
      "components": {
        "LtrBase": {
          "isLoading": false,
          "name": "Deko-Figur Dackel Dario, magnetisch",
          "sku": "UGI0075240"
        },
        "LtrAvailability": {
          "isLoading": true
        }
      }
    }
  ]
}
```

## Future Improvements

- Pagination
- Sorting
- Params from URL
- Filtering
- Context CustomerSegment
- Client-Caching Strategy
- Server-Caching Strategy
- Explorer
- Translation Manager
- LTR-Support
- Mutations
- Client sending the server which entities it knows about using short bitmask ids

## Caching Strategies

### Client-Side Bitset Caching

There is room for improvement in the following scenario:

```json
{
  "nonce": "asd",
  "entities": "34Ad221=="
}
```

A possible solution might be the assigning of short-ids to the entities themselves. See [Composite Map Keys in JavaScript with Bitsets](https://justinfagnani.com/2024/11/09/composite-map-keys-in-javascript-with-bitsets/).

### Client-Side Cache-ID Caching

Every time the server sends entities to the client, the server will store the `sha256(sort(unique(componentUris)))` in the `loadedEntitiesCacheId` field which will be sent to the client. The server uses this cache-id to set a key in the kv-storage, where the value is the original `sort(unique(componentUris))`. Now when the client makes a new request we can use those `componentUris` to only send the client the entities/components it doesn't know about.
