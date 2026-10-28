# Review: docs for the reserved /webhooks/ path

Branch `docs/webhooks-reserved-path`, `origin/main...HEAD`, commits `a971f65` and `7e5f6bc`. Reviewed 2026-10-27 by a
reviewer that did not write it.

Checked against the laioutr monorepo branch `feat/webhooks-reserved-path` (head `daf611950`, not merged):

- `apps/edge-protection/src/handle.ts`, `src/signedDelivery.ts`, `src/credentials.ts` and `README.md`;
- `packages/frontend-core/src/module.ts`, `src/runtime/lib/path/signedDelivery.ts`,
  `src/runtime/lib/path/resolveTrailingSlashRedirect.ts`, `src/runtime/server/middleware/laioutrRedirects.ts`,
  `src/runtime/server/middleware/0.trailingSlash.ts`, `src/runtime/server/handlers/plainNotFound.ts`;
- `packages/frontend-core/test/integration/plainNotFound.test.ts`;
- `.claude/rules/app-path-prefixing.md`;
- `docs/reviews/2026-10-27-webhooks-reserved-path-review.md` (finding I1).

The worker's predicate was run in Node's WHATWG `URL` on the edge cases (`/webhooks`, `/webhooks/`, `/webhooks//x`,
`/webhooks/x//y`, `/webhooks/./x`, `/webhooks/x/..`, `/webhooks/../checkout`, `%2F`, `%2e`, `/WEBHOOKS/x`, an
encoded `/` in the query). The rendered pages on the local dev server have the anchors the new links use
(`#what-stays-reachable`, `#paths-and-routes`, and `#preview-deployments` for the fix below). No test suite or build
was run.

## Findings

**Count:** critical 0, important 3, minor 7.

### Important

**I1. The reason to verify a webhook's signature is given as a Laioutr Cloud concern only.** Confirmed.
`content/2.apps/app-development/coding-standards.md:175` and `:203`.

Line 175 says "On Laioutr Cloud, password protection lets requests under `/webhooks/` through ... so your route checks
the signature". Line 203 says "No password stands in front of it on Laioutr Cloud, so verify the sender's signature".
Both tie the check to the Cloud exemption. The old bullet was host-agnostic ("No platform gate protects these").
Nothing checks a signature on any host: the worker forwards a delivery before reading anything
(`apps/edge-protection/src/handle.ts:57`, and README step 2 says "the Worker knows no app names"), and Frontend Core
only adds the plain-404 catch-all (`packages/frontend-core/src/module.ts:425`). A production storefront is public
everywhere, so a reader on another host, or on an unprotected Cloud hostname, can take the "so" to mean the check
matters only behind Cloud's password. Neither line says the exemption exists only at Cloud's edge.

Two smaller faults in the same sentences:

- "requests under `/webhooks/`" overstates what passes. The bare prefix, an empty segment right after it and an
  encoded `/`, `\` or `.` stay protected (`apps/edge-protection/src/signedDelivery.ts:11-12`).
- "before it reads anything else" contradicts the example on the page-index page, which has to read the raw body to
  compute the HMAC (`content/1.Frontend/4.Orchestr/page-index.md:248`).

Fix. Line 175:

> A **webhook**, a delivery that another service's server sends and signs, goes under `/webhooks/app-<name>/<webhook>`, with the same `<name>` as your other paths. Treat that path as public on every host. No platform layer checks the sender's signature, and on Laioutr Cloud [password protection](/hosting/laioutr-cloud/password-protection) lets a delivery path under `/webhooks/` through even on a protected hostname, because the sender cannot enter a password. So your route verifies the signature over the raw body before it parses the delivery or acts on it. That exemption exists only at Laioutr Cloud's edge: another host's protection does not know this prefix. A callback a browser reaches, such as an OAuth redirect, stays under `/api/app-<name>/`: it carries the visitor's protection cookie and stays behind the password.

Line 203:

> - **Inbound webhooks**: `/webhooks/app-<name>/<webhook>`. No platform layer checks the sender's signature, on any host, so verify it over the raw body before you parse the delivery or act on it.

**I2. The password-protection page states as fact that the route checks the signature.** Confirmed.
`content/4.hosting/0.laioutr-cloud/4.password-protection.md:31-32`.

"the app's route under `/webhooks/` checks that signature before it reads anything" reads as a guarantee. Nothing
enforces it: the edge forwards without inspecting the request (`handle.ts:57`), and whatever route a project or a
third-party app registers under `/webhooks/`, verified or not, answers anyone on a protected hostname. This page's
reader is the storefront owner who switches protection on, and they need to know that `/webhooks/` is as public as an
unprotected storefront. "before it reads anything" has the raw-body problem from I1 as well.

Fix. Replace the second sentence of the paragraph with:

> A service that sends webhooks from its own servers cannot enter a password; it signs each delivery instead. The edge does not check that signature. The route under `/webhooks/` has to, before it parses the delivery or acts on it, so whatever a route there answers, it answers to anyone.

**I3. The ::note leaves out replaced production deployments and rollbacks, and does not say how long a preview is
kept.** Confirmed. `content/4.hosting/0.laioutr-cloud/4.password-protection.md:39-45`.

What the note gets right, checked against the code and I1: an older build sends a path under `/webhooks/` to the
`/**` renderer, so it shows the project's 404 page with header, footer and navigation, for GET and POST, without the
password. From the reserving version on, `module.ts:425` answers it with the plain 404. A preview built before the
upgrade keeps the old behavior.

What it misses:

- **How long.** The last sentence names only previews. `content/4.hosting/0.laioutr-cloud/1.limits.md:136-140`
  keeps the last 2 replaced production deployments for 24 hours "for a rollback without a rebuild". Each keeps its
  own address, which is protected by default (`4.password-protection.md:20-21`). Rolling production back to one of
  them within those 24 hours puts the old build on the production hostnames again. "Upgrade ... and deploy it" reads
  as if that closed the window. "For as long as it exists" is accurate but gives no bound. The limits table has one:
  until a newer deployment of the same preview name replaces it, or 10 newer previews push it out.
- **For whom.** "shows a page without the password" does not say "to anyone". The sentence carries the security
  point, so it should.
- **What.** "like any other page" covers it, but the case that matters most is not named. A Studio page whose path
  starts with `/webhooks/` is served in full, with 200, by an older build. A new build no longer serves it (the
  changeset says so), and no docs page tells an editor that.
- "that no app claims": a project's own server route claims a path too. "that no route claims" is the accurate word.

Fix. Use `::warning` rather than `::note`, because this describes an exposure; keep `::note` only if the page should
keep one callout style:

```md
::warning
**A deployment built with Frontend Core before VERSION_TBD shows a page under `/webhooks/` to anyone, without the
password.** From that version on, Frontend Core answers a path under `/webhooks/` that no route claims with a plain
404, and no longer serves a Studio page there. An older build renders such a path like any other page: usually the
storefront's own 404 page with its header, footer and navigation, or the Studio page at that path if there is one.
Upgrade Frontend Core on each protected storefront and deploy it. A deployment built before the upgrade keeps this
behavior on its own address for as long as it is [kept](/hosting/laioutr-cloud/limits#preview-deployments): a
preview until a newer deployment of its name replaces it, a replaced production deployment for 24 hours. Rolling
production back to such a deployment brings it back on your hostnames.
::
```

Rotating the content preview token withdraws replaced production deployments at once (`1.limits.md:142-143`). The
owner may want that named as the way to end the 24 hours early. It is left out of the text above because rotating
the token has effects of its own.

### Minor

**M1. The example's comment says to verify "before reading the delivery", one line after the handler has read it.**
Confirmed. `content/1.Frontend/4.Orchestr/page-index.md:249`.

The HMAC needs the raw body, so `readRawBody` on line 248 has to come first. The code is right; the comment
contradicts it.

Fix:

```ts
  // Nothing else guards this path: verify the vendor's signature over the raw body before parsing it.
```

**M2. The rule for choosing a prefix no longer covers the third prefix.** Confirmed.
`content/2.apps/app-development/coding-standards.md:165` and `:173`.

Line 165 says the policy decides "not who calls it". `/webhooks/` is defined by its caller, another service's server
that signs, and line 175 keeps an OAuth callback under `/api/` because a browser with the cookie calls it. Line 173,
"A path belongs under `/api/` whenever a cached hit or a crawler hit would be wrong", also fits a webhook, which then
goes elsewhere.

Fix. Line 165:

> Your app has **three prefixes**, and the policy a path needs decides which one it takes: whether a shared cache or a crawler may see it, and whether it has to get past password protection.

First sentence of line 173, leaving the rest of the line as it is:

> Other than a signed delivery, a path belongs under `/api/` whenever a cached hit or a crawler hit would be wrong.

**M3. The Crawlers cell for `/webhooks/` uses a different vocabulary, and the robots sentence no longer covers every
app path.** Confirmed. `content/2.apps/app-development/coding-standards.md:171` and `:183`.

The column says "allowed" or "disallowed" for the other rows. "not linked" leaves the reader to work out that
nothing disallows `/webhooks/`: Frontend Core writes no robots rule (`packages/frontend-core/src` has none), and the
one line 183 names is `Disallow: /api/`. Line 183 then says that line "excludes every installed app at once", which
no longer holds for `/webhooks/app-<name>/`.

Fix. Cell on line 171: `allowed, never linked`. Line 183:

> One `Disallow: /api/` line in the project's robots.txt keeps crawlers off every installed app's `/api/` paths at once, and nothing links to `/webhooks/`. Your app writes no robots rule of its own.

**M4. The hard rule's exception names a path, not a kind of request.** Suspected (a reading risk, not a factual
error). `content/2.apps/app-development/coding-standards.md:215`.

"The one exception is `/webhooks/app-<name>/`" sits in a list someone skims for "where may I put a top-level path".
Read alone, it allows any route there. Under that prefix on Cloud, a browser-facing route would skip the password.

Fix. Replace only the appended sentence; the em-dash sentence before it is untouched and keeps its punctuation:

> The one exception is a signed delivery from another service's server, which goes under `/webhooks/app-<name>/`; nothing a browser opens goes there.

**M5. "What stays reachable" overstates what passes and leaves out the empty segment.** Confirmed.
`content/4.hosting/0.laioutr-cloud/4.password-protection.md:30` and `:36-37`.

Line 30 says "A path under `/webhooks/` ... stays reachable". Lines 36-37 list the exceptions but not the one at
`signedDelivery.ts:11-12`: an empty segment right after the prefix. `/webhooks//x` gets the password page (probe
above; `/webhooks/x//y` passes). Someone who configures a sender with a doubled slash gets 401 and finds nothing on
the page that explains it. "on every hostname" is clearer as "on every protected hostname". "in it" should say the
path, because an encoded `/` in the query does not count.

Fix. First sentence of line 30:

> A path with a segment after `/webhooks/`, such as `/webhooks/app-<name>/<webhook>`, stays reachable without the password on every protected hostname.

Lines 36-37:

> `/webhooks` and `/webhooks/` themselves are protected, and so is a path that only resembles a delivery path: one that leaves the prefix once resolved, such as `/webhooks/../checkout`, one with an empty segment right after the prefix, such as `/webhooks//x`, and one with an encoded `/`, `\` or `.` (`%2F`, `%5C`, `%2E`, in either case) anywhere in its path.

**M6. "as they came, apart from removing a bypass secret or cookie" is narrower than what the edge changes.**
Confirmed. `content/4.hosting/0.laioutr-cloud/4.password-protection.md:32-33`.

`credentials.forwarded()` (`apps/edge-protection/src/credentials.ts:29,80-87`) also removes
`x-laioutr-set-bypass-cookie` and cleans the same parameters out of the `referer`. The URL it forwards is the parsed
one, so `/webhooks/./x` arrives as `/webhooks/x`. None of this touches the body, but "as they came" is a promise a
reviewer of a signing scheme reads literally.

Fix:

> The edge passes these requests on with their method, headers and body unchanged. It only takes off the protection's own header, query parameters and cookie, and resolves `.` and `..` segments in the path.

**M7. The limits sentence says every path under `/webhooks/` skips the check.** Confirmed.
`content/4.hosting/0.laioutr-cloud/1.limits.md:164-165`.

During a protection-store outage, the bare prefix, an empty segment and an encoded path go through the KV read like
any other path and answer `503` (`handle.ts:57-66`). Only a delivery path skips it. "is not checked" in a paragraph
about outages can also read as "not checked during an outage", when it is never checked.

Fix:

> A delivery path under `/webhooks/` is never checked, so it answers as usual even then;
> [What stays reachable](/hosting/laioutr-cloud/password-protection#what-stays-reachable) says which paths count and why.

## Checked and accurate

- No sentence says or implies that `/webhooks/` bypasses protection outside Laioutr Cloud. Every exemption claim is
  scoped to Cloud or sits on a Cloud page. I1 asks for the scope to be stated outright, as well as implied.
- No sentence sends a browser-facing route to `/webhooks/`. Line 175 keeps OAuth callbacks under `/api/`, and so does
  `4.password-protection.md:35`. M4 is the only reading risk.
- `/webhooks/../checkout`, encoded `/`, `\` and `.`, and the bare `/webhooks/` are protected as the page says
  (`signedDelivery.ts:4,11-12`; probe).
- "Frontend Core answers every unmatched path under `/api/**` and `/webhooks/**` with a minimal static 404 page":
  `module.ts:425` registers `/webhooks/` and `/webhooks/**`. `plainNotFound.test.ts:13-27` covers `/webhooks`,
  `/webhooks/`, unmatched paths and a POST. "your registered route still wins" is covered by
  `plainNotFound.test.ts:41-49`.
- "Frontend Core never redirects a path under `/webhooks/`": both redirect middleware skip `isSignedDeliveryPath`
  (`resolveTrailingSlashRedirect.ts:17`, `laioutrRedirects.ts:25`), and the app plugins that redirect never run
  there, because the app does not boot. `plainNotFound.test.ts:35-39` pins the trailing-slash case.
- "The platform sets no cache header on any of these prefixes": no route rule in `packages/` sets a cache policy for
  `/webhooks/`. The plain 404's own `s-maxage` applies only to unmatched paths, as it already did for `/api/`.
- The limits page's main point is right for a delivery path: it is forwarded before the KV read, so a store outage
  does not stop it (`handle.ts:56-57`, README "It fails closed").
- Plain-text hygiene. Every added or rewritten sentence is ASCII. The only non-ASCII characters on changed lines are
  the em dashes of the untouched sentence at `coding-standards.md:215`, which keeps its punctuation as the rule asks.
  The `**Inbound webhooks**:` colon at line 203 differs from its siblings' em dashes because the sentence was
  rewritten, which is what the rule requires. No banned vocabulary or phrases.
- `.claude/rules/`: the new code block carries its path in the meta (`code-block-filename-meta.md`), no page moved,
  and no Cockpit link was added.
- No customer names in the diff. `acme` is the placeholder the page already uses.

## Not verified

- How another host's protection (for example Vercel's deployment protection) treats `/webhooks/`. That code is not in
  the monorepo. I1's replacement text says only that such protection does not know the prefix.
- Whether a project's own robots.txt disallows `/webhooks/`. Projects own that file. M3 rests only on Frontend Core
  writing no rule.
- The older-build rendering was not run. It rests on I1 of the code review ("confirmed by reasoning", with a router
  probe) and on `module.ts:425` being the only route that catches the prefix.

## Verdict

Not ready to merge: fix I1, I2 and I3 first (the scope of the signature check, the claim that the route checks it,
and the rollout window's missing rollback path); the seven minors are text replacements that fit in the same pass.
