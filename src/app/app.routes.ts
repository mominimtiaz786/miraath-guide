import { Routes } from '@angular/router';
import { calculatorProgressGuard } from './core/guards/calculator-progress.guard';
import { SeoData } from './core/seo/seo-data.model';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home-page.component').then((m) => m.HomePageComponent),
    title: 'Islamic Inheritance Calculator | Miraath Guide',
    data: {
      seo: {
        title: 'Islamic Inheritance Calculator | Miraath Guide',
        description:
          'Calculate Islamic inheritance shares for eligible heirs with Miraath Guide, an educational Sharia inheritance calculator based on the principles of Ilm al-Faraid.',
        canonicalPath: '/',
        keywords: [
          'islamic inheritance calculator',
          'muslim inheritance calculator',
          'sharia inheritance calculator',
          'inheritance calculator in islam',
        ],
        ogDescription:
          'Calculate Islamic inheritance shares for eligible heirs with an educational calculator based on the principles of Ilm al-Faraid.',
        twitterDescription: 'Calculate Islamic inheritance shares and understand the principles of Ilm al-Faraid.',
      } satisfies SeoData,
    },
  },
  {
    path: 'calculator',
    loadComponent: () =>
      import('./features/calculator/pages/calculator-intro-page.component').then((m) => m.CalculatorIntroPageComponent),
    title: 'Sharia Inheritance Calculator – Calculate Heir Shares | Miraath Guide',
    data: {
      seo: {
        title: 'Sharia Inheritance Calculator – Calculate Heir Shares | Miraath Guide',
        description:
          'Use the Miraath Guide Sharia inheritance calculator to estimate the shares of eligible heirs and understand how the calculation was determined.',
        canonicalPath: '/calculator',
        keywords: [
          'sharia inheritance calculator',
          'islamic inheritance law calculator',
          'inheritance islamic calculator',
          'islamic calculator inheritance',
        ],
      } satisfies SeoData,
    },
  },
  {
    path: 'calculator/wizard',
    loadComponent: () =>
      import('./features/calculator/pages/wizard-page.component').then((m) => m.WizardPageComponent),
    title: 'Inheritance Calculator Wizard | Miraath Guide',
    data: {
      seo: {
        title: 'Inheritance Calculator Wizard | Miraath Guide',
        description: 'Answer guided questions to calculate Islamic inheritance shares for your family situation.',
        canonicalPath: '/calculator/wizard',
        robots: 'noindex, follow',
      } satisfies SeoData,
    },
  },
  {
    path: 'calculator/review',
    loadComponent: () =>
      import('./features/calculator/pages/review-page.component').then((m) => m.ReviewPageComponent),
    canActivate: [calculatorProgressGuard],
    title: 'Review Your Answers | Miraath Guide',
    data: {
      seo: {
        title: 'Review Your Answers | Miraath Guide',
        description: "Review the family details you've entered before calculating Islamic inheritance shares.",
        canonicalPath: '/calculator/review',
        robots: 'noindex, follow',
      } satisfies SeoData,
    },
  },
  {
    path: 'calculator/results',
    loadComponent: () =>
      import('./features/calculator/pages/results-page.component').then((m) => m.ResultsPageComponent),
    canActivate: [calculatorProgressGuard],
    title: 'Your Inheritance Calculation Results | Miraath Guide',
    data: {
      seo: {
        title: 'Your Inheritance Calculation Results | Miraath Guide',
        description: 'See who inherits, who is blocked, and the exact shares calculated for your family situation.',
        canonicalPath: '/calculator/results',
        robots: 'noindex, follow',
      } satisfies SeoData,
    },
  },
  {
    path: 'common-cases',
    loadComponent: () =>
      import('./features/common-cases/pages/common-cases-list-page.component').then(
        (m) => m.CommonCasesListPageComponent,
      ),
    title: 'Common Islamic Inheritance Cases and Shares | Miraath Guide',
    data: {
      seo: {
        title: 'Common Islamic Inheritance Cases and Shares | Miraath Guide',
        description:
          'Explore common Islamic inheritance scenarios involving spouses, parents, sons, daughters and other eligible heirs.',
        canonicalPath: '/common-cases',
      } satisfies SeoData,
    },
  },
  {
    path: 'common-cases/:slug',
    loadComponent: () =>
      import('./features/common-cases/pages/common-case-detail-page.component').then(
        (m) => m.CommonCaseDetailPageComponent,
      ),
    title: 'Common Case | Miraath Guide',
  },
  {
    path: 'learn',
    loadComponent: () =>
      import('./features/learn/pages/learn-landing-page.component').then((m) => m.LearnLandingPageComponent),
    title: 'Learn Islamic Inheritance and Ilm al-Faraid | Miraath Guide',
    data: {
      seo: {
        title: 'Learn Islamic Inheritance and Ilm al-Faraid | Miraath Guide',
        description:
          'Learn the foundations of Islamic inheritance, Quranic shares, eligible heirs, exclusion rules, Awl, Radd and other principles of Ilm al-Faraid.',
        canonicalPath: '/learn',
      } satisfies SeoData,
    },
  },
  {
    path: 'learn/:slug',
    loadComponent: () =>
      import('./features/learn/pages/lesson-detail-page.component').then((m) => m.LessonDetailPageComponent),
    title: 'Lesson | Miraath Guide',
  },
  {
    path: 'methodology',
    loadComponent: () =>
      import('./features/methodology/methodology-page.component').then((m) => m.MethodologyPageComponent),
    title: 'Islamic Inheritance Calculation Methodology | Miraath Guide',
    data: {
      seo: {
        title: 'Islamic Inheritance Calculation Methodology | Miraath Guide',
        description:
          'Review the methodology, assumptions, inheritance rules and educational limitations used by the Miraath Guide Islamic inheritance calculator.',
        canonicalPath: '/methodology',
      } satisfies SeoData,
    },
  },
  {
    path: 'about',
    loadComponent: () => import('./features/about/about-page.component').then((m) => m.AboutPageComponent),
    title: 'About Miraath Guide | Islamic Inheritance Calculator',
    data: {
      seo: {
        title: 'About Miraath Guide | Islamic Inheritance Calculator',
        description:
          'Learn about Miraath Guide, an educational Islamic inheritance calculator built to make understanding Faraid clearer and calmer.',
        canonicalPath: '/about',
      } satisfies SeoData,
    },
  },
  {
    path: 'glossary',
    loadComponent: () => import('./features/glossary/glossary-page.component').then((m) => m.GlossaryPageComponent),
    title: 'Faraid Glossary – Islamic Inheritance Terms | Miraath Guide',
    data: {
      seo: {
        title: 'Faraid Glossary – Islamic Inheritance Terms | Miraath Guide',
        description:
          'A glossary of key Islamic inheritance (Faraid) terms including Hajb, Kalalah, Awl, Radd and other concepts used throughout Miraath Guide.',
        canonicalPath: '/glossary',
      } satisfies SeoData,
    },
  },
  {
    path: 'privacy',
    loadComponent: () => import('./features/misc/privacy-page.component').then((m) => m.PrivacyPageComponent),
    title: 'Privacy Policy | Miraath Guide',
    data: {
      seo: {
        title: 'Privacy Policy | Miraath Guide',
        description:
          'Read how Miraath Guide handles your data: no accounts, no calculation data uploaded, and inheritance figures processed locally in your browser.',
        canonicalPath: '/privacy',
      } satisfies SeoData,
    },
  },
  {
    path: 'disclaimer',
    loadComponent: () => import('./features/misc/disclaimer-page.component').then((m) => m.DisclaimerPageComponent),
    title: 'Disclaimer | Miraath Guide',
    data: {
      seo: {
        title: 'Disclaimer | Miraath Guide',
        description: "Important limitations to read before relying on a Miraath Guide inheritance calculation result.",
        canonicalPath: '/disclaimer',
      } satisfies SeoData,
    },
  },
  {
    path: '404',
    loadComponent: () => import('./features/misc/not-found-page.component').then((m) => m.NotFoundPageComponent),
    title: 'Page Not Found | Miraath Guide',
    data: {
      seo: {
        title: 'Page Not Found | Miraath Guide',
        description: "The page you're looking for may have moved or no longer exists.",
        canonicalPath: '/404',
        robots: 'noindex, follow',
      } satisfies SeoData,
    },
  },
  {
    // Rendered directly (not a redirectTo) so the SSR server route below can
    // attach a real HTTP 404 status to unmatched URLs instead of issuing a
    // client-side redirect.
    path: '**',
    loadComponent: () => import('./features/misc/not-found-page.component').then((m) => m.NotFoundPageComponent),
    title: 'Page Not Found | Miraath Guide',
    data: {
      seo: {
        title: 'Page Not Found | Miraath Guide',
        description: "The page you're looking for may have moved or no longer exists.",
        canonicalPath: '/404',
        robots: 'noindex, follow',
      } satisfies SeoData,
    },
  },
];
