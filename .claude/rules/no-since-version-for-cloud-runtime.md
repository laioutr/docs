# No version marker for the cloud runtime

Never add a `::since-version` marker for `@laioutr-core/cloud-runtime`, and do not ask whether to add one. Asked by
Roman, 2026-10-29.

This is the one exception to `since-version-component.md`, which otherwise says to ask before finishing the doc work.

## Context

- A project never picks its cloud-runtime version: every Laioutr Cloud deployment installs the latest one itself.
- The docs have no changelog page for cloud-runtime, so the marker would have nothing to link to.

Describe the behaviour on Laioutr Cloud as it is now, with no version.
