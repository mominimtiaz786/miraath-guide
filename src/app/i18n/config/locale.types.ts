export type AppLocale = 'en' | 'ur' | 'hi' | 'fr' | 'ar';

export type LocaleDirection = 'ltr' | 'rtl';

export interface LocaleDefinition {
  code: AppLocale;
  label: string;
  nativeLabel: string;
  direction: LocaleDirection;
  urlPrefix: string;
  htmlLang: string;
  ogLocale: string;
  fontClass: string;
}

export type TranslationPrimitive = string | number | boolean | null;
export type TranslationNode = TranslationPrimitive | TranslationTree | readonly TranslationNode[];
export interface TranslationTree {
  readonly [key: string]: TranslationNode;
}
