---
title: Link Checker
description: Automatically scan your Laioutr frontend for broken links, SEO issues, and accessibility problems during development and build time. Find and fix link issues before they reach production.
---

## What is Link Checker?

**Link Checker** is a development and build-time tool that scans your site for broken links, SEO issues, and accessibility problems. It runs **13 inspections** covering common link errors like:

- **404 errors** – Links pointing to non-existent pages
- **Missing anchors** – Links to `#fragment` that don't exist on the page
- **URL best practice violations** – Whitespaces, non-ASCII characters, uppercase letters, non-root relative URLs, and more
- **Accessibility issues** – Missing alt text, improper link text, and other accessibility concerns

By keeping your links in check, you ensure that your site is discoverable and accessible to search engine crawlers and your users. Broken links can hurt SEO, frustrate users, and waste crawl budget.

Laioutr can use **[Nuxt Link Checker](https://nuxtseo.com/docs/link-checker/getting-started/introduction)** (part of Nuxt SEO) to automatically scan links during development and build time. Unlike robots.txt (which is included by default), **Link Checker is optional** and needs to be added to your project.

## How it works

Nuxt Link Checker scans your site's links during:

- **Development** – Live inspections appear in your Nuxt app as you navigate
- **Build time** – Generates reports (HTML, Markdown) of all link issues found

The module checks:

- **Internal links** – Links within your site (e.g. `/products/laptop`, `/categories/electronics`)
- **External links** – Links to other domains (validates they're reachable)
- **Anchor links** – Links to page fragments (e.g. `#section`, `#faq`)
- **Link attributes** – Missing `rel`, improper `target`, accessibility issues

You can see issues **live in your Nuxt app** and **magically fix them** using Nuxt DevTools integration, or review build-time reports.

## Installation

To enable link checking, add **@nuxtjs/link-checker** to your Nuxt modules:

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: [
    '@laioutr-core/frontend-core',
    '@nuxtjs/link-checker', // Add this
    // ... other modules
  ],
});
```

Then install the package:

```bash
pnpm add @nuxtjs/link-checker
# or
npm install @nuxtjs/link-checker
```

## Basic configuration

The module works with minimal configuration. You can customize it in `nuxt.config.ts`:

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  linkChecker: {
    // Enable in development (default: true)
    dev: true,
    // Enable in production build (default: false)
    build: false,
    // Fail build on errors (default: false)
    failOnError: false,
    // Exclude specific paths from checking
    exclude: ['/checkout/**', '/api/**'],
  },
});
```

### Development mode

In **development**, the module shows link issues **live in your Nuxt app**:

- **Visual indicators** – Broken links are highlighted or marked
- **Nuxt DevTools integration** – View all issues in DevTools and fix them automatically
- **Console warnings** – Link issues are logged to the console

This helps you catch and fix link problems as you develop.

### Build-time reports

During **build**, the module generates reports of all link issues:

- **HTML report** – Visual report you can open in a browser
- **Markdown report** – Text-based report for CI/CD or documentation

Enable build-time checking:

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  linkChecker: {
    build: true, // Enable during build
    failOnError: true, // Fail build if errors found (optional)
  },
});
```

## What it checks

Nuxt Link Checker runs **13 SEO-focused inspections**:

1. **404 errors** – Links pointing to pages that don't exist
2. **Missing anchors** – Links to `#fragment` where the anchor doesn't exist
3. **Whitespace in URLs** – URLs containing spaces (should be encoded)
4. **Non-ASCII characters** – URLs with special characters that should be encoded
5. **Uppercase letters** – URLs with uppercase (should be lowercase for consistency)
6. **Non-root relative URLs** – Relative URLs like `../page` (should use absolute or root-relative)
7. **Missing rel attributes** – External links missing `rel="noopener"` or `rel="nofollow"`
8. **Improper target** – Links with `target="_blank"` missing security attributes
9. **Empty links** – Links with no text content or `href`
10. **Duplicate links** – Multiple links pointing to the same destination
11. **Accessibility issues** – Missing alt text on image links, improper link text
12. **Redirect chains** – Links that redirect multiple times
13. **Slow links** – Links that take too long to respond

## How it integrates with Laioutr

### Checking links in sections and blocks

Since Laioutr pages are built from **sections and blocks** configured in Studio, Link Checker automatically scans:

- **Links in block props** – Links configured in Studio (e.g. CTA buttons, navigation items)
- **Links in sections** – Links defined in section components
- **Dynamic links** – Links generated from Orchestr data (e.g. product links, category links)

The module checks all links regardless of where they come from (static config, Studio props, or dynamic data).

### Link resolver integration

Laioutr uses a **link resolver** (`useLinkResolver`) to resolve different link types (page, pageType, reference, URL, anchor). Link Checker validates:

- **Resolved URLs** – That the link resolver produces valid URLs
- **Page references** – That referenced pages exist in your runtime config
- **Page type links** – That page types exist and routes are registered

So it helps catch issues with your link resolution logic, not just static links.

### Runtime config pages

Since pages come from **runtime config** (RC), Link Checker can validate:

- **Page paths** – That all page paths are valid and don't conflict
- **Internal references** – That links between pages (e.g. in menus, breadcrumbs) point to existing pages
- **Dynamic routes** – That route parameters are properly formatted

## Configuration examples

### Exclude specific routes

Exclude routes you don't want checked (e.g. API endpoints, admin pages):

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  linkChecker: {
    exclude: [
      '/api/**', // API routes
      '/checkout/**', // Checkout flow
      '/account/**', // Account pages
    ],
  },
});
```

### Fail build on errors

Make the build fail if link errors are found (useful for CI/CD):

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  linkChecker: {
    build: true,
    failOnError: true, // Build fails if errors found
  },
});
```

### Custom report output

Configure where reports are saved:

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  linkChecker: {
    build: true,
    report: {
      html: './link-checker-report.html',
      markdown: './link-checker-report.md',
    },
  },
});
```

## Using Nuxt DevTools

When Link Checker is enabled, you can use **Nuxt DevTools** to:

- **View all link issues** in a dedicated panel
- **See which pages/components** contain broken links
- **Fix issues automatically** – Some issues can be fixed with one click
- **Filter and search** – Find specific link problems quickly

Open DevTools (usually `Alt+D` or `Cmd+Shift+D`) and navigate to the Link Checker panel to see live inspections.

## Summary

- **Link Checker** is an **optional** feature that can be added by installing **@nuxtjs/link-checker**.
- It scans your site for **broken links, SEO issues, and accessibility problems** during development and build time.
- **13 inspections** cover 404s, missing anchors, URL best practices, accessibility, and more.
- **Live in development** – See issues in your Nuxt app and fix them with DevTools.
- **Build-time reports** – Generate HTML or Markdown reports of all link issues.
- **Laioutr integration** – Checks links in sections, blocks, Studio props, and dynamic Orchestr data.
- **Link resolver validation** – Validates that link resolution produces valid URLs and that referenced pages exist.

For detailed configuration options, inspection types, and advanced usage, see the [Nuxt Link Checker documentation](https://nuxtseo.com/docs/link-checker/getting-started/introduction).
