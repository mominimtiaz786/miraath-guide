import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, effect, inject, signal } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { AppLocale } from './config/locale.types';
import { SUPPORTED_LOCALES, getLocaleDefinition } from './config/locale.config';
import { LocaleUrlService } from './locale-url.service';

const STORAGE_KEY = 'mirath-guide.locale';

@Injectable({ providedIn: 'root' })
export class LocaleService {
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly router = inject(Router);
  private readonly localeUrl = inject(LocaleUrlService);
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  private readonly locale_ = signal<AppLocale>(this.localeUrl.resolveLocale(this.router.url));

  readonly locale = this.locale_.asReadonly();
  readonly definition = () => getLocaleDefinition(this.locale_());

  constructor() {
    this.applyDocumentLocale(this.locale_());
    this.router.events.pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd)).subscribe((event) => {
      const nextLocale = this.localeUrl.resolveLocale(event.urlAfterRedirects);
      this.locale_.set(nextLocale);
      this.rememberLocale(nextLocale);
    });
    effect(() => this.applyDocumentLocale(this.locale_()));
  }

  setLocalePreference(locale: AppLocale): void {
    this.rememberLocale(locale);
  }

  supportedLocales() {
    return Object.values(SUPPORTED_LOCALES);
  }

  private rememberLocale(locale: AppLocale): void {
    if (!this.isBrowser) {
      return;
    }
    try {
      sessionStorage.setItem(STORAGE_KEY, locale);
    } catch {
      // Storage is only a convenience; URL resolution remains authoritative.
    }
  }

  private applyDocumentLocale(locale: AppLocale): void {
    const definition = getLocaleDefinition(locale);
    const root = this.document.documentElement;
    root.lang = definition.htmlLang;
    root.dir = definition.direction;
    root.classList.remove(...Object.values(SUPPORTED_LOCALES).map((l) => l.fontClass));
    root.classList.add(definition.fontClass);
  }
}
