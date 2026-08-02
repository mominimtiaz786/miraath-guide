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

const serverDistFolder = dirname(fileURLToPath(import.meta.url));
const browserDistFolder = resolve(serverDistFolder, '../browser');

const app = express();
// The Node engine below is what reads the `RenderMode`/status configuration
// declared in `app.routes.server.ts` (prerender vs. SSR vs. client-only, and
// the 404 status for unmatched paths) - the legacy CommonEngine API does not
// consult that route table at request time.
const angularNodeAppEngine = new AngularNodeAppEngine();

/**
 * Example Express Rest API endpoints can be defined here.
 * Uncomment and define endpoints as necessary.
 *
 * Example:
 * ```ts
 * app.get('/api/**', (req, res) => {
 *   // Handle API request
 * });
 * ```
 */

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
  const m = req.path.match(/^\/learn\/([^\/]+)\/?$/);
  if (m) {
    const slug = m[1];
    const exists = LESSONS.some((l) => l.slug === slug);
    if (!exists) {
      const notFoundHtml = resolve(browserDistFolder, '404', 'index.html');
      try {
        const body = readFileSync(notFoundHtml, 'utf8');
        res.status(404).type('html').send(body);
        return;
      } catch (e) {
        // Fall through to Angular engine if reading the file fails.
      }
    }
  }
  next();
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
  });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Node Express server.
 */
export default createNodeRequestHandler(app);
