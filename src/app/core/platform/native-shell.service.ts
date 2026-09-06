import { DOCUMENT, Location } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter, take } from 'rxjs';
import { DEFAULT_LOCALE } from '../../i18n/config/locale.config';
import { LocalePreferenceService } from '../../i18n/locale-preference.service';
import { LocaleUrlService } from '../../i18n/locale-url.service';
import { NativeBridgeService } from './native-bridge.service';
import { PlatformService } from './platform.service';

/**
 * Everything the packaged app needs that a browser gives you for free:
 * a themed status bar, a splash screen that goes away at the right moment,
 * a hardware back button that behaves, and a launch that lands in the
 * language the user actually chose.
 *
 * All of it is a no-op on the web, so the same `AppComponent` drives both.
 */
@Injectable({ providedIn: 'root' })
export class NativeShellService {
  private readonly platform = inject(PlatformService);
  private readonly bridge = inject(NativeBridgeService);
  private readonly document = inject(DOCUMENT);
  private readonly router = inject(Router);
  private readonly location = inject(Location);
  private readonly localeUrl = inject(LocaleUrlService);
  private readonly preference = inject(LocalePreferenceService);

  private started = false;

  /**
   * Runs once, from `AppComponent`. Deliberately not an app initializer:
   * the locale redirect below needs a live `Router`, and the splash screen
   * should only lift once the first route has actually painted.
   */
  start(): void {
    if (this.started || !this.platform.isNative) {
      return;
    }
    this.started = true;

    // Lets the stylesheet suppress browser-only affordances (text selection on
    // chrome, tap highlights, rubber-band overscroll) that read as bugs in a
    // native shell - without those rules ever reaching the web build's CSSOM.
    this.document.documentElement.classList.add('native-shell');

    this.restoreStartupLocale();
    void this.bindBackButton();
    void this.themeStatusBar();
    void this.hideSplashAfterFirstRender();
  }

  /**
   * Every launch loads `index.html` at `/`, which is English. If the user
   * has chosen another language, redirect once - `replaceUrl` so the
   * hardware back button never walks back into the wrong language.
   */
  private restoreStartupLocale(): void {
    const locale = this.preference.resolveStartupLocale();
    if (locale === DEFAULT_LOCALE) {
      return;
    }
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        take(1),
      )
      .subscribe((event) => {
        const target = this.localeUrl.localize(event.urlAfterRedirects, locale);
        if (target !== event.urlAfterRedirects) {
          void this.router.navigateByUrl(target, { replaceUrl: true });
        }
      });
  }

  /**
   * Android's hardware/gesture back must unwind the app's own history, and
   * exit only from the top of the stack. Without a listener Capacitor's
   * default is to close the app on any back press, which would drop a
   * half-finished calculation from the middle of the wizard.
   */
  private async bindBackButton(): Promise<void> {
    try {
      const app = await this.bridge.app();
      if (!app) {
        return;
      }
      await app.plugin.addListener('backButton', ({ canGoBack }) => {
        const atRoot = this.localeUrl.stripLocale(this.router.url).replace(/\?.*$/, '') === '/';
        if (canGoBack && !atRoot) {
          this.location.back();
          return;
        }
        void app.plugin.exitApp();
      });
    } catch {
      // Capacitor's own default (close the app) applies if we cannot bind.
    }
  }

  /**
   * Only the glyph colour is set here.
   *
   * The strip behind the status bar is handled per platform: iOS reserves it
   * in CSS through `env(safe-area-inset-top)`, while Android pads the native
   * content view in `MainActivity` (its WebView reports those insets as 0px,
   * and Android 15 ignores `setOverlaysWebView`/`setBackgroundColor`
   * outright). Both end up with brand green behind light glyphs.
   */
  private async themeStatusBar(): Promise<void> {
    const statusBar = await this.bridge.statusBar();
    if (!statusBar) {
      return;
    }
    const { StatusBar, Style } = statusBar.plugin;
    try {
      // Style.Dark = light glyphs (over Android's green strip);
      // Style.Light = dark glyphs (over the app's own white header on iOS).
      await StatusBar.setStyle({ style: this.platform.isAndroid ? Style.Dark : Style.Light });
    } catch {
      // Not every device exposes status bar control - the app is still usable.
    }
  }

  private async hideSplashAfterFirstRender(): Promise<void> {
    const splash = await this.bridge.splashScreen();
    if (!splash) {
      return;
    }
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        take(1),
      )
      .subscribe(() => {
        // One frame of headroom so the splash cross-fades into painted content
        // rather than a blank white flash.
        requestAnimationFrame(() => void splash.plugin.hide().catch(() => undefined));
      });
  }
}
