import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';

export type AppLocale = 'en' | 'ur';

const STORAGE_KEY = 'mirath-guide.locale';

/**
 * MVP-level UI locale flag (spec section 16/24). Full Urdu copy is a known
 * MVP limitation (see README) - this establishes the structure (direction,
 * font family, persisted preference) that a future translation pass plugs into.
 */
@Injectable({ providedIn: 'root' })
export class LocaleService {
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  private readonly locale_ = signal<AppLocale>(this.readInitialLocale());
  readonly locale = this.locale_.asReadonly();

  setLocale(locale: AppLocale): void {
    this.locale_.set(locale);
    if (!this.isBrowser) {
      return;
    }
    try {
      sessionStorage.setItem(STORAGE_KEY, locale);
    } catch {
      // sessionStorage may be unavailable (private browsing) - locale still works in-memory.
    }
    this.document.documentElement.lang = locale === 'ur' ? 'ur' : 'en';
    this.document.documentElement.dir = locale === 'ur' ? 'rtl' : 'ltr';
  }

  private readInitialLocale(): AppLocale {
    if (!this.isBrowser) {
      return 'en';
    }
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY);
      if (stored === 'ur' || stored === 'en') {
        return stored;
      }
    } catch {
      // ignore
    }
    return 'en';
  }
}
