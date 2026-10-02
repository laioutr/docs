---
title: App Manifest
description: Declare the settings your app needs in laioutr.manifest.json, so customers enter them per environment in the Cockpit with a form, encrypted secrets and a connection test.
seo:
  title: App Manifest (laioutr.manifest.json)
  description: Declare the settings your app needs in laioutr.manifest.json, so customers enter them per environment in the Cockpit with a form, encrypted secrets and a connection test.
sitemap:
  loc: /apps/app-development/app-manifest
  lastmod: 2026-10-02
  changefreq: monthly
  priority: 1
---

Your app talks to an external service, and every customer has their own account there: an API address, a token, a store id. Without a manifest, someone has to write those values into `laioutrrc.json` by hand for every environment. With a `laioutr.manifest.json` in your package, the Cockpit shows a form for them under each environment's [Configuration](/cockpit/features/configuration), stores tokens encrypted, and offers a **Test connection** button that proves the values work before anyone deploys.

```json [laioutr.manifest.json]
{
  "configSettings": {
    "menu": { "label": "Acme Search" },
    "sections": [
      {
        "label": "Account",
        "fields": [
          { "name": "accountId", "type": "text", "label": "Account ID", "required": true },
          { "name": "apiToken", "type": "secret", "label": "API token" }
        ]
      }
    ]
  }
}
```

Each field's `name` is an option of your Nuxt module. The value a customer saves reaches your module exactly as if it had been written into `laioutrrc.json` under `apps[].config`, so your module code does not change. See [App Configuration](/apps/app-development/app-configuration) for how the module reads its options.

## Names, never values

The manifest describes **which** settings your app asks for and how to show them. It never carries a customer's value. A token, a key or a default credential in the manifest would ship inside your package to everyone who installs it, and to the registry.

The validator enforces part of this: a `secret` field may not declare a `default`. The rest is up to you. Use `placeholder` to show the shape of a value (`acme-shop.example.com`), never a real one.

## Where the file lives

Put `laioutr.manifest.json` at the root of your package, next to `package.json`, and list it in `files`. npm only packs what `files` names, and the registry reads the manifest from the published tarball. A manifest that is not in the tarball does not exist as far as the Cockpit is concerned.

```json [package.json]
{
  "name": "@laioutr-org/acme__search",
  "version": "1.4.0",
  "files": ["dist", "CHANGELOG.md", "laioutr.manifest.json"]
}
```

Check it with `npm pack --dry-run`: the file list must include `laioutr.manifest.json`.

The registry at `npm.laioutr.cloud` reads the manifest once, when a version is published, and keeps it with that version. A manifest belongs to one version: when you change it, publish a new version. The file may be at most 256 KB.

Publishing alone does not show the form yet. [Releasing an App](/apps/app-development/releasing-an-app) covers the step that hands it to the Cockpit.

## Format

The manifest is a JSON object. Today it has one key, `configSettings`.

::field-group{title="configSettings"}
  :::field{name="sections" type="AppConfigSection[]" :required="true"}
  The groups of fields, shown in this order. At least one.
  :::

  :::field{name="menu" type="{ label?: string; icon?: string }"}
  `label` names the app's settings in the Cockpit. When left out, the Cockpit uses the app's catalogue title; for an app listed by its first release, that is the last segment of the package name (`search` for `@laioutr-org/acme__search`), so set a label. `icon` is accepted but not shown today.
  :::

  :::field{name="placement" type="'environment' | 'project' | 'organization' | 'studio'" default-value="environment"}
  Where the settings are set. Only `environment` is rendered today: whatever you declare, the Cockpit shows the form per environment. Leave it out or set `environment`.
  :::
::

::field-group{title="A section"}
  :::field{name="label" type="string"}
  The section's heading. Required when the section has a `test`, and then unique among the sections that have one.
  :::

  :::field{name="description" type="string"}
  A line under the heading. A good place to say where in the external service the customer finds the values.
  :::

  :::field{name="fields" type="AppConfigField[]" :required="true"}
  The fields of the section. At least one.
  :::

  :::field{name="test" type="AppConnectionTest"}
  A request the Cockpit sends to prove the section's values work. See [Connection tests](#connection-tests).
  :::

  :::field{name="placement" type="string"}
  Accepted with the same values as above, not rendered today.
  :::
::

::field-group{title="A field"}
  :::field{name="name" type="string" :required="true"}
  The module option the value is stored under. Unique across **all** sections of the manifest, because your module receives one flat options object.
  :::

  :::field{name="type" type="string" :required="true"}
  One of the types in the table below.
  :::

  :::field{name="label" type="string"}
  The field's label. Defaults to `name`.
  :::

  :::field{name="description" type="string"}
  Help text under the field.
  :::

  :::field{name="placeholder" type="string"}
  Shown in an empty `text`, `textarea`, `secret` or `json` field.
  :::

  :::field{name="required" type="boolean" default-value="false"}
  The Cockpit refuses to save the app's settings while a required field is empty.
  :::

  :::field{name="default" type="string | number | boolean"}
  What the form starts with when nothing is stored yet. Not allowed on `secret`. It pre-fills the form only; it is not a fallback your module receives when the field is empty.
  :::

  :::field{name="options" type="{ value: string; label: string }[]"}
  The choices of a `select`, `radio` or `toggle_button`. At least one for `select` and `radio`.
  :::

  :::field{name="minLength / maxLength" type="number"}
  Length limits for text values.
  :::

  :::field{name="pattern" type="string"}
  A regular expression a text value must match.
  :::

  :::field{name="min / max" type="number"}
  Limits for a `number`.
  :::
::

Mark a field `required` only when your module cannot start without it. A required field blocks saving **every** other setting of the app in that environment until it has a value, including for a customer whose value still comes from somewhere else, such as an environment variable on their host.

## Field types

| `type` | The Cockpit shows | Your module receives |
| --- | --- | --- |
| `text` | A single-line input | `string` |
| `textarea` | A multi-line input | `string` |
| `number` | A number input, checked against `min` and `max` | `number` |
| `select` | A dropdown of `options` | the chosen option's `value` |
| `radio` | Radio buttons of `options` | the chosen option's `value` |
| `checkbox` | A checkbox | `boolean` |
| `secret` | A password input. Stored encrypted; afterwards shown as bullets plus its last four characters (only for values of 20 characters or more), never in full | `string` |
| `info` | A notice with `label` and `description`, no input | nothing |
| `json` | A JSON text area, shown again as formatted JSON | the object |
| `json` with `"secret": true` | A JSON text area. Stored encrypted as one value; afterwards shown only as set | the object |
| `richtext`, `array`, `object` | A note that the Cockpit cannot edit this type yet. A stored value is kept as it is | whatever is stored |

The validator also accepts `toggle_button`. Do not use it for app settings yet: use `checkbox` for an on/off value and `select` or `radio` for a choice.

An empty optional field is removed from the stored settings, so your module sees the option as not set and applies its own default.

## JSON groups

Some modules read a group of options as one object:

```ts [src/module.ts]
export interface ModuleOptions {
  search?: { appId: string; adminApiKey: string };
}
```

Declare such a group as one `json` field. The customer types the whole object as JSON, and your module receives the same object it always read.

```json [laioutr.manifest.json]
{
  "name": "search",
  "type": "json",
  "secret": true,
  "label": "Search credentials",
  "placeholder": "{ \"appId\": \"...\", \"adminApiKey\": \"...\" }"
}
```

A group comes in two kinds:

- **Open** (`"type": "json"`): stored as it was typed and shown again as formatted JSON. Use it for settings that hold no credential.
- **Sealed** (`"type": "json"`, `"secret": true`): stored encrypted as one value and shown only as set, never any part of it, not even its last characters. To change one value inside it, the customer pastes the whole group again. Declare any group that holds a credential as sealed.

Prefer **flat fields** when you can choose. A flat field gets its own label, validation and help text, a `secret` shows its last four characters so a customer can tell which token is stored, and a connection test can use it as a placeholder. A JSON group gets none of that: the Cockpit only checks that the text is a JSON object, and a test never sees a value inside a group. Reach for a group only when your module already reads its options that way and changing the module is not an option.

## Validation rules

A manifest that breaks a rule gives the app no settings form; publishing still succeeds. The rules:

- `configSettings.sections` has at least one section, and each section has at least one field.
- Every field has a `name`, unique across all sections. `__proto__`, `constructor` and `prototype` are not allowed.
- Every `type` is one of the field types above.
- A `secret` field has no `default`.
- A `select` or `radio` field has at least one option.
- `placement`, wherever it appears, is one of `environment`, `project`, `organization`, `studio`.
- A section with a `test` has a `label`, and no other section with a test has the same label.
- A test follows the rules in [Connection tests](#connection-tests).

Run the same validator before you publish. It returns a list of problems, each with the path it was found at, and an empty list for a sound manifest:

```ts [scripts/check-manifest.ts]
import { readFileSync } from 'node:fs';
import { validateAppManifest } from '@laioutr-core/core-types/app';

const manifest = JSON.parse(readFileSync('laioutr.manifest.json', 'utf8'));
const problems = validateAppManifest(manifest);

if (problems.length) {
  console.error(problems.join('\n'));
  process.exit(1);
}
```

```text
configSettings.sections[1].fields[2].options: a select needs at least one option
```

## Connection tests

A section can declare one request that proves its values reach the service. The Cockpit shows a **Test connection** button on that section and sends the request from its server with the values on screen; values the customer has not changed come from what is stored, secrets included.

```json [laioutr.manifest.json]
{
  "label": "Account",
  "description": "Acme dashboard > Settings > API keys.",
  "fields": [
    { "name": "apiHost", "type": "text", "label": "API host", "placeholder": "eu.api.acme.example.com" },
    { "name": "apiToken", "type": "secret", "label": "API token" }
  ],
  "test": {
    "hosts": ["*.api.acme.example.com"],
    "method": "GET",
    "url": "https://{{apiHost}}/v1/account",
    "headers": { "Authorization": "Bearer {{apiToken}}" },
    "expect": "account.id"
  }
}
```

::field-group{title="test"}
  :::field{name="hosts" type="string[]" :required="true"}
  The hosts the request may reach: an exact name (`api.acme.example.com`) or a wildcard for subdomains (`*.acme.example.com`). No IP addresses, no ports, no bare `*`, no internal names such as `localhost` or `*.local`.
  :::

  :::field{name="method" type="'GET' | 'POST'" :required="true"}
  Choose a request that reads and changes nothing in the customer's account.
  :::

  :::field{name="url" type="string" :required="true"}
  An `https://` address. May contain placeholders, but never a secret one.
  :::

  :::field{name="headers" type="Record<string, string>"}
  Request headers. The place for a token.
  :::

  :::field{name="body" type="string"}
  A request body, with `POST` only.
  :::

  :::field{name="expect" type="string"}
  A dotted path into the JSON answer, such as `data.shop.name`. The test passes only when it holds a value. Without it, any `2xx` answer passes.
  :::
::

`{{name}}` in the URL, a header or the body is replaced by the value of the field with that name. Any field of the manifest may be used, also one from another section; every placeholder must name a field, and only text and number values fill one. A secret goes in a header or the body, never the URL: an address ends up in logs and error messages, so the validator refuses a secret placeholder there.

How the Cockpit runs the test:

- A value is encoded where it lands in the URL, so it can name a host but cannot add a path, a query or a fragment.
- The resulting host must match `hosts`, use `https` with no port, and resolve to a public address. A private, loopback or link-local address is refused.
- Redirects are not followed. The request times out after 10 seconds.
- The browser learns only whether the test passed or why not: a value is missing, the host is not allowed, the service did not answer, it refused the credentials (`401`/`403`), nothing answered at that address (`404`), or another answer. It never sees the request address, the answer or any part of a credential.

A test is a check the customer starts by hand. It never runs on save or before a deployment.

## A complete example

An app for a fictional search service, Acme Search, with an account, an index and two optional behaviours:

::code-collapse
```json [laioutr.manifest.json]
{
  "configSettings": {
    "placement": "environment",
    "menu": { "label": "Acme Search" },
    "sections": [
      {
        "label": "Account",
        "description": "Acme dashboard > Settings > API keys. Use a read-only key.",
        "fields": [
          {
            "name": "apiHost",
            "type": "text",
            "label": "API host",
            "placeholder": "eu.api.acme.example.com",
            "required": true,
            "pattern": "^[a-z0-9.-]+$"
          },
          {
            "name": "apiToken",
            "type": "secret",
            "label": "API token",
            "required": true
          }
        ],
        "test": {
          "hosts": ["*.api.acme.example.com"],
          "method": "GET",
          "url": "https://{{apiHost}}/v1/account",
          "headers": { "Authorization": "Bearer {{apiToken}}" },
          "expect": "account.id"
        }
      },
      {
        "label": "Index",
        "fields": [
          {
            "name": "indexName",
            "type": "text",
            "label": "Index name",
            "description": "The index this environment searches. Use a separate index per environment.",
            "placeholder": "products-production"
          },
          {
            "name": "resultsPerPage",
            "type": "number",
            "label": "Results per page",
            "min": 1,
            "max": 100,
            "default": 24
          },
          {
            "name": "sortOrder",
            "type": "select",
            "label": "Default sort order",
            "options": [
              { "value": "relevance", "label": "Relevance" },
              { "value": "newest", "label": "Newest first" }
            ],
            "default": "relevance"
          }
        ]
      },
      {
        "label": "Behaviour",
        "fields": [
          {
            "name": "behaviourNote",
            "type": "info",
            "label": "Applies to the storefront search only",
            "description": "Category pages are not affected."
          },
          {
            "name": "typoTolerance",
            "type": "checkbox",
            "label": "Tolerate typos",
            "default": true
          }
        ]
      }
    ]
  }
}
```
::

The module that reads these settings:

```ts [src/module.ts]
export interface ModuleOptions {
  apiHost: string;
  apiToken: string;
  indexName?: string;
  resultsPerPage?: number;
  sortOrder?: 'relevance' | 'newest';
  typoTolerance?: boolean;
}
```

Every `name` in the manifest is a key of `ModuleOptions`, except the `info` field, which holds no value. A unit test that reads the manifest and compares its field names with the keys of `ModuleOptions` catches a renamed option before a customer does.

## Next steps

- [Releasing an App](/apps/app-development/releasing-an-app): publish, release and deploy, and what each step changes.
- [Configuration in the Cockpit](/cockpit/features/configuration): what your customers see.
- [App Configuration](/apps/app-development/app-configuration): how your module reads its options.
