import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { AppIconComponent } from '../../icons/app-icon.component';
import { AppIconName } from '../../icons/icon-registry';

@Component({
  selector: 'app-process-step',
  standalone: true,
  imports: [AppIconComponent],
  template: `
    <div class="step">
      <div class="badge" [class.active]="active()">
        @if (icon(); as iconName) {
          <app-icon [name]="iconName" [size]="22" />
        } @else {
          {{ index() }}
        }
      </div>
      <h3>{{ heading() }}</h3>
      <p>{{ description() }}</p>
    </div>
  `,
  styles: [
    `
      .step {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: var(--space-2);
        text-align: left;
      }
      .badge {
        width: 44px;
        height: 44px;
        border-radius: var(--radius-pill);
        background: var(--color-green-soft-09);
        color: var(--color-primary);
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 700;
        --icon-color: var(--color-primary);
      }
      .badge.active {
        background: var(--color-primary);
        color: var(--color-on-primary);
        --icon-color: var(--color-on-primary);
      }
      h3 {
        font-size: var(--fs-card-heading);
        font-weight: 600;
      }
      p {
        margin: 0;
        color: var(--color-text-secondary);
        font-size: var(--fs-body);
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProcessStepComponent {
  readonly index = input.required<number>();
  readonly heading = input.required<string>();
  readonly description = input.required<string>();
  readonly icon = input<AppIconName | null>(null);
  readonly active = input<boolean>(false);
}
