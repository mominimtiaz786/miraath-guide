import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { AppLocale } from '../../i18n/config/locale.types';
import { DEFAULT_LOCALE, SUPPORTED_LOCALES, getLocaleDefinition } from '../../i18n/config/locale.config';
import { LocaleService } from '../../i18n/locale.service';
import { LocaleUrlService } from '../../i18n/locale-url.service';
import { AR_SEO } from '../../i18n/seo/ar.seo';
import { EN_SEO } from '../../i18n/seo/en.seo';
import { FR_SEO } from '../../i18n/seo/fr.seo';
import { HI_SEO } from '../../i18n/seo/hi.seo';
import { SeoDictionary, SeoKey } from '../../i18n/seo/seo.types';
import { UR_SEO } from '../../i18n/seo/ur.seo';
import { environment } from '../../../environments/environment';
import { SeoApplyOptions, SeoData } from './seo-data.model';
import { DEFAULT_ROBOTS, SITE_NAME, SITE_URL } from './seo.constants';

const SEO_DICTIONARIES: Record<AppLocale, SeoDictionary> = {
  en: EN_SEO,
  ur: UR_SEO,
  hi: HI_SEO,
  fr: FR_SEO,
  ar: AR_SEO,
};

/**
 * Centralized, SSR-safe route metadata (spec: "Route-level SEO architecture").
 * Reads `data.seo` off the deepest activated route on every successful
 * navigation - this runs identically during SSR (the initial navigation) and
 * in the browser (subsequent navigations), and relies on Angular's Title/Meta
 * services, which locate and update existing server-rendered tags in place
 * rather than duplicating them on hydration.
 *
 * Routes with per-item content (e.g. common case / lesson detail pages) don't
 * declare static route data; their components call `update()` directly with
 * dynamically computed metadata instead.
 */
@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly document = inject(DOCUMENT);
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly locale = inject(LocaleService);
  private readonly localeUrl = inject(LocaleUrlService);

  constructor() {
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe(() => {
        const options = this.findRouteSeoOptions(this.activatedRoute);
        if (options) {
          this.apply(options);
        }
      });
  }

  apply(options: SeoApplyOptions): void {
    const locale = this.locale.locale();
    const localizedSeo = options.seoKey
      ? SEO_DICTIONARIES[locale][options.seoKey as SeoKey] ?? SEO_DICTIONARIES[DEFAULT_LOCALE][options.seoKey as SeoKey]
      : null;
    this.update({
      ...(localizedSeo ?? {}),
      ...(options.data ?? {}),
      canonicalPath: options.canonicalPath,
    } as SeoData);
  }

  update(data: SeoData): void {
    const locale = this.locale.locale();
    const localeDefinition = getLocaleDefinition(locale);
    this.title.setTitle(data.title);
    this.document.documentElement.lang = localeDefinition.htmlLang;
    this.document.documentElement.dir = localeDefinition.direction;

    // Everything below this line exists for crawlers and link unfurlers:
    // description/robots meta, Open Graph, Twitter cards, canonical and
    // hreflang. A WebView has no such audience, so the app build skips the
    // work. The SEO dictionaries themselves are still reachable from this
    // class and stay in the bundle; the flag buys correctness, not bytes.
    if (!environment.enableSeo) {
      return;
    }

    this.setTag('description', data.description);
    this.setTag('robots', data.robots ?? DEFAULT_ROBOTS);

    const ogTitle = data.ogTitle ?? data.title;
    const ogDescription = data.ogDescription ?? data.description;
    const canonicalPath = this.localeUrl.canonical(data.canonicalPath, locale);
    const canonicalUrl = this.absoluteUrl(canonicalPath);

    this.setProperty('og:type', data.ogType ?? 'website');
    this.setProperty('og:site_name', SITE_NAME);
    this.setProperty('og:title', ogTitle);
    this.setProperty('og:description', ogDescription);
    this.setProperty('og:url', canonicalUrl);
    this.setProperty('og:locale', localeDefinition.ogLocale);
    this.setAlternateOgLocales(locale);
    if (data.ogImage) {
      this.setProperty('og:image', this.absoluteUrl(data.ogImage));
      this.setTag('twitter:image', this.absoluteUrl(data.ogImage));
    } else {
      this.meta.removeTag('property="og:image"');
      this.meta.removeTag('name="twitter:image"');
    }

    this.setTag('twitter:card', data.twitterCard ?? 'summary_large_image');
    this.setTag('twitter:title', ogTitle);
    this.setTag('twitter:description', data.twitterDescription ?? ogDescription);

    this.setCanonical(canonicalUrl);
    this.setHreflangLinks(data.canonicalPath);
  }

  private findRouteSeoOptions(route: ActivatedRoute): SeoApplyOptions | null {
    let current: ActivatedRoute | null = route;
    let options: SeoApplyOptions | null = null;
    while (current) {
      const seoKey = current.snapshot.data['seoKey'] as string | undefined;
      const canonicalPath = current.snapshot.data['canonicalPath'] as string | undefined;
      if (seoKey && canonicalPath) {
        options = { seoKey, canonicalPath };
      }
      current = current.firstChild;
    }
    return options;
  }

  private absoluteUrl(path: string): string {
    if (/^https?:\/\//.test(path)) {
      return path;
    }
    const normalized = path.startsWith('/') ? path : `/${path}`;
    return `${SITE_URL}${normalized}`;
  }

  private setTag(name: string, content: string): void {
    this.meta.updateTag({ name, content });
  }

  private setProperty(property: string, content: string): void {
    this.meta.updateTag({ property, content });
  }

  private setCanonical(url: string): void {
    let link = this.document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = this.document.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.document.head.appendChild(link);
    }
    link.setAttribute('href', url);
  }

  private setHreflangLinks(canonicalPath: string): void {
    this.document.head.querySelectorAll('link[rel="alternate"][hreflang]').forEach((node) => node.remove());
    const englishPath = this.localeUrl.canonical(canonicalPath, DEFAULT_LOCALE);
    for (const locale of Object.keys(SUPPORTED_LOCALES) as AppLocale[]) {
      this.appendAlternate(locale, this.localeUrl.canonical(canonicalPath, locale));
    }
    this.appendAlternate('x-default', englishPath);
  }

  private appendAlternate(hreflang: AppLocale | 'x-default', path: string): void {
    const link = this.document.createElement('link');
    link.setAttribute('rel', 'alternate');
    link.setAttribute('hreflang', hreflang);
    link.setAttribute('href', this.absoluteUrl(path));
    this.document.head.appendChild(link);
  }

  private setAlternateOgLocales(currentLocale: AppLocale): void {
    this.document.head.querySelectorAll('meta[property="og:locale:alternate"]').forEach((node) => node.remove());
    for (const locale of Object.keys(SUPPORTED_LOCALES) as AppLocale[]) {
      if (locale === currentLocale) {
        continue;
      }
      this.setMultiProperty('og:locale:alternate', getLocaleDefinition(locale).ogLocale);
    }
  }

  private setMultiProperty(property: string, content: string): void {
    const tag = this.document.createElement('meta');
    tag.setAttribute('property', property);
    tag.setAttribute('content', content);
    this.document.head.appendChild(tag);
  }
}
