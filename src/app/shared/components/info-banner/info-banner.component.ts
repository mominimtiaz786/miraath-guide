import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { AppIconComponent } from '../../icons/app-icon.component';
import { AppIconName } from '../../icons/icon-registry';

export type InfoBannerTone = 'green' | 'gold' | 'charcoal';

@Component({
  selector: 'app-info-banner',
  standalone: true,
  imports: [AppIconComponent],
  template: `
    <div class="banner" [class]="tone()" role="note">
      <app-icon [name]="icon()" [size]="20" />
      <div class="text">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styles: [
    `
      .banner {
        display: flex;
        align-items: flex-start;
        gap: var(--space-3);
        padding: var(--space-4) var(--space-5);
        border-radius: var(--radius-md);
        font-size: var(--fs-body);
      }
      .banner.green {
        background: var(--color-green-soft-06);
        --icon-color: var(--color-primary);
        color: var(--color-text);
      }
      .banner.gold {
        background: var(--color-gold-soft-12);
        --icon-color: var(--color-gold);
        color: var(--color-text);
      }
      .banner.charcoal {
        background: var(--color-charcoal-soft-06);
        --icon-color: var(--color-charcoal);
        color: var(--color-text);
      }
      .text {
        display: flex;
        flex-direction: column;
        gap: var(--space-1);
      }
      .text ::ng-deep p {
        margin: 0;
        color: var(--color-text-secondary);
      }
      .text ::ng-deep strong {
        color: var(--color-text);
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InfoBannerComponent {
  readonly icon = input<AppIconName>('Info');
  readonly tone = input<InfoBannerTone>('green');
}
