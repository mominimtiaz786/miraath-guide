import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { AppIconComponent } from '../../icons/app-icon.component';
import { AppIconName } from '../../icons/icon-registry';

export interface ChoiceOption<T> {
  value: T;
  label: string;
  icon: AppIconName;
}

/**
 * A pair of large choice cards - used for Yes/No questions and the one
 * other strictly-binary wizard question (deceased's gender). Never a
 * dropdown, and never includes a "Not sure" option (spec section 12).
 */
@Component({
  selector: 'app-yes-no-choice',
  standalone: true,
  imports: [AppIconComponent],
  template: `
    <div class="choices" role="radiogroup">
      @for (option of options(); track option.label) {
        <button
          type="button"
          class="choice-card"
          role="radio"
          [class.selected]="value() === option.value"
          [attr.aria-checked]="value() === option.value"
          (click)="valueChange.emit(option.value)"
        >
          <app-icon [name]="option.icon" [size]="28" />
          <span>{{ option.label }}</span>
        </button>
      }
    </div>
  `,
  styles: [
    `
      .choices {
        display: flex;
        gap: var(--space-4);
        flex-wrap: wrap;
      }
      .choice-card {
        flex: 1;
        min-width: 140px;
        min-height: 44px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: var(--space-3);
        padding: var(--space-6);
        border-radius: var(--radius-lg);
        border: 1px solid var(--color-border);
        background: var(--color-bg);
        cursor: pointer;
        font-size: var(--fs-body-lg);
        font-weight: 600;
        color: var(--color-text);
        --icon-color: var(--color-text-secondary);
        transition:
          border-color var(--transition-fast),
          background var(--transition-fast),
          box-shadow var(--transition-fast);
      }
      .choice-card:hover {
        border-color: var(--color-primary);
      }
      .choice-card.selected {
        border-color: var(--color-primary);
        background: var(--color-green-soft-06);
        box-shadow: var(--shadow-card-strong);
        --icon-color: var(--color-primary);
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class YesNoChoiceComponent<T> {
  readonly value = input<T | null>(null);
  readonly options = input.required<ChoiceOption<T>[]>();
  readonly valueChange = output<T>();
}
