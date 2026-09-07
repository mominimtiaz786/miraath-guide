import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const workspaceRoot = resolve(__dirname, '..');
const sitemapPath = resolve(workspaceRoot, 'public/sitemap.xml');
const siteUrl = 'https://miraath-guide.islamictools.app';

const locales = [
  { code: 'en', prefix: '' },
  { code: 'ur', prefix: '/ur' },
  { code: 'hi', prefix: '/hi' },
  { code: 'fr', prefix: '/fr' },
  { code: 'ar', prefix: '/ar' },
];

const localizePath = (path, locale) => {
  if (locale.code === 'en') return path;
  return path === '/' ? `${locale.prefix}/` : `${locale.prefix}${path}`;
};

const lastModifiedForFile = (relativeDataPath) => {
  try {
    const rawGitDate = execSync(`git log -1 --format=%cI -- ${relativeDataPath}`, {
      cwd: workspaceRoot,
      encoding: 'utf8',
    }).trim();
    return rawGitDate ? new Date(rawGitDate).toISOString().split('T')[0] : null;
  } catch {
    return null;
  }
};

const buildSlugFamilies = (relativeDataPath, routePrefix) => {
  const dataFilePath = resolve(workspaceRoot, relativeDataPath);
  const dataFile = readFileSync(dataFilePath, 'utf8');
  const slugs = [...dataFile.matchAll(/slug:\s*'([^']+)'/g)].map((match) => match[1]);
  const fileLastmod = lastModifiedForFile(relativeDataPath);
  return slugs.map((slug) => ({
    path: `${routePrefix}/${slug}`,
    lastmod: fileLastmod,
  }));
};

const staticFamilies = [
  '/',
  '/calculator',
  '/common-cases',
  '/learn',
  '/about',
  '/methodology',
  '/glossary',
  '/privacy',
  '/disclaimer',
].map((path) => ({ path, lastmod: null }));

const families = [
  ...staticFamilies,
  ...buildSlugFamilies('src/app/data/lessons/lessons.data.ts', '/learn'),
  ...buildSlugFamilies('src/app/data/common-cases/common-cases.data.ts', '/common-cases'),
];

const escapeXml = (value) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

const alternateTags = (familyPath) =>
  [
    ...locales.map((locale) => ({
      hreflang: locale.code,
      href: `${siteUrl}${localizePath(familyPath, locale)}`,
    })),
    { hreflang: 'x-default', href: `${siteUrl}${localizePath(familyPath, locales[0])}` },
  ]
    .map(
      (alt) =>
        `    <xhtml:link rel="alternate" hreflang="${escapeXml(alt.hreflang)}" href="${escapeXml(alt.href)}" />`,
    )
    .join('\n');

const entries = families.flatMap((family) =>
  locales.map((locale) => ({
    familyPath: family.path,
    loc: `${siteUrl}${localizePath(family.path, locale)}`,
    lastmod: family.lastmod,
  })),
);

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${entries
  .map((entry) => {
    const lastmodTag = entry.lastmod ? `\n    <lastmod>${escapeXml(entry.lastmod)}</lastmod>` : '';
    return `  <url>\n    <loc>${escapeXml(entry.loc)}</loc>${lastmodTag}\n${alternateTags(entry.familyPath)}\n  </url>`;
  })
  .join('\n')}\n</urlset>\n`;

writeFileSync(sitemapPath, xml, 'utf8');
console.log(`Wrote ${entries.length} localized sitemap URLs to ${sitemapPath}`);
