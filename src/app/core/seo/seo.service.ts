import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { SeoData } from './seo-data.model';
import { DEFAULT_ROBOTS, SITE_NAME, SITE_URL } from './seo.constants';

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

  constructor() {
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe(() => {
        const seo = this.findRouteSeoData(this.activatedRoute);
        if (seo) {
          this.update(seo);
        }
      });
  }

  update(data: SeoData): void {
    this.title.setTitle(data.title);
    this.setTag('description', data.description);
    this.setTag('robots', data.robots ?? DEFAULT_ROBOTS);

    const ogTitle = data.ogTitle ?? data.title;
    const ogDescription = data.ogDescription ?? data.description;
    const canonicalUrl = this.absoluteUrl(data.canonicalPath);

    this.setProperty('og:type', data.ogType ?? 'website');
    this.setProperty('og:site_name', SITE_NAME);
    this.setProperty('og:title', ogTitle);
    this.setProperty('og:description', ogDescription);
    this.setProperty('og:url', canonicalUrl);
    if (data.ogImage) {
      this.setProperty('og:image', this.absoluteUrl(data.ogImage));
    } else {
      this.meta.removeTag('property="og:image"');
    }

    this.setTag('twitter:card', data.twitterCard ?? 'summary_large_image');
    this.setTag('twitter:title', ogTitle);
    this.setTag('twitter:description', data.twitterDescription ?? ogDescription);

    this.setCanonical(canonicalUrl);
  }

  private findRouteSeoData(route: ActivatedRoute): SeoData | null {
    let current: ActivatedRoute | null = route;
    let seo: SeoData | null = null;
    while (current) {
      const routeSeo = current.snapshot.data['seo'];
      if (routeSeo) {
        seo = routeSeo as SeoData;
      }
      current = current.firstChild;
    }
    return seo;
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
}
