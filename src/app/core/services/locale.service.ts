import { Injectable, signal } from '@angular/core';

export type AppLocale = 'en' | 'ur';

const STORAGE_KEY = 'mirath-guide.locale';

/**
 * MVP-level UI locale flag (spec section 16/24). Full Urdu copy is a known
 * MVP limitation (see README) - this establishes the structure (direction,
 * font family, persisted preference) that a future translation pass plugs into.
 */
@Injectable({ providedIn: 'root' })
export class LocaleService {
  private readonly locale_ = signal<AppLocale>(this.readInitialLocale());
  readonly locale = this.locale_.asReadonly();

  setLocale(locale: AppLocale): void {
    this.locale_.set(locale);
    try {
      sessionStorage.setItem(STORAGE_KEY, locale);
    } catch {
      // sessionStorage may be unavailable (private browsing) - locale still works in-memory.
    }
    document.documentElement.lang = locale === 'ur' ? 'ur' : 'en';
    document.documentElement.dir = locale === 'ur' ? 'rtl' : 'ltr';
  }

  private readInitialLocale(): AppLocale {
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
