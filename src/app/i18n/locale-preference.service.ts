import { Injectable, inject } from '@angular/core';
import { AppStorageService } from '../core/platform/app-storage.service';
import { PlatformService } from '../core/platform/platform.service';
import { DEFAULT_LOCALE, isAppLocale } from './config/locale.config';
import { AppLocale } from './config/locale.types';

/** Matches the pre-existing web key, so an installed PWA keeps its choice. */
const LOCALE_KEY = 'locale';

/**
 * The user's language choice, and how the app decides which language to open in.
 *
 * On the web the URL is authoritative - `/ur/calculator` *is* the Urdu page,
 * and that is what a crawler and a shared link both depend on - so a stored
 * value is only ever a convenience. Inside the app there is no meaningful URL
 * to arrive at: every launch starts at `/`, so the stored choice becomes the
 * only thing that can carry a language across restarts. That is why this is
 * written to the persistent scope rather than the session scope the web build
 * used before.
 */
@Injectable({ providedIn: 'root' })
export class LocalePreferenceService {
  private readonly storage = inject(AppStorageService);
  private readonly platform = inject(PlatformService);

  /** The locale the user has explicitly picked, if they ever have. */
  stored(): AppLocale | null {
    const value = this.storage.read(LOCALE_KEY, 'persistent');
    return isAppLocale(value) ? value : null;
  }

  /** True once the user has made a deliberate choice - suppresses the first-run picker. */
  hasExplicitChoice(): boolean {
    return this.stored() !== null;
  }

  remember(locale: AppLocale): void {
    this.storage.write(LOCALE_KEY, locale, 'persistent');
  }

  /**
   * A best-effort read of the device language, used only to pre-select an
   * entry in the first-run picker. `navigator.languages` reflects the OS
   * setting inside both WKWebView and Android's WebView.
   */
  deviceLocale(): AppLocale | null {
    if (!this.platform.isBrowser) {
      return null;
    }
    try {
      const candidates = navigator.languages?.length ? navigator.languages : [navigator.language];
      for (const tag of candidates) {
        const base = tag?.split('-')[0]?.toLowerCase();
        if (isAppLocale(base)) {
          return base;
        }
      }
    } catch {
      // Not worth failing a launch over - fall through to the default.
    }
    return null;
  }

  /** The locale the app should open in: an explicit choice, else the device's, else English. */
  resolveStartupLocale(): AppLocale {
    return this.stored() ?? this.deviceLocale() ?? DEFAULT_LOCALE;
  }
}
