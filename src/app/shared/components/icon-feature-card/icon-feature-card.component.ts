import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { AppIconComponent } from '../../icons/app-icon.component';
import { AppIconName } from '../../icons/icon-registry';

@Component({
  selector: 'app-icon-feature-card',
  standalone: true,
  imports: [AppIconComponent],
  template: `
    <div class="card">
      <div class="icon-badge" [class.gold]="accent() === 'gold'">
        <app-icon [name]="icon()" [size]="24" />
      </div>
      <h3>{{ heading() }}</h3>
      <p>{{ description() }}</p>
    </div>
  `,
  styles: [
    `
      .card {
        background: var(--color-bg);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-lg);
        padding: var(--space-6);
        box-shadow: var(--shadow-card);
        display: flex;
        flex-direction: column;
        gap: var(--space-3);
        height: 100%;
        transition:
          transform var(--transition-fast),
          box-shadow var(--transition-fast);
      }
      .card:hover {
        transform: translateY(-2px);
        box-shadow: var(--shadow-card-strong);
      }
      .icon-badge {
        width: 48px;
        height: 48px;
        border-radius: var(--radius-md);
        background: var(--color-green-soft-09);
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .icon-badge.gold {
        background: var(--color-gold-soft-12);
        --icon-color: var(--color-gold);
      }
      h3 {
        font-size: var(--fs-card-heading);
        font-weight: 600;
        color: var(--color-text);
      }
      p {
        font-size: var(--fs-body);
        color: var(--color-text-secondary);
        margin: 0;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconFeatureCardComponent {
  readonly icon = input.required<AppIconName>();
  readonly heading = input.required<string>();
  readonly description = input.required<string>();
  readonly accent = input<'green' | 'gold'>('green');
}
