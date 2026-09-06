import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter, map, startWith } from 'rxjs';
import { AppFooterComponent } from './core/layout/app-footer/app-footer.component';
import { AppHeaderComponent } from './core/layout/app-header/app-header.component';
import { NativeShellService } from './core/platform/native-shell.service';
import { SeoService } from './core/seo/seo.service';
import { LanguageGateComponent } from './shared/components/language-gate/language-gate.component';
import { LocaleService } from './i18n/locale.service';
import { LocaleUrlService } from './i18n/locale-url.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AppHeaderComponent, AppFooterComponent, LanguageGateComponent],
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  private readonly router = inject(Router);
  private readonly localeUrl = inject(LocaleUrlService);
  private readonly locale = inject(LocaleService);
  // Injected purely to trigger its constructor, which subscribes to router
  // navigation and keeps title/meta/canonical tags in sync (spec section 6).
  private readonly seo = inject(SeoService);
  // Status bar theming, the splash hand-off, the Android back button and the
  // stored-language redirect. Every one of these no-ops on the web.
  private readonly nativeShell = inject(NativeShellService);

  constructor() {
    this.nativeShell.start();
  }

  // The wizard is a distinct, focused, full-screen experience with its own
  // compact header (spec section 12) - the standard site chrome is hidden
  // there to avoid showing two headers at once.
  private readonly isWizardRoute = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map((event) => this.localeUrl.stripLocale(event.urlAfterRedirects).startsWith('/calculator/wizard')),
      startWith(this.localeUrl.stripLocale(this.router.url).startsWith('/calculator/wizard')),
    ),
    { initialValue: false },
  );

  protected readonly showChrome = () => !this.isWizardRoute();
}
