import { AppLocale, LocaleDefinition } from './locale.types';

export const DEFAULT_LOCALE: AppLocale = 'en';

export const SUPPORTED_LOCALES: Record<AppLocale, LocaleDefinition> = {
  en: {
    code: 'en',
    label: 'English',
    nativeLabel: 'English',
    direction: 'ltr',
    urlPrefix: '',
    htmlLang: 'en',
    ogLocale: 'en_US',
    fontClass: 'font-latin',
  },
  ur: {
    code: 'ur',
    label: 'Urdu',
    nativeLabel: 'اردو',
    direction: 'rtl',
    urlPrefix: '/ur',
    htmlLang: 'ur',
    ogLocale: 'ur_PK',
    fontClass: 'font-urdu',
  },
  hi: {
    code: 'hi',
    label: 'Hindi',
    nativeLabel: 'हिन्दी',
    direction: 'ltr',
    urlPrefix: '/hi',
    htmlLang: 'hi',
    ogLocale: 'hi_IN',
    fontClass: 'font-devanagari',
  },
  fr: {
    code: 'fr',
    label: 'French',
    nativeLabel: 'Français',
    direction: 'ltr',
    urlPrefix: '/fr',
    htmlLang: 'fr',
    ogLocale: 'fr_FR',
    fontClass: 'font-latin',
  },
  ar: {
    code: 'ar',
    label: 'Arabic',
    nativeLabel: 'العربية',
    direction: 'rtl',
    urlPrefix: '/ar',
    htmlLang: 'ar',
    ogLocale: 'ar_SA',
    fontClass: 'font-arabic',
  },
} as const;

export const SUPPORTED_LOCALE_CODES = Object.keys(SUPPORTED_LOCALES) as AppLocale[];
export const PREFIXED_LOCALE_CODES = SUPPORTED_LOCALE_CODES.filter((code) => code !== DEFAULT_LOCALE);

export function isAppLocale(value: string | null | undefined): value is AppLocale {
  return !!value && Object.prototype.hasOwnProperty.call(SUPPORTED_LOCALES, value);
}

export function getLocaleDefinition(locale: AppLocale): LocaleDefinition {
  return SUPPORTED_LOCALES[locale];
}
