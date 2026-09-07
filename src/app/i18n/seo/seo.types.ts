import { SeoData } from '../../core/seo/seo-data.model';

export type SeoKey =
  | 'home'
  | 'calculator'
  | 'calculatorWizard'
  | 'calculatorReview'
  | 'calculatorResults'
  | 'commonCases'
  | 'learn'
  | 'methodology'
  | 'about'
  | 'glossary'
  | 'privacy'
  | 'disclaimer'
  | 'notFound';

export type SeoDictionary = Record<SeoKey, Omit<SeoData, 'canonicalPath'>>;
