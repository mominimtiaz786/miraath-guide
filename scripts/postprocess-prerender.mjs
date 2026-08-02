import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const workspaceRoot = resolve(__dirname, '..');
const distBrowserRoot = resolve(workspaceRoot, 'dist/mirath-guide/browser');
const lessonsFilePath = resolve(workspaceRoot, 'src/app/data/lessons/lessons.data.ts');
const siteUrl = 'https://miraath-guide.islamictools.app';

const lessonsFile = readFileSync(lessonsFilePath, 'utf8');
const slugMatches = [...lessonsFile.matchAll(/slug:\s*'([^']+)'/g)];
const slugs = slugMatches.map((m) => m[1]);

function escapeHtml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

for (const slug of slugs) {
  const htmlPath = resolve(distBrowserRoot, 'learn', slug, 'index.html');
  if (!existsSync(htmlPath)) {
    console.warn(`Skipping missing prerendered file: ${htmlPath}`);
    continue;
  }
  let html = readFileSync(htmlPath, 'utf8');

  // Extract title and description from the prerendered HTML when available
  const titleMatch = html.match(/<title>([^<]+)<\/title>/);
  const descMatch = html.match(/<meta name="description" content="([^"]*)"\s*\/?>/);
  const title = titleMatch ? titleMatch[1] : '';
  const description = descMatch ? descMatch[1] : '';
  const canonical = `${siteUrl}/learn/${slug}`;

  // Remove existing tags if present to avoid duplicates
  html = html.replace(/<link[^>]+rel=["']canonical["'][^>]*>\s*/i, '');
  html = html.replace(/<meta[^>]+property=["']og:[^"']+["'][^>]*>\s*/gi, '');
  html = html.replace(/<meta[^>]+name=["']twitter:[^"']+["'][^>]*>\s*/gi, '');

  const ogTags = [];
  ogTags.push(`<link rel="canonical" href="${escapeHtml(canonical)}">`);
  ogTags.push(`<meta property="og:type" content="article">`);
  if (title) ogTags.push(`<meta property="og:title" content="${escapeHtml(title)}">`);
  if (description) ogTags.push(`<meta property="og:description" content="${escapeHtml(description)}">`);
  ogTags.push(`<meta property="og:url" content="${escapeHtml(canonical)}">`);
  ogTags.push(`<meta property="og:site_name" content="Miraath Guide">`);
  ogTags.push(`<meta name="twitter:card" content="summary_large_image">`);
  if (title) ogTags.push(`<meta name="twitter:title" content="${escapeHtml(title)}">`);
  if (description) ogTags.push(`<meta name="twitter:description" content="${escapeHtml(description)}">`);

  // Insert tags just before closing </head>
  html = html.replace(/<\/head>/i, `${ogTags.join('\n    ')}\n</head>`);

  writeFileSync(htmlPath, html, 'utf8');
  console.log(`Injected SEO meta into ${htmlPath}`);
}

console.log('Postprocess complete.');
