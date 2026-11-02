/**
 * Node-side tests for the lead signup API and JSON storage.
 * Run with `npm run test:leads` (bundled by scripts/test-leads-api.mjs).
 * Uses synthetic addresses and a fresh temp directory per test - never real data.
 */
import assert from 'node:assert/strict';
import { mkdtempSync, promises as fs, readdirSync, rmSync, statSync } from 'node:fs';
import { AddressInfo } from 'node:net';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { after, describe, it } from 'node:test';
import express from 'express';
import { JsonLeadRepository, LeadDocument } from './json-lead-repository';
import { LeadRepository, LeadStorageError, ResourceSignupInput } from './lead-repository';
import { createLeadsApi } from './leads-api';
import { readLeadsConfig } from './leads-config';

const roots: string[] = [];
after(() => roots.forEach((root) => rmSync(root, { recursive: true, force: true })));

function tempFile(): string {
  const root = mkdtempSync(join(tmpdir(), 'miraath-leads-'));
  roots.push(root);
  return join(root, 'data', 'leads.json');
}

const input = (email: string, overrides: Partial<ResourceSignupInput> = {}): ResourceSignupInput => ({
  email,
  resourceId: 'family-inheritance-starter-kit',
  resourceVersion: '1.0',
  source: 'inheritance-guide',
  locale: 'en',
  consent: { updates: true, textVersion: 'inheritance-guide-updates-v1', capturedAt: new Date().toISOString() },
  ...overrides,
});

const readDoc = async (path: string): Promise<LeadDocument> => JSON.parse(await fs.readFile(path, 'utf8'));
const leftoverTempFiles = (path: string): string[] =>
  readdirSync(join(path, '..')).filter((name) => name.endsWith('.tmp'));

describe('JsonLeadRepository', () => {
  it('creates a private file on first write and survives a restart', async () => {
    const path = tempFile();
    await new JsonLeadRepository(path).upsertResourceSignup(input('reader@example.com'));

    const doc = await readDoc(path);
    assert.equal(doc.schemaVersion, 1);
    assert.equal(doc.leads.length, 1);
    assert.match(doc.leads[0].id, /^[0-9a-f-]{36}$/);
    if (process.platform !== 'win32') {
      assert.equal(statSync(path).mode & 0o777, 0o600);
      assert.equal(statSync(join(path, '..')).mode & 0o777, 0o700);
    }

    // A new instance stands in for a restarted API process.
    await new JsonLeadRepository(path).upsertResourceSignup(input('second@example.com'));
    assert.deepEqual(
      (await readDoc(path)).leads.map((lead) => lead.email),
      ['reader@example.com', 'second@example.com'],
    );
    assert.deepEqual(leftoverTempFiles(path), []);
  });

  it('deduplicates by normalized email and resource, keeping createdAt and first-touch attribution', async () => {
    const path = tempFile();
    let clock = new Date('2026-11-02T10:00:00.000Z');
    const repo = new JsonLeadRepository(path, () => clock);
    await repo.upsertResourceSignup(input('reader@example.com', { attribution: { utm_source: 'instagram' } }));
    clock = new Date('2026-11-03T10:00:00.000Z');
    await repo.upsertResourceSignup(input('  Reader@Example.COM ', { locale: 'ur', attribution: { utm_source: 'other' } }));
    await repo.upsertResourceSignup(input('reader+kit@example.com'));

    const { leads } = await readDoc(path);
    assert.equal(leads.length, 2, 'plus-addressing is a distinct address');
    const [first] = leads;
    assert.equal(first.createdAt, '2026-11-02T10:00:00.000Z');
    assert.equal(first.updatedAt, '2026-11-03T10:00:00.000Z');
    assert.equal(first.locale, 'ur');
    assert.deepEqual(first.attribution, { utm_source: 'instagram' });
    assert.equal(leads[1].email, 'reader+kit@example.com');
  });

  it('does not lose records under concurrent writes', async () => {
    const path = tempFile();
    const repo = new JsonLeadRepository(path);
    await Promise.all(Array.from({ length: 60 }, (_, i) => repo.upsertResourceSignup(input(`reader${i}@example.com`))));
    const { leads } = await readDoc(path);
    assert.equal(leads.length, 60);
    assert.equal(new Set(leads.map((lead) => lead.email)).size, 60);
    assert.deepEqual(leftoverTempFiles(path), []);
  });

  for (const [label, content] of [
    ['malformed JSON', '{"schemaVersion": 1, "leads": [ '],
    ['an empty file', ''],
    ['the wrong schema', '{"schemaVersion": 2, "leads": []}'],
    ['an invalid record', '{"schemaVersion": 1, "leads": [{"email": "x@example.com"}]}'],
  ] as const) {
    it(`refuses to modify ${label} and leaves it untouched`, async () => {
      const path = tempFile();
      await fs.mkdir(join(path, '..'), { recursive: true });
      await fs.writeFile(path, content);
      await assert.rejects(
        new JsonLeadRepository(path).upsertResourceSignup(input('reader@example.com')),
        (error: unknown) => error instanceof LeadStorageError && error.code === 'corrupt',
      );
      assert.equal(await fs.readFile(path, 'utf8'), content);
    });
  }

  it('reports an unwritable directory as an io error and preserves existing data', { skip: process.getuid?.() === 0 }, async () => {
    const path = tempFile();
    const repo = new JsonLeadRepository(path);
    await repo.upsertResourceSignup(input('reader@example.com'));
    const before = await fs.readFile(path, 'utf8');
    await fs.chmod(join(path, '..'), 0o500);
    try {
      await assert.rejects(
        repo.upsertResourceSignup(input('second@example.com')),
        (error: unknown) => error instanceof LeadStorageError && error.code === 'io',
      );
    } finally {
      await fs.chmod(join(path, '..'), 0o700);
    }
    assert.equal(await fs.readFile(path, 'utf8'), before);
    // The queue keeps working after a failure.
    await repo.upsertResourceSignup(input('third@example.com'));
    assert.equal((await readDoc(path)).leads.length, 2);
  });
});

describe('readLeadsConfig', () => {
  it('is disabled by default and resolves the default path from cwd', () => {
    const config = readLeadsConfig({ env: {}, cwd: '/srv/app' });
    assert.equal(config.driver, 'none');
    assert.equal(config.jsonPath, '/srv/app/var/miraath-guide/leads.json');
    assert.deepEqual(config.allowedOrigins, ['https://miraath-guide.islamictools.app']);
  });

  it('refuses a path inside public assets or build output', () => {
    for (const path of ['./public/leads.json', './dist/mirath-guide/browser/leads.json']) {
      const config = readLeadsConfig({ env: { LEADS_STORAGE_DRIVER: 'json', LEADS_JSON_PATH: path }, cwd: '/srv/app' });
      assert.equal(config.driver, 'none', path);
      assert.equal(config.problems.length, 1);
    }
  });

  it('never trusts every proxy', () => {
    assert.equal(readLeadsConfig({ env: { LEADS_TRUST_PROXY: 'true' }, cwd: '/srv' }).trustProxy, undefined);
    assert.equal(readLeadsConfig({ env: { LEADS_TRUST_PROXY: '1' }, cwd: '/srv' }).trustProxy, 1);
  });
});

describe('POST /api/leads', () => {
  const ORIGIN = 'https://miraath-guide.islamictools.app';

  async function startApi(repository: LeadRepository | null, rateLimitMax = 100) {
    const app = express();
    app.use(
      '/api',
      createLeadsApi({ config: { allowedOrigins: [ORIGIN], rateLimit: { max: rateLimitMax, windowMs: 60_000 } }, repository }),
    );
    app.use((_req, res) => res.status(404).type('html').send('<!doctype html><p>Angular 404</p>'));
    const server = app.listen(0);
    await new Promise((resolve) => server.once('listening', resolve));
    const base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
    after(() => server.close());
    return base;
  }

  const body = (overrides: Record<string, unknown> = {}) =>
    JSON.stringify({
      email: 'reader@example.com',
      consent: true,
      resourceId: 'family-inheritance-starter-kit',
      source: 'inheritance-guide',
      locale: 'en',
      ...overrides,
    });

  const post = (base: string, payload: string, headers: Record<string, string> = {}) =>
    fetch(`${base}/api/leads`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Origin: ORIGIN, ...headers },
      body: payload,
    });

  it('stores a valid signup with server-controlled versions and sanitized attribution', async () => {
    const path = tempFile();
    const base = await startApi(new JsonLeadRepository(path));
    const response = await post(
      base,
      body({
        email: ' Reader+Kit@Example.com ',
        locale: 'ur',
        resourceVersion: '99',
        consentTextVersion: 'forged',
        attribution: { utm_source: 'instagram', utm_medium: 'dm', utm_campaign: '<script>', referrer: 'https://x.test', utm_term: 'a'.repeat(101) },
        familyDetails: { sons: 2 },
      }),
    );
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { ok: true });
    assert.equal(response.headers.get('cache-control'), 'no-store');
    assert.equal(response.headers.get('access-control-allow-origin'), null);

    const [lead] = (await readDoc(path)).leads;
    assert.equal(lead.email, 'reader+kit@example.com');
    assert.equal(lead.locale, 'ur');
    assert.equal(lead.resourceVersion, '1.0');
    assert.equal(lead.consent.textVersion, 'inheritance-guide-updates-v1');
    assert.deepEqual(lead.attribution, { utm_source: 'instagram', utm_medium: 'dm' });
    assert.deepEqual(Object.keys(lead).sort(), [
      'attribution', 'consent', 'createdAt', 'email', 'id', 'locale', 'resourceId', 'resourceVersion', 'source', 'updatedAt',
    ]);
  });

  it('answers a repeat signup identically without duplicating it', async () => {
    const path = tempFile();
    const base = await startApi(new JsonLeadRepository(path));
    const first = await post(base, body());
    const second = await post(base, body({ email: 'READER@example.com' }));
    assert.equal(first.status, second.status);
    assert.deepEqual(await first.json(), await second.json());
    assert.equal((await readDoc(path)).leads.length, 1);
  });

  it('rejects invalid input without touching storage', async () => {
    const path = tempFile();
    const base = await startApi(new JsonLeadRepository(path));
    const cases: [string, number, string][] = [
      [body({ email: 'not-an-email' }), 400, 'invalid_email'],
      [body({ email: 'a@b' }), 400, 'invalid_email'],
      [body({ email: 42 }), 400, 'invalid_email'],
      [body({ consent: false }), 400, 'consent_required'],
      [body({ consent: 'true' }), 400, 'consent_required'],
      [body({ resourceId: 'something-else' }), 400, 'unsupported_resource'],
      [body({ source: 'elsewhere' }), 400, 'unsupported_resource'],
      [body({ locale: 'de' }), 400, 'invalid_locale'],
      ['[1, 2]', 400, 'invalid_request'],
      ['{"email": ', 400, 'invalid_request'],
      [body({ padding: 'x'.repeat(5000) }), 413, 'payload_too_large'],
    ];
    for (const [payload, status, error] of cases) {
      const response = await post(base, payload);
      assert.equal(response.status, status, payload.slice(0, 60));
      assert.deepEqual(await response.json(), { ok: false, error });
    }
    await assert.rejects(fs.access(path), 'no file should have been created');
  });

  it('only accepts JSON from allowed origins', async () => {
    const path = tempFile();
    const base = await startApi(new JsonLeadRepository(path));
    assert.equal((await post(base, body(), { Origin: 'https://evil.example' })).status, 403);
    assert.equal((await post(base, body(), { Origin: 'null' })).status, 403);
    const noOrigin = await fetch(`${base}/api/leads`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: body() });
    assert.equal(noOrigin.status, 403);
    // Same host as the request is always allowed (covers local development).
    assert.equal((await post(base, body(), { Origin: base })).status, 200);
    const form = await post(base, 'email=reader%40example.com', { 'Content-Type': 'application/x-www-form-urlencoded' });
    assert.equal(form.status, 415);
  });

  it('accepts a honeypot submission silently without storing it', async () => {
    const path = tempFile();
    const base = await startApi(new JsonLeadRepository(path));
    const response = await post(base, body({ website: 'https://spam.example' }));
    assert.equal(response.status, 200);
    await assert.rejects(fs.access(path));
  });

  it('rate-limits repeated requests from one client', async () => {
    const base = await startApi(new JsonLeadRepository(tempFile()), 3);
    for (let i = 0; i < 3; i++) {
      assert.equal((await post(base, body({ email: `r${i}@example.com` }))).status, 200);
    }
    const limited = await post(base, body({ email: 'r9@example.com' }));
    assert.equal(limited.status, 429);
    assert.ok(Number(limited.headers.get('retry-after')) > 0);
    assert.deepEqual(await limited.json(), { ok: false, error: 'rate_limited' });
  });

  it('answers 503 when storage is not configured', async () => {
    const base = await startApi(null);
    const response = await post(base, body());
    assert.equal(response.status, 503);
    assert.deepEqual(await response.json(), { ok: false, error: 'unavailable' });
  });

  it('answers 500 and preserves a corrupt file', async () => {
    const path = tempFile();
    await fs.mkdir(join(path, '..'), { recursive: true });
    await fs.writeFile(path, 'not json');
    const base = await startApi(new JsonLeadRepository(path));
    const response = await post(base, body());
    assert.equal(response.status, 500);
    assert.deepEqual(await response.json(), { ok: false, error: 'storage_error' });
    assert.equal(await fs.readFile(path, 'utf8'), 'not json');
  });

  it('never falls through to HTML and exposes no read endpoint', async () => {
    const base = await startApi(new JsonLeadRepository(tempFile()));
    const get = await fetch(`${base}/api/leads`);
    assert.equal(get.status, 405);
    assert.equal(get.headers.get('allow'), 'POST');
    assert.match(get.headers.get('content-type') ?? '', /application\/json/);
    const unknown = await fetch(`${base}/api/leads/export`);
    assert.equal(unknown.status, 404);
    assert.deepEqual(await unknown.json(), { ok: false, error: 'not_found' });
  });
});
