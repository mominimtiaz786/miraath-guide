import { Routes } from '@angular/router';
import { calculatorProgressGuard } from './core/guards/calculator-progress.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home-page.component').then((m) => m.HomePageComponent),
    title: 'Mirath Guide - Understand. Calculate. Share fairly.',
  },
  {
    path: 'calculator',
    loadComponent: () =>
      import('./features/calculator/pages/calculator-intro-page.component').then((m) => m.CalculatorIntroPageComponent),
    title: 'Calculator - Mirath Guide',
  },
  {
    path: 'calculator/wizard',
    loadComponent: () =>
      import('./features/calculator/pages/wizard-page.component').then((m) => m.WizardPageComponent),
    title: 'Wizard - Mirath Guide',
  },
  {
    path: 'calculator/review',
    loadComponent: () =>
      import('./features/calculator/pages/review-page.component').then((m) => m.ReviewPageComponent),
    canActivate: [calculatorProgressGuard],
    title: 'Review - Mirath Guide',
  },
  {
    path: 'calculator/results',
    loadComponent: () =>
      import('./features/calculator/pages/results-page.component').then((m) => m.ResultsPageComponent),
    canActivate: [calculatorProgressGuard],
    title: 'Results - Mirath Guide',
  },
  {
    path: 'common-cases',
    loadComponent: () =>
      import('./features/common-cases/pages/common-cases-list-page.component').then(
        (m) => m.CommonCasesListPageComponent,
      ),
    title: 'Common Cases - Mirath Guide',
  },
  {
    path: 'common-cases/:slug',
    loadComponent: () =>
      import('./features/common-cases/pages/common-case-detail-page.component').then(
        (m) => m.CommonCaseDetailPageComponent,
      ),
    title: 'Common Case - Mirath Guide',
  },
  {
    path: 'learn',
    loadComponent: () =>
      import('./features/learn/pages/learn-landing-page.component').then((m) => m.LearnLandingPageComponent),
    title: 'Learn Faraid - Mirath Guide',
  },
  {
    path: 'learn/:slug',
    loadComponent: () =>
      import('./features/learn/pages/lesson-detail-page.component').then((m) => m.LessonDetailPageComponent),
    title: 'Lesson - Mirath Guide',
  },
  {
    path: 'methodology',
    loadComponent: () =>
      import('./features/methodology/methodology-page.component').then((m) => m.MethodologyPageComponent),
    title: 'Methodology - Mirath Guide',
  },
  {
    path: 'about',
    loadComponent: () => import('./features/about/about-page.component').then((m) => m.AboutPageComponent),
    title: 'About - Mirath Guide',
  },
  {
    path: 'glossary',
    loadComponent: () => import('./features/glossary/glossary-page.component').then((m) => m.GlossaryPageComponent),
    title: 'Glossary - Mirath Guide',
  },
  {
    path: 'privacy',
    loadComponent: () => import('./features/misc/privacy-page.component').then((m) => m.PrivacyPageComponent),
    title: 'Privacy - Mirath Guide',
  },
  {
    path: 'disclaimer',
    loadComponent: () => import('./features/misc/disclaimer-page.component').then((m) => m.DisclaimerPageComponent),
    title: 'Disclaimer - Mirath Guide',
  },
  {
    path: '404',
    loadComponent: () => import('./features/misc/not-found-page.component').then((m) => m.NotFoundPageComponent),
    title: 'Page not found - Mirath Guide',
  },
  { path: '**', redirectTo: '404' },
];
