import { Injectable, inject } from '@angular/core';
import { AppLocale, TranslationNode, TranslationTree } from './config/locale.types';
import { DEFAULT_LOCALE } from './config/locale.config';
import { LocaleService } from './locale.service';
import { EN_TRANSLATIONS } from './locales/en';
import { UR_TRANSLATIONS } from './locales/ur';
import { HI_TRANSLATIONS } from './locales/hi';
import { FR_TRANSLATIONS } from './locales/fr';
import { AR_TRANSLATIONS } from './locales/ar';

const DICTIONARIES: Record<AppLocale, TranslationTree> = {
  en: EN_TRANSLATIONS,
  ur: UR_TRANSLATIONS,
  hi: HI_TRANSLATIONS,
  fr: FR_TRANSLATIONS,
  ar: AR_TRANSLATIONS,
};

@Injectable({ providedIn: 'root' })
export class TranslationService {
  private readonly localeService = inject(LocaleService);

  readonly locale = this.localeService.locale;

  t(key: string, params: Record<string, string | number> = {}): string {
    const value = this.resolve(key, this.locale()) ?? this.resolve(key, DEFAULT_LOCALE);
    const text = typeof value === 'string' ? value : key;
    return text.replace(/\{\{\s*(\w+)\s*\}\}/g, (_, name: string) => String(params[name] ?? ''));
  }

  value<T>(key: string): T {
    return (this.resolve(key, this.locale()) ?? this.resolve(key, DEFAULT_LOCALE)) as T;
  }

  has(key: string, locale: AppLocale): boolean {
    return this.resolve(key, locale) !== undefined;
  }

  private resolve(key: string, locale: AppLocale): TranslationNode | undefined {
    return key.split('.').reduce<TranslationNode | undefined>((current, part) => {
      if (current && typeof current === 'object' && !Array.isArray(current) && part in current) {
        return (current as TranslationTree)[part];
      }
      return undefined;
    }, DICTIONARIES[locale]);
  }
}
