---
title: Webhook Configuration
description: The best way to integrate your own hosting solution into Laioutr is to set up a webhook. The Cockpit will call this webhook for every deployment-related action.
---

# General

The best way to integrate your own hosting solution into Laioutr is to set up a webhook. The Cockpit will call this webhook for every deployment-related action, e.g.:

- Deployments
- Status Updates & Logs
- Deployment Cancellation
- Deployment Promotion
- Rollbacks

You simply provide a URL the Cockpit will call for each of these actions.

# Authentication

## Verifying Requests (Standard Webhooks)

All requests from Cockpit are signed using the [Standard Webhooks](https://www.standardwebhooks.com/) specification. When you configure your webhook, you'll receive a signing secret that you use to verify incoming requests.

Each request includes these headers:

| Header              | Description                                 |
| ------------------- | ------------------------------------------- |
| `webhook-id`        | Unique identifier for this webhook delivery |
| `webhook-timestamp` | Unix timestamp when the request was sent    |
| `webhook-signature` | HMAC-SHA256 signature of the payload        |

To verify a request:

1. Concatenate `{webhook-id}.{webhook-timestamp}.{body}` (body is the raw request body)
2. Compute HMAC-SHA256 using your signing secret
3. Compare with the signature in the header (timing-safe comparison)
4. Reject requests older than 5 minutes to prevent replay attacks

Most languages have Standard Webhooks libraries available. See [standardwebhooks.com](https://www.standardwebhooks.com/) for implementations.

# Request Format

All requests are `POST` with `Content-Type: application/json`. Every request includes:

| Field       | Type   | Description                                         |
| ----------- | ------ | --------------------------------------------------- |
| `event`     | string | The event type (e.g., `hosting.deployment.created`) |
| `timestamp` | string | ISO 8601 timestamp                                  |
| `project`   | string | Project identifier as `<org-slug>/<project-slug>`   |
| `data`      | object | Event-specific payload (optional)                   |

```json
{
  "event": "hosting.deployment.created",
  "timestamp": "2025-01-30T12:00:00Z",
  "project": "acme-corp/storefront",
  "data": { ... }
}
```

# Response Format

Your endpoint must respond with JSON in this format:

```json
{
  "ok": true,
  "data": { ... }
}
```

Or on failure:

```json
{
  "ok": false,
  "error": "Human-readable error message"
}
```

Return appropriate HTTP status codes:

- `200` for successful processing
- `400` for invalid requests
- `401` for authentication failures
- `500` for server errors

# Events

## `hosting.describe`

Cockpit sends this event to discover your system's capabilities. This is called during initial setup and periodically to refresh capabilities.

### Request

```json
{
  "event": "hosting.describe",
  "timestamp": "2025-01-30T12:00:00Z",
  "project": "acme-corp/storefront"
}
```

### Response

```json
{
  "ok": true,
  "data": {
    "name": "Your CI/CD System",
    "capabilities": {
      "statusUpdates": true,
      "cancelDeployment": false,
      "promoteDeployment": false,
      "rollbackDeployment": false,
      "deleteDeployment": false
    }
  }
}
```

### Capabilities

| Capability           | Description                                               |
| -------------------- | --------------------------------------------------------- |
| `statusUpdates`      | Your system will call back with deployment status updates |
| `cancelDeployment`   | Your system can cancel in-progress deployments            |
| `promoteDeployment`  | Your system can promote deployments to production         |
| `rollbackDeployment` | Your system can rollback to previous deployments          |
| `deleteDeployment`   | Your system can delete deployments                        |

Set capabilities to `true` only for actions your system supports. Cockpit will only send those event types if you indicate support.

## `hosting.connected`

Sent when a project successfully connects to your webhook. Use this to set up any resources you need for the project.

### Request

```json
{
  "event": "hosting.connected",
  "timestamp": "2025-01-30T12:00:00Z",
  "project": "acme-corp/storefront"
}
```

### Response

```json
{
  "ok": true,
  "data": {}
}
```

## `hosting.disconnected`

Sent when a project disconnects from your webhook. Use this to clean up any resources.

### Request

```json
{
  "event": "hosting.disconnected",
  "timestamp": "2025-01-30T12:00:00Z",
  "project": "acme-corp/storefront"
}
```

### Response

```json
{
  "ok": true,
  "data": {}
}
```

## `hosting.deployment.created`

Sent when a user triggers a deployment. Contains all files needed to build and deploy the project.

### Request

```json
{
  "event": "hosting.deployment.created",
  "timestamp": "2025-01-30T12:00:00Z",
  "project": "acme-corp/storefront",
  "data": {
    "deploymentId": "dep_abc123",
    "environment": "production",
    "callbackUrl": "https://cockpit.laioutr.com/api/webhook/hosting/dep_abc123?secret=xxx",
    "files": {
      "package.json": "{ \"name\": \"storefront\", ... }",
      "nuxt.config.ts": "export default defineNuxtConfig({ ... })",
      "laioutrrc.json": "{ ... }",
      "app.vue": "<template>...</template>"
    }
  }
}
```

### Fields

| Field          | Description                                                            |
| -------------- | ---------------------------------------------------------------------- |
| `deploymentId` | Unique identifier for this deployment                                  |
| `environment`  | Either `"production"` or `"staging"`                                   |
| `callbackUrl`  | URL to POST status updates (see [Status Callbacks](#status-callbacks)) |
| `files`        | Map of filename to file contents                                       |

### Response

Acknowledge receipt immediately. Don't wait for the build to complete.

```json
{
  "ok": true,
  "data": {}
}
```

## `hosting.deployment.cancel`

Sent when a user requests to cancel an in-progress deployment. Only sent if you indicated `cancelDeployment: true` in capabilities.

### Request

```json
{
  "event": "hosting.deployment.cancel",
  "timestamp": "2025-01-30T12:00:00Z",
  "project": "acme-corp/storefront",
  "data": {
    "deploymentId": "dep_abc123"
  }
}
```

### Response

```json
{
  "ok": true,
  "data": {}
}
```

## `hosting.deployment.promote`

Sent when a user wants to promote a staging deployment to production. Only sent if you indicated `promoteDeployment: true` in capabilities.

### Request

```json
{
  "event": "hosting.deployment.promote",
  "timestamp": "2025-01-30T12:00:00Z",
  "project": "acme-corp/storefront",
  "data": {
    "deploymentId": "dep_abc123"
  }
}
```

### Response

```json
{
  "ok": true,
  "data": {}
}
```

## `hosting.deployment.rollback`

Sent when a user wants to rollback to a previous deployment. Only sent if you indicated `rollbackDeployment: true` in capabilities.

### Request

```json
{
  "event": "hosting.deployment.rollback",
  "timestamp": "2025-01-30T12:00:00Z",
  "project": "acme-corp/storefront",
  "data": {
    "deploymentId": "dep_abc123"
  }
}
```

### Response

```json
{
  "ok": true,
  "data": {}
}
```

## `hosting.deployment.delete`

Sent when a user wants to delete a deployment. Only sent if you indicated `deleteDeployment: true` in capabilities.

### Request

```json
{
  "event": "hosting.deployment.delete",
  "timestamp": "2025-01-30T12:00:00Z",
  "project": "acme-corp/storefront",
  "data": {
    "deploymentId": "dep_abc123"
  }
}
```

### Response

```json
{
  "ok": true,
  "data": {}
}
```

# Status Callbacks

If you set `statusUpdates: true` in your capabilities, you should POST status updates to the `callbackUrl` provided in the deployment request.

## Callback URL

The callback URL is provided in the `hosting.deployment.created` event:

```text
https://cockpit.laioutr.com/api/webhook/hosting/{deploymentId}?secret={secret}
```

The secret in the URL authenticates your request. No additional headers are required.

## Status Events

Send a `POST` request with `Content-Type: application/json`:

### Building

Indicate that the build has started:

```json
{
  "event": "hosting.deployment.status",
  "timestamp": "2025-01-30T12:05:00Z",
  "data": {
    "status": "building"
  }
}
```

### Success

Indicate that deployment succeeded. Include the URL where the site is accessible:

```json
{
  "event": "hosting.deployment.status",
  "timestamp": "2025-01-30T12:10:00Z",
  "data": {
    "status": "success",
    "url": "https://storefront.example.com"
  }
}
```

### Error

Indicate that the deployment failed. Include an error message:

```json
{
  "event": "hosting.deployment.status",
  "timestamp": "2025-01-30T12:10:00Z",
  "data": {
    "status": "error",
    "error": "Build failed: npm install returned exit code 1"
  }
}
```

### Cancelled

Indicate that the deployment was cancelled:

```json
{
  "event": "hosting.deployment.status",
  "timestamp": "2025-01-30T12:08:00Z",
  "data": {
    "status": "cancelled"
  }
}
```

## Callback Response

Cockpit responds with:

```json
{
  "ok": true
}
```

Or on error:

```json
{
  "ok": false,
  "error": "Deployment not found"
}
```

# Setup in Cockpit

1. Go to **Project** → **Hosting**
2. Click **Connect custom hosting**
3. Enter your webhook endpoint URL
4. Copy the signing secret and configure it in your system
5. Click **Test connection** to verify everything works
6. Click **Confirm** to save the configuration

Your webhook will now receive events for all deployment actions.

# Troubleshooting

## Signature verification fails

- Ensure you're using the raw request body for verification, not a parsed JSON object
- Check that your signing secret matches exactly (no extra whitespace)
- Verify the timestamp is within 5 minutes of the current time

## Not receiving events

- Check that your endpoint is publicly accessible
- Verify your endpoint returns `200` status codes
- Check your server logs for errors

## Deployment stuck in "building"

- Ensure you're calling the callback URL with status updates
- Verify the callback URL secret is included in the request
- Check that your status payload matches the expected format
