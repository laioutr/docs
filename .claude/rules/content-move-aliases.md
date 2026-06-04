# Aliases When Moving Content

When you move or rename a markdown file under `content/` (which changes its URL), add the **old** URL(s) to the page's `aliases:` frontmatter so the old links keep working.

```yaml
---
title: Input Radio
sitemap:
  loc: /laioutr-ui/ui-kit/form/input-radio   # new canonical path
aliases:
  - /laioutr-ui/ui-kit/form/radioselect       # old path → 301 to loc
---
```

`app/lib/alias-redirects.ts` reads these at build time and emits a `routeRules` 301 from each alias to the page's `sitemap.loc`. The page must have a `sitemap.loc` for the redirect to be generated.

## Check the alias path is not a live page first

Before adding an alias, verify the path is not already a real, accessible page — it must not match another page's `sitemap.loc`, and must not already be claimed as an alias elsewhere.

`alias-redirects.ts` only guards `alias === to` (a page aliasing its own canonical path). It does **not** guard an alias that collides with a *different* page's canonical path. If you add an alias that equals another page's `sitemap.loc`, the alias 301 wins and that page becomes completely unreachable.

This actually happened: an alias on `media-preview.md` pointed at `/laioutr-ui/ui-kit/general/media`, which is `Media.md`'s `sitemap.loc`. Every request to `/media` 301-redirected to `/media-preview`, so `Media.md` could no longer be opened, and the alias had to be removed.

Only add aliases for URLs that genuinely no longer resolve to a page (old paths after a move or rename). Before adding `/some/path`, grep the content tree for any page whose `sitemap.loc` or existing `aliases:` is `/some/path`; if one exists, do not add the alias.

## Why

Old URLs are indexed by search engines but are no longer prerendered. Without an alias they 404, and resolving them at runtime would invoke a serverless function per request. Build-time `routeRules` handle the redirect at the edge with no function cost.
