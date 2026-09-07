import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PrimaryButtonComponent } from '../../shared/components/primary-button/primary-button.component';
import { AppIconComponent } from '../../shared/icons/app-icon.component';
import { LocaleUrlService } from '../../i18n/locale-url.service';
import { TranslationService } from '../../i18n/translation.service';

@Component({
  selector: 'app-not-found-page',
  standalone: true,
  imports: [PrimaryButtonComponent, AppIconComponent, RouterLink],
  template: `
    <section class="wrap">
      <span class="icon-badge"><app-icon name="TriangleAlert" [size]="28" /></span>
      <p class="eyebrow">404</p>
      <h1>{{ i18n.t('notFound.heading') }}</h1>
      <p>
        {{ i18n.t('notFound.body') }}
      </p>
      <div class="actions">
        <app-primary-button [routerLink]="localeUrl.localize('/')">{{ i18n.t('notFound.cta') }}</app-primary-button>
      </div>
    </section>
  `,
  styles: [
    `
      .wrap {
        max-width: 520px;
        margin: 0 auto;
        padding: var(--space-24) var(--space-6);
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: var(--space-3);
      }
      .icon-badge {
        width: 64px;
        height: 64px;
        border-radius: var(--radius-pill);
        background: var(--color-green-soft-09);
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: var(--space-2);
      }
      h1 {
        font-size: var(--fs-page-heading);
      }
      p {
        color: var(--color-text-secondary);
        font-size: var(--fs-body-lg);
      }
      .actions {
        margin-top: var(--space-4);
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotFoundPageComponent {
  protected readonly i18n = inject(TranslationService);
  protected readonly localeUrl = inject(LocaleUrlService);
}
