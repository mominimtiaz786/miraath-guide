import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { PlatformService } from '../../../core/platform/platform.service';
import { AppLocale } from '../../../i18n/config/locale.types';
import { LocalePreferenceService } from '../../../i18n/locale-preference.service';
import { LocaleService } from '../../../i18n/locale.service';
import { LocaleUrlService } from '../../../i18n/locale-url.service';
import { TranslationService } from '../../../i18n/translation.service';
import { AppIconComponent } from '../../icons/app-icon.component';

/**
 * First-run language picker, shown once per install.
 *
 * On the web the URL answers this question - somebody arrives at `/ur/learn`
 * and that is the language they get. An app launch has no such signal, so
 * the choice has to be asked for explicitly rather than silently defaulting
 * five languages' worth of users into English. The device language only
 * pre-selects a row; nothing is persisted until the user confirms, which is
 * what keeps this screen from reappearing on the next launch.
 */
@Component({
  selector: 'app-language-gate',
  standalone: true,
  imports: [AppIconComponent],
  template: `
    @if (visible()) {
    <div class="gate" role="dialog" aria-modal="true" [attr.aria-label]="i18n.t('languageGate.heading')">
      <div class="panel">
        <span class="brand-icon" aria-hidden="true"><app-icon name="Languages" [size]="26" /></span>
        <h1>{{ i18n.t('languageGate.heading') }}</h1>
        <p>{{ i18n.t('languageGate.subheading') }}</p>

        <ul class="options">
          @for (option of options(); track option.code) {
            <li>
              <button
                type="button"
                [class.selected]="option.code === selected()"
                [attr.aria-pressed]="option.code === selected()"
                [attr.lang]="option.htmlLang"
                [attr.dir]="option.direction"
                (click)="select(option.code)"
              >
                <span class="native">{{ option.nativeLabel }}</span>
                <span class="latin">{{ option.label }}</span>
                @if (option.code === selected()) {
                  <app-icon name="Check" [size]="18" />
                }
              </button>
            </li>
          }
        </ul>

        <button type="button" class="btn btn-primary confirm" (click)="confirm()">
          {{ i18n.t('languageGate.confirm') }}
        </button>
      </div>
    </div>
    }
  `,
  styles: [
    `
      .gate {
        position: fixed;
        inset: 0;
        z-index: 500;
        background: var(--color-bg-ivory);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: calc(var(--space-6) + var(--safe-area-top)) var(--space-6)
          calc(var(--space-6) + var(--safe-area-bottom));
        overflow-y: auto;
      }
      .panel {
        width: 100%;
        max-width: 420px;
        display: flex;
        flex-direction: column;
        gap: var(--space-3);
        text-align: center;
      }
      .brand-icon {
        width: 52px;
        height: 52px;
        margin: 0 auto;
        border-radius: var(--radius-md);
        background: var(--color-green-soft-09);
        display: flex;
        align-items: center;
        justify-content: center;
      }
      h1 {
        font-size: var(--fs-card-heading);
        color: var(--color-primary);
      }
      p {
        color: var(--color-text-secondary);
        font-size: var(--fs-helper);
      }
      .options {
        list-style: none;
        margin: var(--space-3) 0 0;
        padding: 0;
        display: grid;
        gap: var(--space-2);
      }
      .options button {
        width: 100%;
        min-height: 56px;
        display: flex;
        align-items: center;
        gap: var(--space-3);
        padding: 0 var(--space-4);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-md);
        background: var(--color-surface);
        color: var(--color-text);
        cursor: pointer;
        text-align: start;
      }
      .options button.selected {
        border-color: var(--color-primary);
        background: var(--color-green-soft-06);
        box-shadow: inset 0 0 0 1px var(--color-primary);
      }
      .native {
        font-size: var(--fs-body-lg);
        font-weight: 700;
      }
      .latin {
        margin-inline-end: auto;
        font-size: var(--fs-helper);
        color: var(--color-text-secondary);
      }
      .confirm {
        margin-top: var(--space-4);
        width: 100%;
        justify-content: center;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LanguageGateComponent {
  private readonly localeService = inject(LocaleService);
  private readonly preference = inject(LocalePreferenceService);
  private readonly localeUrl = inject(LocaleUrlService);
  private readonly platform = inject(PlatformService);
  private readonly router = inject(Router);
  protected readonly i18n = inject(TranslationService);

  private readonly dismissed = signal(false);
  protected readonly selected = signal<AppLocale>(this.preference.resolveStartupLocale());

  protected readonly options = computed(() => this.localeService.supportedLocales());

  /** Only ever shown in the packaged app, and only until a choice is stored. */
  readonly visible = computed(() => this.platform.isNative && !this.preference.hasExplicitChoice() && !this.dismissed());

  select(locale: AppLocale): void {
    this.selected.set(locale);
  }

  confirm(): void {
    const locale = this.selected();
    this.localeService.setLocalePreference(locale);
    this.dismissed.set(true);
    void this.router.navigateByUrl(this.localeUrl.localize(this.router.url, locale), { replaceUrl: true });
  }
}
