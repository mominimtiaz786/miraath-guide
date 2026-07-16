import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { LocaleService } from '../../../core/services/locale.service';

@Component({
  selector: 'app-language-switcher',
  standalone: true,
  template: `
    <div class="switcher" role="group" aria-label="Language">
      <button
        type="button"
        [class.active]="locale.locale() === 'en'"
        [attr.aria-pressed]="locale.locale() === 'en'"
        (click)="locale.setLocale('en')"
      >
        EN
      </button>
      <button
        type="button"
        [class.active]="locale.locale() === 'ur'"
        [attr.aria-pressed]="locale.locale() === 'ur'"
        (click)="locale.setLocale('ur')"
      >
        اردو
      </button>
    </div>
  `,
  styles: [
    `
      .switcher {
        display: inline-flex;
        border: 1px solid var(--color-border);
        border-radius: var(--radius-pill);
        padding: 2px;
        gap: 2px;
      }
      button {
        border: none;
        background: transparent;
        color: var(--color-text-secondary);
        font-size: 13px;
        font-weight: 600;
        padding: 6px 12px;
        border-radius: var(--radius-pill);
        cursor: pointer;
      }
      button.active {
        background: var(--color-green-soft-09);
        color: var(--color-primary);
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LanguageSwitcherComponent {
  protected readonly locale = inject(LocaleService);
}
