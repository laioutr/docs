# Cockpit Links

When documentation references a Cockpit page (settings, API keys, studio, etc.), always link to it using the placeholder URL pattern:

```
https://cockpit.laioutr.cloud/o/_/p/_/settings
https://cockpit.laioutr.cloud/o/_/api-keys
https://cockpit.laioutr.cloud/o/_/p/_/studio
```

Use `_` as the placeholder for `organizationSlug` and `projectSlug`. The Cockpit resolves these to the user's default org/project.
