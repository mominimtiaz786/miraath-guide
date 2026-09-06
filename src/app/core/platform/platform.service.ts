import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject } from '@angular/core';

export type NativePlatform = 'ios' | 'android';
export type RuntimePlatform = NativePlatform | 'web';

/**
 * Capacitor installs this global into the WebView on native. Reading it
 * instead of importing `@capacitor/core` keeps every Capacitor byte out of
 * the web/SSR bundle - the plugins themselves are dynamically imported by
 * `NativeBridgeService`, and only ever on a native platform.
 */
interface CapacitorGlobal {
  isNativePlatform?: () => boolean;
  getPlatform?: () => string;
}

/**
 * Single source of truth for "where is this code running". Every native-only
 * branch in the app funnels through here so the answer can never drift
 * between features, and so SSR (where there is no `window` at all) always
 * resolves to `web`.
 */
@Injectable({ providedIn: 'root' })
export class PlatformService {
  /** False during SSR/prerender, true in any real browser or WebView. */
  readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  readonly platform: RuntimePlatform = this.resolvePlatform();
  readonly isNative = this.platform !== 'web';
  readonly isIos = this.platform === 'ios';
  readonly isAndroid = this.platform === 'android';

  private resolvePlatform(): RuntimePlatform {
    if (!this.isBrowser) {
      return 'web';
    }
    try {
      const capacitor = (window as unknown as { Capacitor?: CapacitorGlobal }).Capacitor;
      if (!capacitor?.isNativePlatform?.()) {
        return 'web';
      }
      const name = capacitor.getPlatform?.();
      return name === 'ios' || name === 'android' ? name : 'web';
    } catch {
      // A locked-down WebView can throw on global access - degrade to web.
      return 'web';
    }
  }
}
