import { RenderMode, ServerRoute } from '@angular/ssr';
import { COMMON_CASES } from './data/common-cases/common-cases.data';
import { LESSONS } from './data/lessons/lessons.data';

/**
 * Route-level rendering strategy (spec: hybrid rendering).
 *
 * Static, SEO-relevant content is prerendered at build time (SSG) so it works
 * on plain static hosting with no Node server required. The wizard/review/results
 * routes depend on sessionStorage-backed answers that only exist in the
 * visitor's browser, so they are intentionally excluded from prerender/SSR and
 * stay client-rendered - this also keeps arbitrary user-entered estate figures
 * out of any indexable, cacheable HTML. Every Angular route is listed
 * explicitly so the rendering mode is never left to an implicit default.
 */
export const serverRoutes: ServerRoute[] = [
  { path: '', renderMode: RenderMode.Prerender },
  { path: 'calculator', renderMode: RenderMode.Prerender },
  { path: 'calculator/wizard', renderMode: RenderMode.Client },
  { path: 'calculator/review', renderMode: RenderMode.Client },
  { path: 'calculator/results', renderMode: RenderMode.Client },
  { path: 'common-cases', renderMode: RenderMode.Prerender },
  {
    path: 'common-cases/:slug',
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      return COMMON_CASES.map((c) => ({ slug: c.slug }));
    },
  },
  { path: 'learn', renderMode: RenderMode.Prerender },
  {
    path: 'learn/:slug',
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      return LESSONS.map((l) => ({ slug: l.slug }));
    },
  },
  { path: 'methodology', renderMode: RenderMode.Prerender },
  { path: 'about', renderMode: RenderMode.Prerender },
  { path: 'glossary', renderMode: RenderMode.Prerender },
  { path: 'privacy', renderMode: RenderMode.Prerender },
  { path: 'disclaimer', renderMode: RenderMode.Prerender },
  { path: '404', renderMode: RenderMode.Prerender },
  // Any unmatched path (Angular router redirects these to /404 client-side).
  // Server-rendered on demand so a Node deployment can return a real 404
  // status instead of a fake 200 for the homepage.
  { path: '**', renderMode: RenderMode.Server, status: 404 },
];
