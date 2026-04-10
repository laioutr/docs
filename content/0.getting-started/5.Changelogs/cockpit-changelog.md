---
title: Cockpit Changelog
description: Changelog for the Laioutr Cockpit (Studio) product following Keep a Changelog and Semantic Versioning.
seo:
  title: Cockpit Changelog | Laioutr
  description: Changelog for the Laioutr Cockpit (Studio) product following Keep a Changelog and Semantic Versioning.
sitemap:
  loc: /getting-started/changelogs/cockpit-changelog
  lastmod: 2026-04-10
  changefreq: monthly
  priority: 1.0

---

All notable changes to **Cockpit (Studio)** — the visual editor and project management UI — will be documented in this file.

## [2026-04]

### Added

- **Hosting**: Deployment detail page now auto-refreshes and auto-scrolls to the latest build log entries.

### Fixed

- **Hosting**: Fixed broken snackbar link after triggering a deployment from Studio.
- **Studio**: Fixed duplicate sections appearing in the section list.
- **Studio**: Improved search in the Studio section/block picker.
- **Studio**: Hidden the localized field indicator when the project has only a single language configured.
- **Project Settings**: Removed a no-op translate button from project settings.

## [2026-03]

### Added

- **API Keys & App Releases**:
  - API key domain module with validator, repository and scopes.
  - API Keys tRPC router for full CRUD operations.
  - API Keys tab in organization settings.
  - `POST /api/v1/app/release` route with API key authentication for automated app publishing.
  - Domain events for API key and app release lifecycle.
- **i18n & Localization**:
  - Localized field indicators and improved debug tools in Studio.
  - Market-aware language switcher in Studio.
  - Language selector in the project creation form.
  - Migration script harness and `ALL_LOCALES` rename migration for transitioning to explicit locale codes.
  - Enforce field translatability in `setStaticProp`.
- **Project management**:
  - Create project button added to the organization projects tab.
  - Generate proper domain name for default market on project creation.
- **Miscellaneous**:
  - Screensharing guard for collaborative sessions.
  - Consolidated organization routes under `/o/<slug>`.
  - Re-orderable currencies.

### Changed

- Removed `ALL_LOCALES` wildcard throughout Studio in favor of explicit locale codes, including Yjs CRDT key migration with backup support and circular fallback chain prevention.
- Improved markets UI, settings, and related components (CircleFlag, SearchableSelect).
- Simplified deployment waiting page.
- Made pricing table hideable via feature flag.

### Fixed

- Fixed Yjs CRDT key deletion and added migration backup support.
- Fixed empty string not being converted to `undefined` in studio field `onChange`.
- Fixed languages/markets marked unavailable when no i18n config is present.
- Inlined core-types into Nitro bundle for Vercel compatibility.
- **Studio**: Hidden market name in the language switcher for single-market projects.
- **Studio**: Increased Studio connection timeout to 10 s for slower network conditions.
- **Studio**: Fixed stale frontend context reads after HMR reload by reading the valtio proxy lazily at call time.

## [2026-02]

### Added

- **Markets & translations**:
  - **Markets**: Overview page with empty state and create dialog, settings page with edit form, MarketGeneralSettings and MarketDomainsEditor components, market tRPC router and MarketRepository with CRUD operations.
  - **Translations**: Overview page with language management, AddLanguageDialog with BCP 47 combobox, flags and keyboard navigation, LanguageCard component, language tRPC router (list/create/delete).
  - Domain events for language/market CRUD; RcLanguage from core-types for type safety.
- **BYOS webhook hosting**:
  - WebhookHostingAdapter, WebhookSetupService (JWT-based setup flow), WebhookCallbackHandler and ByosWebhookClient for **Bring-Your-Own-Server (BYOS)** hosting integrations.
  - WebhookSender with **Standard Webhooks** signing, WebhookCallbackVerifier for secure callback authentication and a dedicated webhook callback API route for deployment status updates.
  - BudgetedRetry utility and DeploymentStatusMachine to handle **idempotent status transitions** and time-constrained retries.
  - tRPC router and hosting module wiring for BYOS webhook hosting, plus registration with well-known hosting providers and signing/callback key constants.

### Changed

- Switched Cockpit’s webhook handling to use the shared **standardwebhooks** library and brought the implementation in line with Standard Webhooks compliance.
- Improved hosting adapter behaviour: pass `providerData` to `disconnect` and `getCapabilities` for more flexible, dynamic hosting capabilities.

### Fixed

- Fixed a **config race condition** in Cockpit’s hosting setup.
- Fixed **defaultDomainId** being retained when its domain is removed.
- Addressed unhandled rejection warnings in BudgetedRetry tests.
- Improved fetch-rc and sidebar behaviour when filtering projects.
- Fixed a bug when removing a user from an organisation.

## [2026-01]

### Added

- **Project creation & management**:
  - Project creation wizard for guided project setup.
  - SupabaseDataTable for better data inspection and management in Cockpit.
  - Ability to delete projects from the project settings page, including disconnecting hosting adapters when projects are removed.
- **Hosting & infrastructure**:
  - Managed Vercel hosting now supports **foreign team access-data**.
  - Introduced a **domain event-bus** and OpenTelemetry instrumentation for Cockpit events, improving observability and decoupling internal services.

### Changed

- Restructured Cockpit into a **feature-based folder structure** (`features/auth`, `features/account`, `features/organization`, `features/studio`, etc.) for clearer ownership and modularity.
- Improved legacy deployment handling and hosting-adapter capabilities, including better clean-up on project deletion.

### Fixed

- Various small fixes during the feature-based restructuring (routing, imports, and type issues).

## [2025-12]

### Added

- **Hosting & infrastructure**:
  - Implemented **managed Vercel hosting** support.
  - Added support for Vercel runtime cache and Redis cache when a `redisUrl` is provided.
- **Studio features & UX**:
  - Migrated real-time collaboration from Jamsocket to **Liveblocks** for better stability and performance.
  - New Studio capabilities:
    - Move sections to other page-variants.
    - Copy-page action and improved edit-query modal.
    - Path validation and page path field (including params).
    - JSON field type and JSON-input with safe parsing on external value changes.
    - Loading/unloading screens and improved loading state visuals.
    - Query field “select link” support.

### Changed

- Replaced legacy HTTP calls with **tRPC** in Cockpit, aligning with the rest of the stack.
- Refactored integrations UI:
  - Replaced hardcoded integrations with dynamic ones.
  - Implemented an integration details modal and rendered integration descriptions as Markdown.

### Fixed

- Fixed various Studio stability issues:
  - React Query offline state by upgrading TanStack Query and tRPC.
  - Type errors and excessively deep TypeScript types.
  - AppProvider issues (ensured it is a client component and does not break organisation pages).
  - Studio media source logo aspect ratio.
  - Correct cloning of static props and array-items.
  - Unknown page types no longer throw errors in Studio.

## [2025-11 – 2025-10]

### Added

- **Studio editor & sections**:
  - Section tags and enhanced add-section modal, including support for double-click to add blocks/sections.
  - Newsletter sections (LUI-214) for richer marketing content.
  - Per-query-reference limit support in Cockpit for finer control over query results.
  - Page path field and validation in Studio, improving URL management.
- **Project & deployment**:
  - `projectSlug` added to `laioutrrc` and Cockpit’s deployment tooling.

### Changed

- Billing page overhaul with improved date formatting via `next-intl`.
- Multiple small tweaks in menus, variable menus and organisation/account flows to improve usability.

### Fixed

- Various small Cockpit bugs:
  - Using field fallback values when no default is given and honouring `labelSingular` in array fields.
  - JSON-input reacting correctly to external value changes.
  - Variable menu and organisation UI fixes.

## [Earlier]

### Added

- Initial versions of Cockpit and Studio:
  - **Project overview and management** (organisations, projects, environments).
  - **Studio page editor** with sections, blocks, and page variants for building frontends visually.
  - Early hosting integrations, deployment workflows and basic billing/usage views.

### Changed

- Iterative improvements to navigation, editor UX, and integration management as Cockpit evolved from an internal tool to a productised Studio experience.
