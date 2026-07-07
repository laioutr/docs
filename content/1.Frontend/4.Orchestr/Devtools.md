---
title: Store Devtools
description: Read the live Orchestr client store from the Nuxt DevTools "Orchestr Store" tab — definitions, the execution timeline, live subscriptions, and the entity cache.
seo:
  title: Store Devtools | Laioutr
  description: Read the live Orchestr client store from the Nuxt DevTools "Orchestr Store" tab — definitions, the execution timeline, live subscriptions, and the entity cache.
sitemap:
  loc: /frontend/orchestr/devtools
  lastmod: 2026-07-07
  changefreq: monthly
  priority: 0.7
---

# Store Devtools

The **Orchestr Store** tab in Nuxt DevTools is a window into the live client
store. It shows what the store *knows* (the reflected schema and the cached
entities), what it is *doing* (the execution stream), and *who is watching*
(the live subscriptions) — the three things you need when a query returns the
wrong data, renders stale, or never resolves.

Open DevTools (`Shift + Option + D`) and pick the **Orchestr Store** tab.

## The four views

### Definitions

The schema side of the store, joined with the live cache. Each **entity type**
lists its components and links and — the useful part — its current
**cached-entity count**, so you can see at a glance whether a type the page
needs is actually in the cache. Below the entity types are the registered
**Queries** and **Actions**. Everything is filterable from the toolbar; each
entity card expands to reveal its components and links.

The schema comes from the server over the existing reflection endpoint; the
cached counts come from the live store over the devtools bridge.

### Timeline

The execution stream, newest first. Crucially it **survives navigation**: the
store's event bus is a bounded, per-page ring buffer, so a busy new page would
otherwise evict the very events a navigation-race destroys. The panel keeps a
growing, de-duplicated buffer instead, so the history you are investigating
does not vanish when you move between pages.

Each row is one event, tagged by **kind**:

| Kind             | Meaning                                                                                                             |
| ---------------- | ----------------------------------------------------------------------------------------------------------------- |
| **execute**      | A query execution started — a wave was dispatched for this subscription.                                           |
| **result**       | A query settled successfully. Carries **provenance** (see below), an entity result-count, and the duration.       |
| **error**        | A query settled with an error. Expand the row for the wire request and error payloads.                            |
| **invalidation** | An invalidation selector matched this query or result key and forced it stale — a refetch follows.                 |
| **flush**        | The entity cache flushed a write batch (dev-only). See the flush summary below.                                    |
| **page**         | A page finished rendering. Its subject identity (page type + entity) anchors the executions that produced it.      |

An `SSR` badge marks events replayed from the server-rendered payload — the
navigation-race starts at SSR/hydration, so those rows matter.

#### Provenance — where the data came from

A **result** row's provenance badge is the single most useful signal in the
timeline. It tells you how the store satisfied that subscription:

- **adopted** — served from the cache without going to the network.
- **joined** — attached to an identical request already in flight (the request
  was de-duplicated).
- **fetched** — went over the wire.

A page that feels slow but shows mostly `adopted`/`joined` rows is not
network-bound; a page that re-`fetched` something it should have `adopted`
points at a cache-key or invalidation problem.

#### Cache flush summary

A **flush** row summarises one entity-cache write batch:

- **entitiesWritten** — records that actually landed.
- **dedupSkips** — writes skipped because the value was unchanged.
- **layersPopped** — optimistic layers released as the batch settled.

### Subscriptions

The live subscriptions the store is currently serving — the owner, the result
keys, the subscriber refcount, and the current provenance of each. This is the
view for "why is this component still loading" or "why does this subscription
have three subscribers": it reflects the store's real subscription bookkeeping,
not a reconstruction.

### Cache

Every cached entity, grouped by type. Expand an entity to see its component
**values** (already downgraded to plain data — dates as ISO strings, maps as
entries) and its per-component **state** (`pending` / `absent` / `error`). Use
it to confirm a component you expected was actually resolved, and to inspect
exactly what shape reached the client.

## Cache bypass — the bisect lever

The **Cache bypass** toggle in the toolbar is a dev-only debugging switch. While
it is on, every execution goes straight to transport: no cache adoption and no
in-flight join. It is the fastest way to answer "is this a cache bug or a data
bug" — if the wrong data disappears with bypass on, the cache is at fault; if it
persists, the problem is upstream.

Bypass is a *separate* switch, not a change to a query's normal `force` refresh —
turning it off restores adoption and joining exactly as before.

::note
The Store Devtools tab is available only in development. None of the
observation machinery — snapshots, the SSR event rider, the bridge — ships in a
production build.
::
