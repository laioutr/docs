# CLI Deploy Commands Documentation Design

## Goal

Update the Laioutr CLI reference and CI/CD guide to accurately document the new deployment listing, log retrieval, status, and trigger commands.

## Scope

Update these pages:

- `content/0.getting-started/4.next-steps/5.cli.md`
- `content/0.getting-started/3.key-concepts/6.ci-cd-pipeline.md`

The CLI changelog and unrelated deployment documentation are out of scope.

## CLI reference

The CLI page will provide task-focused reference sections for all four deployment commands:

- `deploy trigger`: document production and preview deployment examples, waiting behavior, log streaming, and JSON output. Remove app-version and app-config override flags that are absent from the supplied command interface.
- `deploy status`: retain the deployment status reference and align flag notation with the supplied interface.
- `deploy logs`: add a reference section with an example and flags.
- `deploy list`: add the configurable result limit and its valid range/default.

Shared flags such as `--cockpitApiHost` and `--cwd` remain in the global flags section rather than being repeated for each command. Each command section will use concise examples and a Markdown flag table rather than reproducing generated CLI help verbatim.

## CI/CD guide

The deployment workflow will be updated to use only supported command options. It will explain:

- triggering production and named preview deployments;
- waiting for completion or returning immediately with `--no-wait`;
- streaming logs while waiting with `--logs`;
- inspecting deployments afterward with `deploy status`, `deploy logs`, and `deploy list`.

Existing examples using unsupported `--with-app` and `--with-app-config` flags will be removed. The end-to-end shipping example will be adjusted accordingly.

## Validation

Run formatting checks on both changed Markdown files and build the documentation site to catch Nuxt Content or Markdown rendering errors. Review the final diff against the supplied CLI help to ensure command names, required flags, defaults, and examples match.
