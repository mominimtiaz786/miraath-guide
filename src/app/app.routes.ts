import { Routes } from '@angular/router';
import { calculatorProgressGuard } from './core/guards/calculator-progress.guard';
import { PREFIXED_LOCALE_CODES } from './i18n/config/locale.config';

const publicRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home-page.component').then((m) => m.HomePageComponent),
    data: { seoKey: 'home', canonicalPath: '/' },
  },
  {
    path: 'calculator',
    loadComponent: () =>
      import('./features/calculator/pages/calculator-intro-page.component').then((m) => m.CalculatorIntroPageComponent),
    data: { seoKey: 'calculator', canonicalPath: '/calculator' },
  },
  {
    path: 'calculator/wizard',
    loadComponent: () =>
      import('./features/calculator/pages/wizard-page.component').then((m) => m.WizardPageComponent),
    data: { seoKey: 'calculatorWizard', canonicalPath: '/calculator/wizard' },
  },
  {
    path: 'calculator/review',
    loadComponent: () =>
      import('./features/calculator/pages/review-page.component').then((m) => m.ReviewPageComponent),
    canActivate: [calculatorProgressGuard],
    data: { seoKey: 'calculatorReview', canonicalPath: '/calculator/review' },
  },
  {
    path: 'calculator/results',
    loadComponent: () =>
      import('./features/calculator/pages/results-page.component').then((m) => m.ResultsPageComponent),
    canActivate: [calculatorProgressGuard],
    data: { seoKey: 'calculatorResults', canonicalPath: '/calculator/results' },
  },
  {
    path: 'common-cases',
    loadComponent: () =>
      import('./features/common-cases/pages/common-cases-list-page.component').then(
        (m) => m.CommonCasesListPageComponent,
      ),
    data: { seoKey: 'commonCases', canonicalPath: '/common-cases' },
  },
  {
    path: 'common-cases/:slug',
    loadComponent: () =>
      import('./features/common-cases/pages/common-case-detail-page.component').then(
        (m) => m.CommonCaseDetailPageComponent,
      ),
  },
  {
    path: 'learn',
    loadComponent: () =>
      import('./features/learn/pages/learn-landing-page.component').then((m) => m.LearnLandingPageComponent),
    data: { seoKey: 'learn', canonicalPath: '/learn' },
  },
  {
    path: 'learn/:slug',
    loadComponent: () =>
      import('./features/learn/pages/lesson-detail-page.component').then((m) => m.LessonDetailPageComponent),
  },
  {
    path: 'methodology',
    loadComponent: () => import('./features/methodology/methodology-page.component').then((m) => m.MethodologyPageComponent),
    data: { seoKey: 'methodology', canonicalPath: '/methodology' },
  },
  {
    path: 'about',
    loadComponent: () => import('./features/about/about-page.component').then((m) => m.AboutPageComponent),
    data: { seoKey: 'about', canonicalPath: '/about' },
  },
  {
    path: 'glossary',
    loadComponent: () => import('./features/glossary/glossary-page.component').then((m) => m.GlossaryPageComponent),
    data: { seoKey: 'glossary', canonicalPath: '/glossary' },
  },
  {
    path: 'privacy',
    loadComponent: () => import('./features/misc/privacy-page.component').then((m) => m.PrivacyPageComponent),
    data: { seoKey: 'privacy', canonicalPath: '/privacy' },
  },
  {
    path: 'disclaimer',
    loadComponent: () => import('./features/misc/disclaimer-page.component').then((m) => m.DisclaimerPageComponent),
    data: { seoKey: 'disclaimer', canonicalPath: '/disclaimer' },
  },
  {
    path: '404',
    loadComponent: () => import('./features/misc/not-found-page.component').then((m) => m.NotFoundPageComponent),
    data: { seoKey: 'notFound', canonicalPath: '/404' },
  },
];

const notFoundRoute: Routes[number] = {
  path: '**',
  loadComponent: () => import('./features/misc/not-found-page.component').then((m) => m.NotFoundPageComponent),
  data: { seoKey: 'notFound', canonicalPath: '/404' },
};

const localizedRoutes: Routes = PREFIXED_LOCALE_CODES.map((locale) => ({
  path: locale,
  children: [...publicRoutes, notFoundRoute],
}));

export const routes: Routes = [
  ...publicRoutes,
  ...localizedRoutes,
  notFoundRoute,
];
