# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the Laioutr documentation site, built with Nuxt 4 and the Docus documentation theme. It documents the Laioutr Composable Frontend Management Platform whose source-code can be found in the linked directory.

## Commands

```bash
# Install dependencies
pnpm install

# Start development server (http://localhost:3000)
pnpm dev

# Build for production
pnpm build

# Setup environment (requires Infisical)
pnpm setup

# Lint
pnpm eslint .

# Format
pnpm prettier --write .
```

## Architecture

### Tech Stack
- **Nuxt 4** with **Docus** layer for documentation theming
- **Nuxt Content** for markdown-based content management
- **Nuxt UI** for components (via Docus)
- **Tailwind CSS 4** for styling
- **nuxt-studio** for content editing integration

### Directory Structure

- `app/` - Application code (components, plugins, config)
  - `components/` - Custom Vue components that extend Docus (ComponentProps, ComponentMeta, etc.)
  - `app.config.ts` - Site configuration (header, footer, navigation, theming)
  - `plugins/` - Client plugins (mermaid for diagrams)
- `content/` - Markdown documentation organized by numbered sections
  - Prefix numbers control navigation order (e.g., `0.getting-started/`, `1.frontend/`)
  - Each section has a `.navigation.yml` for nav configuration
- `public/` - Static assets

### Content Organization

Content sections are numbered for ordering:
- `0.getting-started/` - Onboarding documentation
- `1.frontend/` - Frontend core documentation with API reference
- `2.apps/` - Third-party integrations (commercetools, shopify, etc.)
- `3.laioutr-ui/` - UI component library documentation
- `4.cloud/` - Hosting/deployment documentation
- `5.checkout/` - Checkout solution documentation
- `6.offering/` - Service level agreements and compliance

### Key Customizations

The site extends Docus with custom components for documenting the Laioutr UI library:
- `ComponentProps.vue`, `ComponentMeta.vue` - Display component API documentation
- `JsonSchemaFields.vue` - Render JSON schema as documentation
- Uses `nuxt-component-meta` and `@laioutr-core/ui-component-meta` for extracting component metadata

### Configuration

- `nuxt.config.ts` - Extends Docus, configures nuxt-studio integration
- `app/app.config.ts` - Site-wide settings (colors, header/footer, GitHub links)
- ESLint uses `@laioutr/eslint-config/nuxt-module`

### Twoslash in Code Examples

Code blocks can use `twoslash` for inline type hints (```` ```ts twoslash ```` or ```` ```vue twoslash ````). The twoslash config lives in `nuxt.config.ts` under `twoslash:` and uses `nuxt-content-twoslash`.

Laioutr packages expose a `/types` subpath specifically for docs twoslash. These re-export real functions or declare mock signatures so that twoslash can resolve types without pulling in the full Nuxt runtime:

- **`@laioutr-core/frontend-core/types`** — `defineSection`, `defineBlock`, `definitionToProps`, `defineSectionTemplate`, `defineBlockTemplate`, `linkResolver`, `useLanguage`, `useMarket`, `useMarketDomain`, `useCurrency`, `useResolvedLink`, `useI18nConfig`
- **`@laioutr-core/orchestr/types`** — `ClientEntity`, `ClientEntitySet`, `ClientResponsePagination`, handler mocks (`defineOrchestrMock`, `defineQueryHandlerMock`, etc.), composable mocks (`useMutationActionMock`, `fetchActionMock`, etc.), cache strategy types, wire format types

Use `// ---cut---` to hide mock imports from the rendered output:

```
 ```ts twoslash
 import type { SectionDefinition } from '@laioutr-core/core-types/frontend';
 // ---cut---
 // visible code starts here
 ```
```

For Vue SFC examples, place the import in `<script lang="ts">` before the cut:

```
 ```vue twoslash
 <script lang="ts">
 import { defineSection, definitionToProps } from '@laioutr-core/frontend-core/types';
 // ---cut---
 export const definition = defineSection({ ... });
 </script>
 ```
```

When adding new auto-imports to a Laioutr package that should be usable in docs twoslash, add a corresponding export (real or `declare`) to that package's `src/runtime/types.ts` file.

### LLM-Readable Content Rule

Every custom Vue component used in documentation that adds explanations, API references, or important visualizations **must** have an LLM-readable representation. MDC components like `:action-meta`, `:entity-component-meta`, `::component-meta`, `:query-meta`, and similar are rendered as interactive HTML but appear as raw syntax in `llms-full.txt`, making them invisible to LLMs.

Two approaches (pick whichever fits):
1. **Markdown-native format** — use formats that are already LLM-readable (e.g., Mermaid diagrams, markdown tables, code blocks). No extra work needed.
2. **Server-side rendering for llms-full.txt** — convert the component output to plain markdown via the `llms:generate:full` Nitro hook and `server/utils/llms/render-reflected.ts`. This intercepts the full-text generation and replaces raw MDC syntax with readable text (tables, lists, etc.).

**When modifying any component that has an LLM-generator counterpart, you must re-evaluate and update the generator to match.** Changes to a component's output, props, or data shape that aren't reflected in the LLM renderer will cause `llms-full.txt` to become stale or incorrect.
