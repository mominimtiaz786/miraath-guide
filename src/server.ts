import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readFileSync } from 'node:fs';
import { LESSONS } from './app/data/lessons/lessons.data';
import { COMMON_CASES } from './app/data/common-cases/common-cases.data';
import { PREFIXED_LOCALE_CODES } from './app/i18n/config/locale.config';
import { createLeadsApi } from './server/leads/leads-api';
import { describeLeadsConfig, readLeadsConfig } from './server/leads/leads-config';
import { JsonLeadRepository } from './server/leads/json-lead-repository';

const serverDistFolder = dirname(fileURLToPath(import.meta.url));
const browserDistFolder = resolve(serverDistFolder, '../browser');

const app = express();
// The Node engine below is what reads the `RenderMode`/status configuration
// declared in `app.routes.server.ts` (prerender vs. SSR vs. client-only, and
// the 404 status for unmatched paths) - the legacy CommonEngine API does not
// consult that route table at request time.
const angularNodeAppEngine = new AngularNodeAppEngine();

/**
 * Optional resource-updates signup (POST /api/leads). Mounted before static
 * files and the Angular handler so API errors are always JSON. Storage is
 * off unless LEADS_STORAGE_DRIVER=json; see docs/lead-signup.md. Reading the
 * config touches no files, so build/prerender never creates lead data.
 */
const leadsConfig = readLeadsConfig({ forbiddenRoots: [browserDistFolder, serverDistFolder] });
leadsConfig.problems.forEach((problem) => console.warn(`[leads] ${problem}`));
if (leadsConfig.driver !== 'none') {
  console.log(describeLeadsConfig(leadsConfig));
}
if (leadsConfig.trustProxy !== undefined) {
  app.set('trust proxy', leadsConfig.trustProxy);
}
app.use(
  '/api',
  createLeadsApi({
    config: leadsConfig,
    repository: leadsConfig.driver === 'json' ? new JsonLeadRepository(leadsConfig.jsonPath) : null,
  }),
);

/**
 * Downloadable resources keep their filename across editions, so they get a
 * short cache lifetime instead of the year-long one used for hashed bundles.
 */
app.use(
  '/downloads',
  express.static(resolve(browserDistFolder, 'downloads'), {
    maxAge: '1h',
    index: false,
    redirect: false,
  }),
);

/**
 * Serve static files from /browser. `index: false` and `redirect: false` so
 * a request for a directory-shaped route (e.g. `/calculator`) is resolved by
 * the Angular engine below instead of Express issuing a 301 to `/calculator/`.
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

// If a request targets a /learn/:slug that doesn't exist in LESSONS,
// serve the prerendered 404 page with an actual 404 status. This ensures
// invalid lesson slugs do not render a false 200 with stale metadata.
app.use((req, res, next) => {
  const localePattern = `(?:${PREFIXED_LOCALE_CODES.join('|')})`;
  const detailMatch = req.path.match(new RegExp(`^/(?:${localePattern}/)?(learn|common-cases)/([^/]+)/?$`));
  if (!detailMatch) {
    next();
    return;
  }

  const [, section, slug] = detailMatch;
  const exists =
    section === 'learn'
      ? LESSONS.some((lesson) => lesson.slug === slug)
      : COMMON_CASES.some((commonCase) => commonCase.slug === slug);

  if (exists) {
    next();
    return;
  }

  const notFoundHtml = resolve(browserDistFolder, '404', 'index.html');
  try {
    const body = readFileSync(notFoundHtml, 'utf8');
    res.status(404).type('html').send(body);
  } catch {
    next();
  }
});

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use('/**', (req, res, next) => {
  angularNodeAppEngine
    .handle(req)
    .then((response) => (response ? writeResponseToNodeResponse(response, res) : next()))
    .catch(next);
});

/**
 * Start the server if this module is the main entry point.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4200.
 */
if (isMainModule(import.meta.url)) {
  const port = process.env['PORT'] || 4200;
  app.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
    if (leadsConfig.driver === 'none') {
      console.log(describeLeadsConfig(leadsConfig));
    }
  });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Node Express server.
 */
export default createNodeRequestHandler(app);
