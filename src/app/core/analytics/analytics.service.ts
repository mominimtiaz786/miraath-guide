import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject } from '@angular/core';

type AnalyticsParams = Record<string, string | number>;
type Gtag = (command: 'event', name: string, params: AnalyticsParams) => void;

/**
 * Thin wrapper over the Google tag already loaded in `index.html`. Sends
 * nothing during SSR or when the tag is absent (e.g. blocked). Callers must
 * only pass aggregate, non-identifying parameters - never an email, a hash
 * of one, family details or a raw query string.
 */
@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  event(name: string, params: AnalyticsParams = {}): void {
    if (!this.isBrowser) {
      return;
    }
    const gtag = (window as unknown as { gtag?: Gtag }).gtag;
    if (typeof gtag === 'function') {
      gtag('event', name, params);
    }
  }
}
