---
title: Content Collections
description: How a storefront declares the entity types the Laioutr CMS manages, how an app offers its own types to it, and how entries reach Orchestr, previews and sitemaps.
seo:
  title: Content Collections | Laioutr
  description: How a storefront declares the entity types the Laioutr CMS manages, how an app offers its own types to it, and how entries reach Orchestr, previews and sitemaps.
sitemap:
  loc: /apps/app-development/content-collections
  lastmod: 2026-09-27
  changefreq: monthly
  priority: 1
---

## What the CMS serves

The Laioutr CMS stores **entries** of entity types your storefront already knows — a `BlogPost`, a `Recipe`, an `Author`. Editors create, translate and publish them in Cockpit, under [Content](/cockpit/features/content-collections). The storefront reads them through `@laioutr-app/cms`, which fetches them from the Laioutr content delivery API (cms-api) and answers Orchestr like any other connector.

For every type you declare, `@laioutr-app/cms` registers:

- a **query handler** for each query token of the type it can answer (see [Token files](#token-files-for-your-own-types));
- a **component resolver** for the type's components;
- a **link handler** for each link token between two declared types;
- a **page index** for each page type that gives an entry its own URL.

The CMS defines no tokens of its own. It answers the tokens that already exist for the type, so a section built for canonical `BlogPost` data works with CMS entries unchanged.

A visitor sees **published** entries. A request in [content preview](/frontend/features/content-preview) sees the **drafts** instead: what Cockpit last saved, unpublished changes included.

The query handlers, resolvers and link handlers are not cached. Every read reaches cms-api, so a publish is visible on the next request. A route rule of your own that caches pages (`isr`, `swr`, `cache`) delays a publish by that rule, as it does for every connector.

## Declaring collections

A project lists the types the CMS manages in the `collections` option of `@laioutr-app/cms`. Nothing listed means nothing served: installing the app, or an app that offers types, adds no collection by itself.

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  '@laioutr-app/cms': {
    collections: [
      // Offered by an installed app: named by its entity type.
      'BlogPost',
      'Recipe',
      // A type of the project's own, defined in a token file.
      { entityType: 'Author', tokens: './cms/author.tokens' },
    ],
  },
});
```

A hosted project carries the same list in the app's config in `laioutrrc.json`:

```json [laioutrrc.json]
{
  "apps": [
    {
      "name": "@laioutr-app/cms",
      "version": "latest",
      "config": { "collections": ["BlogPost", "Recipe"] }
    }
  ]
}
```

The list is read when the storefront is built, so a change takes effect with the next deploy.

**A name is an entity type.** `'BlogPost'` is the `entityType` its component tokens are defined with, and it is the name Cockpit lists. A name is served when an installed app [offers](#offering-types-from-an-app) that type. Entries are stored by entity type and component name, so replacing a token file with an app's offer of the same type, or the other way round, keeps every entry.

**The object form** names a token file, or adjusts a type:

| Field | Meaning |
| --- | --- |
| `entityType` | The entity type. Required. |
| `tokens` | A module that defines the type, or adds tokens to an offered one. A relative path, or a package specifier that resolves from the project root. |
| `slug` | Where an entry's slug lives, as `component.field`, or `false` for a type without one. |
| `requiredComponents` | The components an entry must have before it can be published. Only for a type no app offers — see [Mandatory components](#mandatory-components). |

When `slug` is left out, it is `base.slug` for a type from a token file, the offer's `slug` (else `base.slug`) for a type an app offers from a token module, and `base.slug` for a type from a manifest when its `base` component has a string `slug` field. A type without a slug gets no by-slug query and no page.

A hosted project has no local files, so a relative `tokens` path does not resolve there. Publish the token file in a package and name it by its specifier.

### When the list is wrong

Nothing in the option fails the build. Each problem costs the entry it is in, and the build logs one warning that lists them all under `[@laioutr-app/cms] … note(s) on the content collections`:

- an entry that is neither a name nor an object, or has a malformed field;
- a name no installed app offers, with no `tokens`;
- a `tokens` path that does not resolve;
- a type listed twice with different settings, which keeps the first.

`nuxt.config.ts` and `laioutrrc.json` can both hold `collections`, and Nuxt concatenates the two lists when it merges the module's options. An identical duplicate is dropped silently. A type listed in both with different settings keeps only one of them, and which one depends on how the app is installed, so keep each type in one place.

### What Cockpit shows

Cockpit reads the list from the storefront deployed on the project's **main** environment. A type appears there once that deploy declares it.

A type that has stored entries and is no longer declared stays listed, marked **Not declared**, so its entries stay reachable. Its entries cannot be created, edited or published until a deploy declares the type again. When the main environment cannot be reached, Cockpit says so and lists the types as that storefront last declared them. If Cockpit has never read that storefront's declaration, it lists only the types that already have entries.

## Offering types from an app

An app that defines entity types can let projects store them in the CMS. It adds a `cmsOffers` list to the app definition it registers with `@laioutr-core/kit`, in its module setup:

```ts [src/module.ts]
import { createResolver, defineNuxtModule } from '@nuxt/kit';
import { registerLaioutrApp } from '@laioutr-core/kit';
import { name, version } from '../package.json';

export default defineNuxtModule({
  meta: { name, version, configKey: name },
  async setup() {
    const { resolve } = createResolver(import.meta.url);

    await registerLaioutrApp({
      name,
      version,
      orchestrDirs: [resolve('./runtime/server/orchestr')],
      cmsOffers: [
        {
          entityType: 'Recipe',
          tokens: resolve('./runtime/cms/recipe.tokens'),
          slug: 'base.slug',
          requiredComponents: ['base'],
        },
      ],
    });
  },
});
```

An offer (`CmsContentOffer`) takes one of two shapes:

| Shape | Fields |
| --- | --- |
| A token module | `entityType`; `tokens`, an absolute path the app resolves or a package specifier that resolves from the project root; optionally `slug` (`component.field` or `false`, default `base.slug`) and `requiredComponents`. |
| A token manifest | `package`, and `manifest`, the absolute path of a manifest in the format `@laioutr-core/canonical-types` publishes under `./reflection`. It offers every entity type the manifest lists. |

The offer carries the paths, so a project that names `Recipe` needs no file of its own, hosted projects included. A project then writes only the name:

```ts
'@laioutr-app/cms': { collections: ['Recipe'] },
```

Rules an offering app should know:

- **Register offers in module setup.** The CMS reads them once every module is set up. An offer registered later is not seen.
- **The token module is imported twice** — into the server bundle, and into the Vue app so that its page types reach the link resolver and Studio. It must load in both.
- **One offer per type.** When two apps offer the same type, the first to register wins and the build warning names both.
- **An offer serves nothing by itself.** Installing the app changes nothing until a project names the type.

A project can still name a token file for an offered type. It then **extends** the offer: its components, queries and links are served next to the offered ones.

### Canonical types

`@laioutr-core/frontend-core` offers the [canonical entity types](/frontend/api-reference/entities) of `@laioutr-core/canonical-types` from that package's manifest, when the package resolves from the project root. A project names them like any other offered type — `'BlogPost'`, `'BlogCollection'`, `'Product'` — and the canonical queries and page types, such as `blog/post/by-slug` and `blog/post-single`, answer from CMS entries.

A manifest is read at build time, so the build already knows which of its tokens the CMS cannot serve. Those appear in Cockpit on the type's entry list, under **Not served by the CMS**, with the reason. For a token module the same check runs when the server starts, and its result goes to the server log only.

## Mandatory components

Every component of an entry may be absent. The resolver serves the entity without it, and Orchestr requires none. That breaks a page whose sections read a component without checking for it, so the type's author can mark components as mandatory.

`requiredComponents` names them, by component name:

- **On an offer.** The offering app decides, because its sections are what break.
- **On a project collection entry,** only for a type no app offers. On an offered type it is ignored, and the build warns.

Cockpit refuses to publish an entry that lacks a mandatory component in any served locale, after that locale's fallbacks. The form marks the component as required and offers no way to remove it.

A canonical type requires `base` when it has one, unless the table below lists it; a listed type requires exactly its list:

| Type | Mandatory components |
| --- | --- |
| `BlogPost` | `base`, `excerpt`, `content` |
| `Glossary` | `base`, `content` |
| `Product` | `base`, `info`, `prices`, `media` |
| `ProductVariant` | `availability` |

A name that matches no component of the type is not enforced: the build or the server start logs it, and Cockpit leaves it out of what it checks.

## Token files for your own types

A token file defines a type no app offers. It exports the type's tokens — components, and optionally queries, links and page types. Only the exported tokens count.

```ts [cms/author.tokens.ts]
import { z } from 'zod/v4';
import { definePageTypeToken } from '@laioutr-core/core-types/frontend';
import { defineEntityComponentToken, defineQueryToken } from '@laioutr-core/core-types/orchestr';

export const AuthorBase = defineEntityComponentToken('base', {
  entityType: 'Author',
  schema: z.object({
    name: z.string(),
    slug: z.string(),
    email: z.string().meta({ cms: { localized: false } }),
    bornOn: z.date().optional(),
  }),
});

export const AllAuthorsQuery = defineQueryToken('acme/author/all', {
  entity: 'Author',
  type: 'multi',
  label: 'All authors',
  input: z.object({}),
  defaultLimit: 12,
});

export const AuthorBySlugQuery = defineQueryToken('acme/author/by-slug', {
  entity: 'Author',
  type: 'single',
  label: 'Author by slug',
  input: z.object({ slug: z.string() }),
});

export const AuthorPage = definePageTypeToken('acme/author-page', {
  kind: 'dynamic',
  studio: { label: 'Author', group: 'Authors' },
  requiredQueries: [
    {
      alias: 'author',
      entityType: 'Author',
      single: true,
      default: {
        label: 'Author',
        token: AuthorBySlugQuery,
        inputRules: { slug: { var: 'route.params.slug' } },
      },
    },
  ],
  pathConstraints: { requiredParams: ['slug'], default: '/authors/:slug' },
  resolveFor: [{ referenceType: 'Author' }],
});
```

### Components

Each component schema is a `z.object` with named fields, even when the value is a shared type such as `HtmlFragment`: name it under a key (`z.object({ bio: HtmlFragment })`). That keeps every component's shape the same kind of thing, and lets you add a field next to it later without changing the shared type. Cockpit builds the entry form from the component schemas of the deployed storefront, and publishes only an entry that passes them.

**Localization is decided per field.** By default a string is translated per locale, unless it carries an enum, a constant or a format such as a date. Rich text, media and links are translated too. Numbers, booleans, enums and dates are one value for every locale. Override the default on a field with `.meta({ cms: { localized: boolean } })`, as `email` does above. A value is read along the language's fallback chain, as the project's language configuration defines it.

**Dates:** a `z.date()` field is stored as an ISO 8601 timestamp in UTC and reaches your component as a `Date`. The editor enters it in the browser's time zone.

**Empty values:** a field that is `.nullable()` but not `.optional()` arrives as `null` when the entry leaves it blank.

**A component that fails its schema** costs the entry, not the list. The resolver skips the entry with a warning naming its id and the component; the entry's id stays in the query result, so the section receives an entity without data. Published entries passed the same schema when they were published, so this mostly concerns drafts in preview and a schema that changed after a publish.

### Queries

The CMS answers a query token of the type when its input is one of two shapes:

| Input | `multi` token | `single` token |
| --- | --- | --- |
| empty (`z.object({})`, or no input) | every entry, most recently created first, paged with offset and limit | the most recently created entry, or an error when none exists |
| exactly `{ slug }` | a list of the one entry with that slug, or an empty list | the entry with that slug, or an error when none exists |

A page of a `multi` query holds the limit the request asks for, else the token's `defaultLimit`, else 24. cms-api serves 1 to 100 entries per request: a larger or smaller limit is answered with the nearest of the two, and the server warns.

A query with any other input — a search term, a category — is **skipped**, and so is a `{ slug }` query of a type without a slug. A skip never fails the build or the server start: the type is served without that query, and the reason is logged (and, for a manifest offer, listed in Cockpit).

### What stops a type from being served

- A token file that exports no component of its `entityType` serves nothing, with a warning at server start.
- A component the server bundle does not register is dropped with a warning.
- A token module that throws while it is read, or a collection whose handlers cannot be registered, **stops the server from starting**, with an error that names the entity type and the module. A storefront that silently serves without one of its content types would be worse.

## Links

A relation between two entries is a [link token](/frontend/orchestr/queries#links). **A link is served by the collection of its source type**, and only when it is exported from a token module of that collection: the source type's offer, or a token file the project names for it. A link token in another collection's file is ignored.

For a `Recipe` → `Author` link, where `Recipe` is offered by an app and `Author` comes from the project's own file, the project adds a token file for `Recipe`. It extends the offer:

```ts [nuxt.config.ts]
'@laioutr-app/cms': {
  collections: [
    { entityType: 'Recipe', tokens: './cms/recipe.tokens' },
    { entityType: 'Author', tokens: './cms/author.tokens' },
  ],
},
```

```ts [cms/recipe.tokens.ts]
import { defineLinkToken } from '@laioutr-core/core-types/orchestr';

export const RecipeAuthorLink = defineLinkToken('acme/recipe/author', {
  label: 'Recipe author',
  source: 'Recipe',
  target: 'Author',
  type: 'single',
});
```

Component data holds no references; a link relates two whole entries. A reference inside a component value — a list of items that each hold an entry and a caption — is not a link. Model the item as its own type, with a link to it.

- **Both ends must be declared collections.** A link whose target is not a collection of the project — another app's type, or a type not in `collections` — is skipped, and Cockpit does not offer it for editing.
- A `single` link answers one target, and leaves a source without one out of its answer.
- A `multi` link keeps the order the editor gave it and pages per source. Without pagination it answers at most `defaultLimit` targets per source, and never more than 100.
- A visitor sees a link only to an entry that is published. A link to a target published later appears then, with no second publish of the source.
- **A deleted target** is allowed. Cockpit's confirmation says how many entries link to it. The link disappears from delivery at once, and the source's editor shows the item as **Deleted entry**, for an editor to remove.

## Page types and the sitemap

An entry gets its own URL through a [page type](/frontend/features/pagetypes). The CMS serves a page index for a page type about one of its types when:

- the page type's only route param is `slug` (`pathConstraints.requiredParams: ['slug']`), and
- one of its `requiredQueries` is a served by-slug query of the type.

`AuthorPage` above qualifies, and so does canonical `blog/post-single` for a CMS `BlogPost`. A page type about the type that does not qualify is skipped as not indexable. A page at a fixed path, such as a blog listing, needs no index and works as soon as its query is served. Name the type in `resolveFor` so that a [link](/frontend/api-reference/common-types/link) of type `reference` to an entry resolves to its page.

The [page index](/frontend/orchestr/page-index) lists every **published** entry that has a slug in the request's locale chain, ordered by slug. Each item carries the entry's `base.title` (else `base.name`) as its title and its publish date as `lastModified`. An entry without a slug has no page. A slug longer than 1,024 characters is left out, and a slug two entries share is listed once, for the entry that URL shows.

The index is cached for 60 seconds, so a publish reaches Studio's page picker and the locale switcher within a minute. [`listPagesFrom`](/frontend/orchestr/page-index#resuming-a-walk-across-requests), which sitemaps read, uses no cache.

**The sitemap.** The sitemap module of the SEO essentials app, `@laioutr/app-essentials-seo` (see [SEO](/apps/essentials/seo)), reads these indexes. It builds one child sitemap per CMS page type and locale, with one URL per published entry and `<lastmod>` set to the entry's publish date. It keeps its sitemap for a while before it rebuilds it, so an **unpublished entry can stay in the sitemap for up to about a day**. The page itself is gone at once.

**Translated slugs.** When the CMS answers "which entry is this URL", it also reports the entry's slug in every language a domain serves. The hreflang alternates and the locale switcher of an entry's page therefore link each language's own slug, and leave out a language in which the entry has no slug. A project serving more than 50 languages, or a language with more than 9 fallback languages, gets a server warning and the current slug in every language instead.

A `Link` of type `reference` stores the target's slug. When an editor changes an entry's slug, existing reference links keep the old one and lead nowhere until they are picked again.

## Preview

In [content preview](/frontend/features/content-preview) — any storefront URL with `?preview_token=<the project's token>`, or Studio's preview toggle — every CMS query, resolver and link handler reads the **draft** of each entry instead of its published version. That covers entries never published and changes not yet published, as Cockpit last saved them, on any storefront the token opens, `localhost` included.

```
http://localhost:3000/authors/jane-doe?preview_token=pvtk_…
```

The page index is the exception: it lists published entries only, in preview too, so Studio's page picker and the sitemap never show a draft.

Drafts are not validated before they are saved, so a draft may fail its schema. It is then skipped as described under [Components](#components), and a list in preview can be one entry short.

## Delivery API and credentials

| Module option | Default | |
| --- | --- | --- |
| `cmsApiUrl` | `https://api.laioutr.cloud/cms/v1` | Where entries are read. Server-only. |
| `cdnApiUrl` | `https://api.laioutr.cloud/cdn/v1` | Where media is managed. Server-only. |
| `maxFileSize` | 100 MB | The upload size the media picker allows before sending. cdn-api checks it again. |
| `collections` | none | See [Declaring collections](#declaring-collections). |

**The credential is not an option.** Content and media share the project's cdn key. Cockpit issues it when it sets up the project's Laioutr CDN, which also installs `@laioutr-app/cms`, and writes it into `laioutrrc.json` as `config.cdn`. It is read into private runtime config and never reaches the browser. Without it the module still builds, but every cms-api request is refused.

**When cms-api does not answer.** Each request waits at most five seconds. A query that fails throws, and Orchestr turns that into an error for the section that asked, which shows its error state; the rest of the page renders. The server logs a warning that names the query, link or type and what failed. Entries are fetched in batches of up to 100, and a batch that fails costs only its own entries.

## Limits

These are enforced by Cockpit, per entry and per project.

| Limit | Value | What happens | What to do |
| --- | --- | --- | --- |
| Recommended entry size | 200 KB | The entry shows a warning that it loads and publishes more slowly. It stays editable and publishable. | Shrink it: put long lists in their own entries and link them, and use media instead of inline data. |
| Entry size | 1 MB | The entry turns read-only. Once it is closed, it cannot be opened again: Cockpit shows "The entry could not be opened for editing." Its published version, if it has one, keeps being served. | Keep entries well below 200 KB. An entry already above 1 MB can be deleted from the entries list. To recover its content, contact Laioutr support. |
| Entries open for editing, together | 2 MB | The open entries' forms turn read-only, with a message to close other entries. Opening a further entry past the limit is refused: "The entry could not be opened for editing." | Close entries you are not editing. |
| All entries held for editing, open or recently closed | 5 MB | Cockpit refuses to open another entry: "The entry could not be opened for editing." A closed entry is released about three minutes after its last tab left it. After a tab crashed or lost its connection, this takes up to 15 minutes. | Wait a few minutes, then try again. If a tab crashed, allow up to 15 minutes. |
| Editor tabs per project | 12 | A further tab that opens an entry says that the project has 12 editor tabs open, and stays read-only. It offers to try again. | Close editor tabs. A tab on a list with no entry open gives its place up after three minutes. |

An entry's size is measured on what Cockpit stores: every locale of every field, plus its links.

## Related

- [Content in Cockpit](/cockpit/features/content-collections) — the editor's side of the same feature
- [Content preview](/frontend/features/content-preview)
- [Page index](/frontend/orchestr/page-index)
- [Page types](/frontend/features/pagetypes)
- [Queries and links](/frontend/orchestr/queries)
