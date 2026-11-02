/**
 * Runs the lead signup API as its own Node process (see docs/lead-signup.md).
 *
 *   npm run api:leads
 *
 * Defaults to JSON storage at ./var/miraath-guide/leads.json, listening on
 * 127.0.0.1:4301. Override with LEADS_STORAGE_DRIVER, LEADS_JSON_PATH,
 * LEADS_API_HOST, LEADS_API_PORT, LEADS_ALLOWED_ORIGINS, LEADS_TRUST_PROXY.
 * Run exactly one process per JSON file.
 */
import { mkdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { build } from 'esbuild';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'node_modules', '.cache', 'miraath-leads-api');
mkdirSync(outDir, { recursive: true });
const outfile = join(outDir, 'standalone-api.mjs');

await build({
  entryPoints: [join(root, 'src/server/leads/standalone-api.ts')],
  outfile,
  bundle: true,
  platform: 'node',
  format: 'esm',
  target: 'node18',
  packages: 'external',
  logLevel: 'warning',
});

process.env.LEADS_STORAGE_DRIVER ??= 'json';
const { startStandaloneLeadsApi } = await import(pathToFileURL(outfile).href);
startStandaloneLeadsApi();
