# CLI Deploy Commands Documentation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Accurately document the four Laioutr deployment commands in the CLI reference and show how to use them in CI/CD workflows.

**Architecture:** Keep generated-command details in the CLI reference as concise examples and flag tables, while the CI/CD page remains task-oriented. Shared CLI flags and authentication stay centralized; the CI/CD guide links the commands into trigger, wait, stream, and inspect workflows without duplicating the full reference.

**Tech Stack:** Nuxt 4, Nuxt Content Markdown, Docus, Prettier, pnpm

## Global Constraints

- Modify only the CLI reference and CI/CD guide; the CLI changelog and unrelated deployment documentation are out of scope.
- Document only options present in the supplied CLI interface.
- Keep `--cockpitApiHost` and `--cwd` in the shared global flags section instead of repeating them under every deployment command.
- Use task-focused examples and Markdown flag tables rather than copying generated CLI help verbatim.
- Organization API keys used by deployment commands require the `project:deploy` scope.

---

## File Structure

- `content/0.getting-started/4.next-steps/5.cli.md`: Authoritative human-readable CLI command reference, including complete deployment command examples and command-specific flags.
- `content/0.getting-started/3.key-concepts/6.ci-cd-pipeline.md`: End-to-end app publishing and deployment workflow, including waiting, log streaming, and post-trigger inspection.

### Task 1: Complete the deployment command reference

**Files:**
- Modify: `content/0.getting-started/4.next-steps/5.cli.md:9,40-43,89-151`

**Interfaces:**
- Consumes: Supplied `laioutr deploy list`, `logs`, `status`, and `trigger` help output.
- Produces: The canonical documentation for deployment command names, flags, defaults, and examples used by readers of the CI/CD guide.

- [ ] **Step 1: Confirm the current reference exposes the known stale and missing content**

Run:

```bash
rg -n -- '--with-app|--with-app-config|deploy logs|--limit|--logs' content/0.getting-started/4.next-steps/5.cli.md
```

Expected: matches for `--with-app` and `--with-app-config`; no matches for `deploy logs`, `--limit`, or the trigger `--logs` flag.

- [ ] **Step 2: Update the page metadata and deployment API-key scope**

Change `sitemap.lastmod` to `2026-07-21`, and change the organization API key authentication bullet to:

```markdown
- **Organization API key** — used by `app release` and `deploy` commands. Create one in the Cockpit under [Organization Settings > API Keys](https://cockpit.laioutr.cloud/o/_/api-keys). Deployment commands require the `project:deploy` scope. Pass the key via the `--key` flag or `LAIOUTR_API_KEY` environment variable.
```

- [ ] **Step 3: Replace the deployment command sections with the supported command interface**

Replace the content from `### \`deploy trigger\`` through the end of the file with:

````markdown
### `deploy trigger`

Triggers a project deployment. By default, the command waits for the deployment to complete.

```bash
# Production deployment
laioutr deploy trigger --project <org>/<project> --key orgKey_xxx

# Return immediately after triggering
laioutr deploy trigger --project <org>/<project> --key orgKey_xxx --no-wait

# Stream build logs while waiting
laioutr deploy trigger --project <org>/<project> --key orgKey_xxx --logs

# Named preview deployment
laioutr deploy trigger \
  --project <org>/<project> \
  --key orgKey_xxx \
  --preview my-feature
```

| Flag              | Required | Default | Description                                                       |
| ----------------- | -------- | ------- | ----------------------------------------------------------------- |
| `-p, --project`   | Yes      | —       | `<organization slug>/<project slug>`                              |
| `-k, --key`       | Yes      | —       | Organization API key with `project:deploy` scope                  |
| `--[no-]wait`     | No       | Wait    | Wait for completion; use `--no-wait` to return after triggering   |
| `--logs`          | No       | —       | Stream build log output instead of showing a spinner              |
| `--preview <name>` | No      | —       | Create a preview deployment with an optional name                 |
| `--json`          | No       | —       | Format output as JSON                                             |

### `deploy status`

Shows the status of a specific deployment.

```bash
laioutr deploy status --project <org>/<project> --key orgKey_xxx --deploymentId dep_abc123
```

| Flag             | Required | Default | Description                                      |
| ---------------- | -------- | ------- | ------------------------------------------------ |
| `-p, --project`  | Yes      | —       | `<organization slug>/<project slug>`             |
| `-k, --key`      | Yes      | —       | Organization API key with `project:deploy` scope |
| `--deploymentId` | Yes      | —       | Deployment ID                                    |
| `--json`         | No       | —       | Format output as JSON                            |

### `deploy logs`

Fetches and displays build logs for a deployment.

```bash
laioutr deploy logs --project <org>/<project> --key orgKey_xxx --deploymentId dep_abc123
```

| Flag             | Required | Default | Description                                      |
| ---------------- | -------- | ------- | ------------------------------------------------ |
| `-p, --project`  | Yes      | —       | `<organization slug>/<project slug>`             |
| `-k, --key`      | Yes      | —       | Organization API key with `project:deploy` scope |
| `--deploymentId` | Yes      | —       | Deployment ID                                    |
| `--json`         | No       | —       | Format output as JSON                            |

### `deploy list`

Lists recent deployments for a project.

```bash
# Use the default limit of 20 deployments
laioutr deploy list --project <org>/<project> --key orgKey_xxx

# Return up to 50 deployments
laioutr deploy list --project <org>/<project> --key orgKey_xxx --limit 50
```

| Flag            | Required | Default | Description                                      |
| --------------- | -------- | ------- | ------------------------------------------------ |
| `-p, --project` | Yes      | —       | `<organization slug>/<project slug>`             |
| `-k, --key`     | Yes      | —       | Organization API key with `project:deploy` scope |
| `--limit`       | No       | `20`    | Maximum deployments to list (`1`–`100`)          |
| `--json`        | No       | —       | Format output as JSON                            |
````

- [ ] **Step 4: Format and validate the CLI reference**

Run:

```bash
pnpm exec prettier --write content/0.getting-started/4.next-steps/5.cli.md
pnpm exec prettier --check content/0.getting-started/4.next-steps/5.cli.md
```

Expected: Prettier writes or confirms the file, then reports `All matched files use Prettier code style!`.

- [ ] **Step 5: Verify supported flags are present and unsupported flags are absent**

Run:

```bash
rg -n -- 'deploy (trigger|status|logs|list)|--no-wait|--logs|--preview|--limit' content/0.getting-started/4.next-steps/5.cli.md
! rg -n -- '--with-app|--with-app-config' content/0.getting-started/4.next-steps/5.cli.md
```

Expected: all four deployment commands and the new trigger/list options match; the negated search exits successfully with no unsupported-option output.

- [ ] **Step 6: Commit the CLI reference update**

```bash
git add content/0.getting-started/4.next-steps/5.cli.md
git commit -m "docs(cli): document deployment commands"
```

Expected: one commit containing only the CLI reference update.

### Task 2: Expand the CI/CD deployment workflow

**Files:**
- Modify: `content/0.getting-started/3.key-concepts/6.ci-cd-pipeline.md:9,30-32,63-72,107-152`

**Interfaces:**
- Consumes: The command behavior documented in Task 1: default waiting, `--no-wait`, `--logs`, `--preview`, `status`, `logs`, and `list`.
- Produces: A supported deployment workflow for app developers and CI maintainers.

- [ ] **Step 1: Confirm unsupported override examples remain in the guide**

Run:

```bash
rg -n -- 'app publish|--with-app|deploy (status|logs|list)|--no-wait|--logs' content/0.getting-started/3.key-concepts/6.ci-cd-pipeline.md
```

Expected: matches for `app publish` and `--with-app`; no workflow examples for `deploy status`, `deploy logs`, `deploy list`, `--no-wait`, or `--logs`.

- [ ] **Step 2: Align metadata and app registration terminology**

Change `sitemap.lastmod` to `2026-07-21`. Replace the first two instances of `laioutr app publish` with `laioutr app release`: the Mermaid edge label and the registration command in section 3. Step 4 below updates the final instance as part of the end-to-end example.

- [ ] **Step 3: Replace the deployment workflow section**

Replace section `## 5. Deploying` up to, but not including, `## Example: shipping a new app from scratch` with:

````markdown
## 5. Deploying

Trigger production or preview deployments using the Laioutr CLI:

```bash
# Production deployment; waits for completion by default
laioutr deploy trigger --project org/project --key orgKey_xxx

# Named preview deployment
laioutr deploy trigger \
  --project org/project \
  --key orgKey_xxx \
  --preview my-feature
```

Use `--logs` to stream build output instead of displaying a spinner while the command waits:

```bash
laioutr deploy trigger --project org/project --key orgKey_xxx --logs
```

For asynchronous CI jobs, use `--no-wait` and inspect the deployment later using the returned deployment ID:

```bash
# Trigger without waiting
laioutr deploy trigger --project org/project --key orgKey_xxx --no-wait

# Inspect the deployment afterward
laioutr deploy status \
  --project org/project \
  --key orgKey_xxx \
  --deploymentId dep_abc123

laioutr deploy logs \
  --project org/project \
  --key orgKey_xxx \
  --deploymentId dep_abc123
```

List recent deployments when you do not have a deployment ID, optionally increasing the default result limit of 20:

```bash
laioutr deploy list --project org/project --key orgKey_xxx --limit 50
```

Preview deployments create isolated environments for testing without affecting production. Pass a name to `--preview` so the deployment is easy to identify in later status and list output.
````

- [ ] **Step 4: Replace the deployment portion of the end-to-end example**

Inside the existing Bash code block, keep steps 1 and 2 unchanged and replace steps 3 through 5 with:

```bash
# 3. Register the version with Laioutr
laioutr app release --key orgKey_xxx

# 4. Deploy a named preview for QA and stream its logs
laioutr deploy trigger \
  --project acme/storefront \
  --key orgKey_xxx \
  --preview test-my-app \
  --logs

# 5. Once tested, deploy to production
laioutr deploy trigger --project acme/storefront --key orgKey_xxx --logs
```

- [ ] **Step 5: Format and validate the CI/CD guide**

Run:

```bash
pnpm exec prettier --write content/0.getting-started/3.key-concepts/6.ci-cd-pipeline.md
pnpm exec prettier --check content/0.getting-started/3.key-concepts/6.ci-cd-pipeline.md
```

Expected: Prettier writes or confirms the file, then reports `All matched files use Prettier code style!`.

- [ ] **Step 6: Verify the workflow uses only supported command names and flags**

Run:

```bash
rg -n -- 'app release|deploy (trigger|status|logs|list)|--no-wait|--logs|--preview|--limit' content/0.getting-started/3.key-concepts/6.ci-cd-pipeline.md
! rg -n -- 'app publish|--with-app|--with-app-config' content/0.getting-started/3.key-concepts/6.ci-cd-pipeline.md
```

Expected: the release command and complete deployment workflow match; the negated search exits successfully without stale command output.

- [ ] **Step 7: Build the documentation site**

Run:

```bash
pnpm build
```

Expected: Nuxt exits with status 0 and reports a successful build without Markdown or Nuxt Content errors from either changed page.

- [ ] **Step 8: Review the final documentation diff**

Run:

```bash
git diff --check
git diff -- content/0.getting-started/4.next-steps/5.cli.md content/0.getting-started/3.key-concepts/6.ci-cd-pipeline.md
```

Expected: `git diff --check` emits no errors. The diff contains only supported deployment examples, complete flag details, updated registration terminology, and `lastmod` changes.

- [ ] **Step 9: Commit the CI/CD guide update**

```bash
git add content/0.getting-started/3.key-concepts/6.ci-cd-pipeline.md
git commit -m "docs(ci): expand deployment workflows"
```

Expected: one commit containing only the CI/CD guide update.
