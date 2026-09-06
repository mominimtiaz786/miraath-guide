import { DOCUMENT } from '@angular/common';
import { Injectable, effect, inject, signal } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { AppLocale } from './config/locale.types';
import { SUPPORTED_LOCALES, getLocaleDefinition } from './config/locale.config';
import { LocalePreferenceService } from './locale-preference.service';
import { LocaleUrlService } from './locale-url.service';

@Injectable({ providedIn: 'root' })
export class LocaleService {
  private readonly document = inject(DOCUMENT);
  private readonly router = inject(Router);
  private readonly localeUrl = inject(LocaleUrlService);
  private readonly preference = inject(LocalePreferenceService);
  private readonly locale_ = signal<AppLocale>(this.localeUrl.resolveLocale(this.router.url));

  readonly locale = this.locale_.asReadonly();
  readonly definition = () => getLocaleDefinition(this.locale_());

  constructor() {
    this.applyDocumentLocale(this.locale_());
    this.router.events.pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd)).subscribe((event) => {
      this.locale_.set(this.localeUrl.resolveLocale(event.urlAfterRedirects));
    });
    effect(() => this.applyDocumentLocale(this.locale_()));
  }

  /**
   * Records a *deliberate* language choice. Navigation alone deliberately
   * does not persist anything: on native, `hasExplicitChoice()` is what
   * decides whether the first-run picker appears, and every launch lands on
   * `/` (English) before the user has said anything at all.
   */
  setLocalePreference(locale: AppLocale): void {
    this.preference.remember(locale);
  }

  supportedLocales() {
    return Object.values(SUPPORTED_LOCALES);
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
