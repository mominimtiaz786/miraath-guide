import { RenderMode, ServerRoute } from '@angular/ssr';
import { PREFIXED_LOCALE_CODES } from './i18n/config/locale.config';
import { COMMON_CASES } from './data/common-cases/common-cases.data';
import { LESSONS } from './data/lessons/lessons.data';

const staticPrerenderPaths = [
  '',
  'calculator',
  'common-cases',
  'learn',
  'methodology',
  'about',
  'glossary',
  'privacy',
  'disclaimer',
  '404',
];

const clientOnlyPaths = ['calculator/wizard', 'calculator/review', 'calculator/results'];

const withLocalePrefix = (path: string, locale: string): string => (path ? `${locale}/${path}` : locale);

const localizedStaticRoutes = (locale: string): ServerRoute[] =>
  staticPrerenderPaths.map((path): ServerRoute => ({
    path: withLocalePrefix(path, locale),
    renderMode: RenderMode.Prerender,
  }));

const localizedClientRoutes = (locale: string): ServerRoute[] =>
  clientOnlyPaths.map((path): ServerRoute => ({
    path: withLocalePrefix(path, locale),
    renderMode: RenderMode.Client,
  }));

const localizedDynamicRoutes = (locale = ''): ServerRoute[] => {
  const prefix = locale ? `${locale}/` : '';
  return [
    {
      path: `${prefix}common-cases/:slug`,
      renderMode: RenderMode.Prerender,
      async getPrerenderParams() {
        return COMMON_CASES.map((c) => ({ slug: c.slug }));
      },
    },
    {
      path: `${prefix}learn/:slug`,
      renderMode: RenderMode.Prerender,
      async getPrerenderParams() {
        return LESSONS.map((l) => ({ slug: l.slug }));
      },
    },
  ];
};

export const serverRoutes: ServerRoute[] = [
  ...staticPrerenderPaths.map((path): ServerRoute => ({ path, renderMode: RenderMode.Prerender })),
  ...clientOnlyPaths.map((path): ServerRoute => ({ path, renderMode: RenderMode.Client })),
  ...localizedDynamicRoutes(),
  ...PREFIXED_LOCALE_CODES.flatMap((locale) => [
    ...localizedStaticRoutes(locale),
    ...localizedClientRoutes(locale),
    ...localizedDynamicRoutes(locale),
  ]),
  { path: '**', renderMode: RenderMode.Server, status: 404 },
];
