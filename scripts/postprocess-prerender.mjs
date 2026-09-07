import { copyFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const workspaceRoot = resolve(__dirname, '..');
const distBrowserRoot = resolve(workspaceRoot, 'dist/mirath-guide/browser');

const notFoundSource = resolve(distBrowserRoot, '404', 'index.html');
const notFoundTarget = resolve(distBrowserRoot, '404.html');

if (existsSync(notFoundSource)) {
  copyFileSync(notFoundSource, notFoundTarget);
  console.log(`Copied 404 page to ${notFoundTarget}`);
} else {
  console.warn(`Missing prerendered 404 page: ${notFoundSource}`);
}

console.log('Postprocess complete.');
