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

## Why

Old URLs are indexed by search engines but are no longer prerendered. Without an alias they 404, and resolving them at runtime would invoke a serverless function per request. Build-time `routeRules` handle the redirect at the edge with no function cost.
