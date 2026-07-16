import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { AppIconComponent } from '../../icons/app-icon.component';

@Component({
  selector: 'app-count-selector',
  standalone: true,
  imports: [AppIconComponent],
  template: `
    <div class="count-selector">
      <button
        type="button"
        class="step-btn"
        (click)="decrement()"
        [disabled]="value() <= min()"
        aria-label="Decrease count"
      >
        <app-icon name="Minus" [size]="18" />
      </button>
      <span class="value numeric" aria-live="polite">{{ value() }}</span>
      <button
        type="button"
        class="step-btn"
        (click)="increment()"
        [disabled]="value() >= max()"
        aria-label="Increase count"
      >
        <app-icon name="Plus" [size]="18" />
      </button>
    </div>
  `,
  styles: [
    `
      .count-selector {
        display: inline-flex;
        align-items: center;
        gap: var(--space-5);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-lg);
        padding: var(--space-3) var(--space-6);
        background: var(--color-bg);
      }
      .step-btn {
        width: 44px;
        height: 44px;
        border-radius: var(--radius-pill);
        border: 1px solid var(--color-border);
        background: var(--color-bg);
        color: var(--color-primary);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        --icon-color: var(--color-primary);
      }
      .step-btn:hover:not(:disabled) {
        background: var(--color-green-soft-06);
      }
      .step-btn:disabled {
        opacity: 0.35;
        cursor: not-allowed;
      }
      .value {
        font-size: var(--fs-fraction-lg);
        font-weight: 700;
        min-width: 2ch;
        text-align: center;
        color: var(--color-text);
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CountSelectorComponent {
  readonly value = input.required<number>();
  readonly min = input<number>(0);
  readonly max = input<number>(20);
  readonly valueChange = output<number>();

  increment(): void {
    if (this.value() < this.max()) {
      this.valueChange.emit(this.value() + 1);
    }
  }

  decrement(): void {
    if (this.value() > this.min()) {
      this.valueChange.emit(this.value() - 1);
    }
  }
}
