import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ExplanationEntry } from '../../../features/calculator/models/calculation-result.model';
import { AppIconComponent } from '../../icons/app-icon.component';

@Component({
  selector: 'app-blocked-heir-card',
  standalone: true,
  imports: [AppIconComponent],
  template: `
    <article class="blocked-card">
      <div class="icon-badge"><app-icon name="UserX" [size]="18" /></div>
      <div class="text">
        <h3>{{ explanation().relationship }}</h3>
        <p class="status">Does not inherit in this case</p>
        <p class="reason">{{ explanation().simple }}</p>
      </div>
    </article>
  `,
  styles: [
    `
      .blocked-card {
        display: flex;
        gap: var(--space-4);
        background: var(--color-charcoal-soft-06);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-lg);
        padding: var(--space-5);
      }
      .icon-badge {
        flex-shrink: 0;
        width: 36px;
        height: 36px;
        border-radius: var(--radius-md);
        background: var(--color-bg);
        display: flex;
        align-items: center;
        justify-content: center;
        --icon-color: var(--color-charcoal);
      }
      h3 {
        font-size: var(--fs-card-heading);
        font-weight: 600;
        margin-bottom: 2px;
      }
      .status {
        margin: 0 0 var(--space-2);
        font-size: var(--fs-helper);
        font-weight: 600;
        color: var(--color-text-secondary);
        text-transform: uppercase;
        letter-spacing: 0.04em;
      }
      .reason {
        margin: 0;
        color: var(--color-text-secondary);
        font-size: var(--fs-body);
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlockedHeirCardComponent {
  readonly explanation = input.required<ExplanationEntry>();
}
