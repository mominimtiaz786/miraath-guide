import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const workspaceRoot = resolve(__dirname, '..');
const sitemapPath = resolve(workspaceRoot, 'public/sitemap.xml');
const siteUrl = 'https://miraath-guide.islamictools.app';

/**
 * Builds `{ path, lastmod }` entries for every slug in a data file, under the
 * given route prefix. Mirrors the prerendered `getPrerenderParams()` sources in
 * src/app/app.routes.server.ts so the sitemap stays in sync with what is built.
 */
const buildSlugUrls = (relativeDataPath, routePrefix) => {
  const dataFilePath = resolve(workspaceRoot, relativeDataPath);
  const dataFile = readFileSync(dataFilePath, 'utf8');
  const slugs = [...dataFile.matchAll(/slug:\s*'([^']+)'/g)].map((match) => match[1]);

  // Attempt to extract an optional last-modified date from each entry.
  // Supports properties named `updatedAt` or `lastModified` (string dates).
  const dateRegex = /{[\s\S]*?slug:\s*'([^']+)'[\s\S]*?(?:updatedAt|lastModified)\s*:\s*'([^']+)'[\s\S]*?}/gs;
  const slugDateMap = new Map();
  for (const m of dataFile.matchAll(dateRegex)) {
    const slug = m[1];
    const rawDate = m[2];
    // Normalize to YYYY-MM-DD when possible; otherwise ignore.
    const d = new Date(rawDate);
    if (!Number.isNaN(d.getTime())) {
      slugDateMap.set(slug, d.toISOString().split('T')[0]);
    }
  }

  let fileLastModifiedDate = null;
  try {
    const rawGitDate = execSync(`git log -1 --format=%cI -- ${relativeDataPath}`, {
      cwd: workspaceRoot,
      encoding: 'utf8',
    }).trim();
    if (rawGitDate) {
      fileLastModifiedDate = new Date(rawGitDate).toISOString().split('T')[0];
    }
  } catch {
    // If git is unavailable or the file is untracked, ignore fallback.
  }

  return slugs.map((slug) => ({
    path: `${routePrefix}/${slug}`,
    lastmod: slugDateMap.get(slug) ?? fileLastModifiedDate,
  }));
};

const staticUrls = [
  '/',
  '/calculator',
  '/common-cases',
  '/learn',
  '/about',
  '/methodology',
  '/glossary',
  '/privacy',
  '/disclaimer',
];

const lessonUrls = buildSlugUrls('src/app/data/lessons/lessons.data.ts', '/learn');
const commonCaseUrls = buildSlugUrls(
  'src/app/data/common-cases/common-cases.data.ts',
  '/common-cases'
);

// Merge static urls (without lastmod) and detail urls (with optional lastmod), preserving uniqueness
const urlMap = new Map();
for (const p of staticUrls) {
  urlMap.set(p, { path: p, lastmod: null });
}
for (const entry of [...lessonUrls, ...commonCaseUrls]) {
  if (!urlMap.has(entry.path)) {
    urlMap.set(entry.path, entry);
  }
}
const uniqueUrls = Array.from(urlMap.values());

const escapeXml = (value) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${uniqueUrls
  .map((entry) => {
    const loc = escapeXml(`${siteUrl}${entry.path}`);
    const lastmodTag = entry.lastmod ? `\n    <lastmod>${escapeXml(entry.lastmod)}</lastmod>` : '';
    return `  <url>\n    <loc>${loc}</loc>${lastmodTag}\n  </url>`;
  })
  .join('\n')}\n</urlset>\n`;

writeFileSync(sitemapPath, xml, 'utf8');
console.log(`Wrote ${uniqueUrls.length} sitemap URLs to ${sitemapPath}`);
