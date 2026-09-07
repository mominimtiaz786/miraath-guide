import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter, map, startWith } from 'rxjs';
import { AppLocale } from '../../../i18n/config/locale.types';
import { LocaleService } from '../../../i18n/locale.service';
import { LocaleUrlService } from '../../../i18n/locale-url.service';
import { TranslationService } from '../../../i18n/translation.service';

@Component({
  selector: 'app-language-switcher',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="switcher">
      <button
        type="button"
        class="trigger"
        [attr.aria-label]="i18n.t('language.label')"
        [attr.aria-expanded]="open()"
        aria-haspopup="menu"
        (click)="toggle()"
        (keydown.escape)="close()"
      >
        <span>{{ currentLabel() }}</span>
        <span aria-hidden="true">⌄</span>
      </button>

      @if (open()) {
        <div class="menu" role="menu">
          @for (option of options(); track option.code) {
            <a
              role="menuitemradio"
              [attr.aria-checked]="option.active"
              [routerLink]="option.url"
              (click)="select(option.code)"
            >
              <span>{{ option.nativeLabel }}</span>
              @if (option.active) {
                <span class="current">{{ i18n.t('language.current') }}</span>
              }
            </a>
          }
        </div>
      }
    </div>
  `,
  styles: [
    `
      .switcher {
        position: relative;
        display: inline-flex;
      }
      .trigger {
        display: inline-flex;
        align-items: center;
        gap: var(--space-2);
        min-height: 38px;
        border: 1px solid var(--color-border);
        background: var(--color-bg);
        color: var(--color-text);
        font-size: 13px;
        font-weight: 700;
        padding: 0 12px;
        border-radius: var(--radius-md);
        cursor: pointer;
      }
      .menu {
        position: absolute;
        inset-block-start: calc(100% + 6px);
        inset-inline-end: 0;
        z-index: 30;
        max-width: calc(100vw - (var(--space-6) * 2));
        min-width: 180px;
        display: grid;
        gap: 2px;
        padding: 6px;
        border: 1px solid var(--color-border);
        border-radius: var(--radius-md);
        background: var(--color-bg);
        box-shadow: var(--shadow-soft);
      }
      a {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: var(--space-3);
        padding: 8px 10px;
        border-radius: var(--radius-sm);
        color: var(--color-text);
        text-decoration: none;
        font-weight: 600;
        white-space: nowrap;
      }
      a:hover,
      a[aria-checked='true'] {
        background: var(--color-green-soft-09);
      }
      .current {
        color: var(--color-text-secondary);
        font-size: 11px;
        font-weight: 600;
      }
      :host-context(.nav-mobile) .menu {
        inset-inline-start: 0;
        inset-inline-end: auto;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LanguageSwitcherComponent {
  protected readonly locale = inject(LocaleService);
  protected readonly i18n = inject(TranslationService);
  private readonly localeUrl = inject(LocaleUrlService);
  private readonly router = inject(Router);
  protected readonly open = signal(false);

  private readonly currentUrl = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map((event) => event.urlAfterRedirects),
      startWith(this.router.url),
    ),
    { initialValue: this.router.url },
  );

  protected readonly currentLabel = computed(() => this.locale.definition().nativeLabel);

  protected readonly options = computed(() =>
    this.locale.supportedLocales().map((definition) => ({
      ...definition,
      active: definition.code === this.locale.locale(),
      url: this.localeUrl.switchLocale(this.currentUrl(), definition.code),
    })),
  );

  toggle(): void {
    this.open.update((value) => !value);
  }

  close(): void {
    this.open.set(false);
  }

  select(locale: AppLocale): void {
    this.locale.setLocalePreference(locale);
    this.close();
  }
}
