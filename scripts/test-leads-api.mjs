/**
 * Tests for the lead signup API (Node side; Karma only covers the browser).
 *
 *   npm run test:leads          unit + HTTP tests for src/server/leads
 *   npm run test:leads -- --e2e also runs the built SSR server (run `npm run build` first):
 *                               real process restart, PDF bytes, routing and 404s.
 *
 * Every test uses synthetic addresses in a fresh temp directory.
 */
import { spawn, spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from 'esbuild';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'node_modules', '.cache', 'miraath-leads-test');
mkdirSync(outDir, { recursive: true });
const outfile = join(outDir, 'leads.node-test.mjs');

await build({
  entryPoints: [join(root, 'src/server/leads/leads.node-test.ts')],
  outfile,
  bundle: true,
  platform: 'node',
  format: 'esm',
  target: 'node18',
  packages: 'external',
  logLevel: 'warning',
});

const unit = spawnSync(process.execPath, ['--test', outfile], { stdio: 'inherit' });
if (unit.status !== 0 || !process.argv.includes('--e2e')) {
  process.exit(unit.status ?? 1);
}

// ---------------------------------------------------------------------------
// End-to-end against dist/ (the same server bundle a Node host would run).
// ---------------------------------------------------------------------------
const serverEntry = join(root, 'dist/mirath-guide/server/server.mjs');
if (!existsSync(serverEntry)) {
  console.error('e2e: dist/mirath-guide/server/server.mjs not found - run `npm run build` first.');
  process.exit(1);
}

const dataDir = mkdtempSync(join(tmpdir(), 'miraath-leads-e2e-'));
const dataFile = join(dataDir, 'leads.json');
const port = 4300 + Math.floor(Math.random() * 500);
const base = `http://localhost:${port}`;
const failures = [];
const check = (label, condition) => {
  console.log(`${condition ? 'ok    ' : 'FAIL  '} ${label}`);
  if (!condition) failures.push(label);
};

async function withServer(env, fn) {
  const child = spawn(process.execPath, [serverEntry], {
    env: { ...process.env, PORT: String(port), NG_ALLOWED_HOSTS: 'localhost', ...env },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  let output = '';
  child.stdout.on('data', (chunk) => (output += chunk));
  child.stderr.on('data', (chunk) => (output += chunk));
  try {
    for (let i = 0; i < 100 && !output.includes('listening'); i++) {
      await new Promise((r) => setTimeout(r, 100));
    }
    await fn(() => output);
  } finally {
    child.kill('SIGTERM');
    await new Promise((r) => child.once('exit', r));
  }
}

const signup = (email) =>
  fetch(`${base}/api/leads`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Origin: base },
    body: JSON.stringify({
      email,
      consent: true,
      resourceId: 'family-inheritance-starter-kit',
      source: 'inheritance-guide',
      locale: 'en',
    }),
  });

try {
  const jsonEnv = { LEADS_STORAGE_DRIVER: 'json', LEADS_JSON_PATH: dataFile };

  await withServer(jsonEnv, async (output) => {
    check('startup log names the JSON file path', output().includes(dataFile));
    check('first signup saved (200)', (await signup('reader@example.com')).status === 200);
    check('startup log never prints an email', !output().includes('reader@example.com'));

    const pdf = await fetch(`${base}/downloads/family-inheritance-starter-kit.pdf`);
    const bytes = Buffer.from(await pdf.arrayBuffer());
    const original = readFileSync(join(root, 'public/downloads/family-inheritance-starter-kit.pdf'));
    check('PDF served with 200 and application/pdf', pdf.status === 200 && /application\/pdf/.test(pdf.headers.get('content-type') ?? ''));
    check('PDF bytes identical to the source file', createHash('sha256').update(bytes).digest('hex') === createHash('sha256').update(original).digest('hex'));

    for (const path of ['/inheritance-guide', '/ur/inheritance-guide', '/ar/inheritance-guide', '/hi/inheritance-guide', '/fr/inheritance-guide']) {
      const page = await fetch(`${base}${path}`);
      const html = await page.text();
      check(`${path} returns 200 with the PDF link`, page.status === 200 && html.includes('href="/downloads/family-inheritance-starter-kit.pdf"'));
    }
    check('unknown route still returns 404', (await fetch(`${base}/no-such-page`)).status === 404);
    check('unknown locale route still returns 404', (await fetch(`${base}/ur/no-such-page`)).status === 404);
    check('calculator page still returns 200', (await fetch(`${base}/calculator`)).status === 200);
  });

  // A genuine process restart: the earlier record must still be there.
  await withServer(jsonEnv, async () => {
    check('second signup after restart saved (200)', (await signup('second@example.com')).status === 200);
    check('repeat signup after restart answers 200', (await signup('Reader@Example.com')).status === 200);
  });
  const doc = JSON.parse(readFileSync(dataFile, 'utf8'));
  check('both records persisted across restart, no duplicate', doc.leads.length === 2);

  await withServer({ LEADS_STORAGE_DRIVER: '' }, async () => {
    const response = await signup('third@example.com');
    check('storage disabled answers 503 JSON', response.status === 503 && (await response.json()).error === 'unavailable');
    check('PDF still downloadable when storage is disabled', (await fetch(`${base}/downloads/family-inheritance-starter-kit.pdf`)).status === 200);
  });
} finally {
  rmSync(dataDir, { recursive: true, force: true });
}

if (failures.length) {
  console.error(`\n${failures.length} e2e check(s) failed.`);
  process.exit(1);
}
console.log('\nAll e2e checks passed.');
