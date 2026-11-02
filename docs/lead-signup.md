# Inheritance guide page and optional email signup

`/inheritance-guide` (and `/ur`, `/ar`, `/hi`, `/fr` equivalents) offers the free
Family Inheritance Starter Kit PDF and an optional "keep me updated" form.

| What | Where |
| --- | --- |
| Landing page | `src/app/features/inheritance-guide/` |
| PDF (unchanged original, English only) | `public/downloads/family-inheritance-starter-kit.pdf` → `/downloads/family-inheritance-starter-kit.pdf` |
| Cover preview | `public/images/inheritance-guide/` (rendered from page 1 of the PDF) |
| HTTP contract shared by client and server | `src/app/features/inheritance-guide/lead-signup.contract.ts` |
| API, validation, rate limiting | `src/server/leads/leads-api.ts` |
| Storage interface | `src/server/leads/lead-repository.ts` |
| JSON storage | `src/server/leads/json-lead-repository.ts` |
| Configuration | `src/server/leads/leads-config.ts` |
| Standalone API process | `src/server/leads/standalone-api.ts`, started by `scripts/leads-api.mjs` |

The download never depends on the form. The form only records consent to
receive future Miraath Guide resources and updates; nothing is emailed.

## Where emails are stored

"Local JSON" means **one private file on the disk of the machine running the
Node API** - not the visitor's browser, not `public/`, not the build output,
and never committed. Default: `./var/miraath-guide/leads.json`, resolved from
the API process's working directory. The absolute path is printed at startup
(emails are never logged). The directory is created `0700` and the file `0600`.

`/var/`, `leads.json` and temp files are git-ignored. The API refuses (and
disables storage) if `LEADS_JSON_PATH` points inside `public/`, `src/` or `dist/`.

Integrity guarantees (see `json-lead-repository.ts`):

- A fresh document is created only when the file does not exist. Empty,
  malformed or wrong-schema files are never overwritten - the request fails
  with `500 storage_error` and the file is left as it was.
- Writes go to a temp file in the same directory, are fsynced, then atomically
  renamed; the API answers success only after that.
- Read-modify-write is serialized by an in-process queue. **Run exactly one API
  process per JSON file** - there is no inter-process lock.

Back the file up like any other personal data, and restrict who can read it.

## Configuration

| Variable | Default | Meaning |
| --- | --- | --- |
| `LEADS_STORAGE_DRIVER` | `none` | `json` enables storage. Anything else: `POST /api/leads` answers `503 unavailable`. (`npm run api:leads` defaults this to `json`.) |
| `LEADS_JSON_PATH` | `./var/miraath-guide/leads.json` | JSON file location, relative to the process working directory. |
| `LEADS_ALLOWED_ORIGINS` | `https://miraath-guide.islamictools.app` | Comma-separated exact origins allowed to POST. Requests whose `Origin` host equals the request `Host` are always allowed (covers local dev). |
| `LEADS_TRUST_PROXY` | unset | Express `trust proxy` value (`1`, `loopback`, an IP). Set it only behind a known proxy; `true` is rejected because it would trust any `X-Forwarded-For`. |
| `LEADS_RATE_LIMIT_MAX` / `LEADS_RATE_LIMIT_WINDOW_MS` | `10` / `900000` | Per-IP fixed-window limit (in memory, single instance). |
| `LEADS_API_HOST` / `LEADS_API_PORT` | `127.0.0.1` / `4301` | Standalone API process only. |

## Setup matrix

| Mode | Page + PDF | Signup storage | How |
| --- | --- | --- | --- |
| Local development | `ng serve` | JSON on your machine | Terminal 1: `npm run api:leads`. Terminal 2: `npm run start:leads` (`ng serve` with `proxy.conf.json`, forwarding `/api` to `127.0.0.1:4301`). Plain `npm start` works too, but the form then reports that it couldn't save. |
| Local production build | `npm run build` then `npm run serve:ssr:leads` | JSON on your machine | The SSR server in `src/server.ts` mounts the API itself, same origin. |
| Persistent Node host (VPS, container with a volume) | SSR server | JSON on that host's persistent disk | Run `dist/mirath-guide/server/server.mjs` with `LEADS_STORAGE_DRIVER=json` and a `LEADS_JSON_PATH` on persistent storage, behind one reverse proxy (`LEADS_TRUST_PROXY=1`). One instance only. |
| **Current Vercel deployment** | Works after a normal deploy (prerendered page, static PDF) | **Not available** | See below. |

Note: `ng serve` does **not** run the Express routes in `src/server.ts` (verified:
it answers `POST /api/leads` with the Angular 404 page), which is why the dev
proxy and standalone process exist.

### The Vercel constraint

The site is deployed to Vercel as static/prerendered files (`vercel.json`:
filesystem routes, then a real 404). Nothing on that deployment runs
`src/server.ts`, so `POST /api/leads` hits the 404 fallback and the form shows
"We couldn't save your email right now… Your workbook is still available to
download." It never reports a fake success. A Vercel Function would not fix
this with JSON: its filesystem is read-only apart from a temporary `/tmp`, so
nothing written there is durable or shared.

Before collecting real emails publicly, choose one:

1. **Persistent Node API host.** Run `npm run api:leads` (or the full SSR
   server) on a host with a persistent disk, then route `/api/leads` to it - for
   example a Vercel rewrite placed before the 404 fallback in `vercel.json`:
   `{ "src": "/api/leads", "dest": "https://<your-api-host>/api/leads" }`.
   Keep the site origin in `LEADS_ALLOWED_ORIGINS` and verify the deployed
   routing with a real request.
2. **The future Google Sheets repository** (below), behind a serverless function.

Also before going live: the privacy policy promises removal "through the
contact route on our About page", but the About page's contact section is
still a placeholder. Publish a real contact route first.

## HTTP contract

`POST /api/leads`, `Content-Type: application/json`, body ≤ 4 KB:

```json
{
  "email": "reader@example.com",
  "consent": true,
  "resourceId": "family-inheritance-starter-kit",
  "source": "inheritance-guide",
  "locale": "en",
  "attribution": { "utm_source": "instagram", "utm_medium": "dm", "utm_campaign": "inheritance_starter_kit" },
  "website": ""
}
```

Responses are JSON with `Cache-Control: no-store`: `200 {"ok":true}` for both new
and repeat signups (so existence is never revealed); `400` `invalid_request`,
`invalid_email`, `consent_required`, `unsupported_resource`, `invalid_locale`;
`403 forbidden_origin`; `405` for other methods; `413`; `415`; `429` with
`Retry-After`; `500 storage_error`; `503 unavailable`. There is no read, list or
export endpoint. A non-empty `website` honeypot gets `200` and is not stored.

The server, not the client, sets `resourceVersion` (`1.0`, the PDF's edition)
and the consent wording ID (`inheritance-guide-updates-v1`). Only the five UTM
keys survive, each ≤ 100 plain characters. Emails are trimmed and lowercased;
plus-addressing is kept. Records are unique per (email, resourceId).

If you change the consent sentence in the locale files, bump
`consentTextVersion` in `leads-api.ts` so stored records still identify the
wording each person agreed to.

## Stored record

See `docs/leads.example.json` (synthetic). Each lead has `id`, `email`,
`resourceId`, `resourceVersion`, `source`, `locale`, `createdAt`, `updatedAt`,
`consent { updates, textVersion, capturedAt }` and optional first-touch
`attribution`. Timestamps are UTC ISO-8601.

## Migrating to Google Sheets later

Implement `LeadRepository` from `src/server/leads/lead-repository.ts`:

```ts
export interface LeadRepository {
  upsertResourceSignup(input: ResourceSignupInput): Promise<void>;
}
```

`ResourceSignupInput` is already validated and normalized by the HTTP layer:
`email`, `resourceId`, `resourceVersion`, `source`, `locale`,
`consent { updates: true, textVersion, capturedAt }`, `attribution?` (UTM keys).
A Sheets adapter should look up the row by (email, resourceId), update
`updatedAt`/`locale`/`consent` on a repeat, otherwise append a row with a new
`id` and `createdAt`; resolve only after the API confirms the write, and throw
`LeadStorageError` on failure so the visitor sees an honest error. Wire it in
where `JsonLeadRepository` is constructed (`src/server.ts`,
`standalone-api.ts`), selected by a new `LEADS_STORAGE_DRIVER` value. The page,
the contract and the HTTP responses stay the same. To migrate existing JSON
records, read `leads.json` and call the adapter for each lead.

## Analytics

The page reuses the Google tag already in `src/index.html` via
`AnalyticsService`. Events: `inheritance_guide_view`,
`inheritance_guide_pdf_click` (`placement`, `action`: a click, not a completed
download), `inheritance_guide_signup_saved` (only after the API confirms),
`inheritance_guide_calculator_click`. Parameters are limited to locale and
placement - never an email, hash, family detail or query string.

## Tests

```bash
npm run test:leads            # storage + HTTP tests (node:test, temp dirs, synthetic emails)
npm run build && npm run test:leads -- --e2e   # also: real process restart, PDF bytes, routes, 404s, 503
npx ng test --watch=false --browsers=ChromeHeadless   # includes the page component spec
```
