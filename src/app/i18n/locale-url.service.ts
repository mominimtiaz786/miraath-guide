import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AppLocale } from './config/locale.types';
import { DEFAULT_LOCALE, PREFIXED_LOCALE_CODES, SUPPORTED_LOCALES, isAppLocale } from './config/locale.config';

interface UrlParts {
  path: string;
  suffix: string;
}

@Injectable({ providedIn: 'root' })
export class LocaleUrlService {
  private readonly router = inject(Router);

  resolveLocale(url = this.router.url): AppLocale {
    const first = this.firstSegment(url);
    return isAppLocale(first) && first !== DEFAULT_LOCALE ? first : DEFAULT_LOCALE;
  }

  stripLocale(url = this.router.url): string {
    const { path, suffix } = this.split(url);
    const segments = path.split('/').filter(Boolean);
    if (segments.length > 0 && (PREFIXED_LOCALE_CODES as readonly string[]).includes(segments[0])) {
      const stripped = `/${segments.slice(1).join('/')}`;
      return `${stripped === '/' ? '/' : stripped}${suffix}`;
    }
    return `${path || '/'}${suffix}`;
  }

  localize(path: string, locale: AppLocale = this.resolveLocale()): string {
    const stripped = this.stripLocale(path);
    const { path: cleanPath, suffix } = this.split(stripped);
    const normalizedPath = cleanPath === '' ? '/' : cleanPath;
    if (locale === DEFAULT_LOCALE) {
      return `${normalizedPath}${suffix}`;
    }
    const prefix = SUPPORTED_LOCALES[locale].urlPrefix;
    const withoutLeadingSlash = normalizedPath === '/' ? '' : normalizedPath;
    return `${prefix}${withoutLeadingSlash}${normalizedPath === '/' ? '/' : ''}${suffix}`;
  }

  switchLocale(currentUrl: string, targetLocale: AppLocale): string {
    return this.localize(currentUrl, targetLocale);
  }

  equivalentUrls(currentUrl = this.router.url): Record<AppLocale, string> {
    return Object.fromEntries(
      (Object.keys(SUPPORTED_LOCALES) as AppLocale[]).map((locale) => [locale, this.switchLocale(currentUrl, locale)]),
    ) as Record<AppLocale, string>;
  }

  private firstSegment(url: string): string | null {
    const { path } = this.split(url);
    return path.split('/').filter(Boolean)[0] ?? null;
  }

  private split(url: string): UrlParts {
    const hashIndex = url.indexOf('#');
    const beforeHash = hashIndex >= 0 ? url.slice(0, hashIndex) : url;
    const hash = hashIndex >= 0 ? url.slice(hashIndex) : '';
    const queryIndex = beforeHash.indexOf('?');
    const path = queryIndex >= 0 ? beforeHash.slice(0, queryIndex) : beforeHash;
    const query = queryIndex >= 0 ? beforeHash.slice(queryIndex) : '';
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    return {
      path: normalizedPath.replace(/\/{2,}/g, '/'),
      suffix: `${query}${hash}`,
    };
  }
}
