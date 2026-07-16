import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { AppIconComponent } from '../../icons/app-icon.component';

export interface ReviewItem {
  label: string;
  value: string;
}

@Component({
  selector: 'app-review-section',
  standalone: true,
  imports: [AppIconComponent],
  template: `
    <section class="review-section">
      <header>
        <h3>{{ title() }}</h3>
        <button type="button" class="edit-btn" (click)="edit.emit()">
          <app-icon name="ArrowLeft" [size]="14" />
          Edit
        </button>
      </header>
      @if (items().length === 0) {
        <p class="empty">Not applicable in this case.</p>
      } @else {
        <dl>
          @for (item of items(); track item.label) {
            <div class="row">
              <dt>{{ item.label }}</dt>
              <dd>{{ item.value }}</dd>
            </div>
          }
        </dl>
      }
    </section>
  `,
  styles: [
    `
      .review-section {
        background: var(--color-bg);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-lg);
        padding: var(--space-5);
      }
      header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: var(--space-3);
      }
      h3 {
        font-size: var(--fs-card-heading);
        font-weight: 600;
      }
      .edit-btn {
        display: flex;
        align-items: center;
        gap: var(--space-1);
        background: none;
        border: none;
        color: var(--color-primary);
        font-weight: 600;
        font-size: var(--fs-helper);
        cursor: pointer;
        --icon-color: var(--color-primary);
      }
      dl {
        margin: 0;
        display: flex;
        flex-direction: column;
        gap: var(--space-2);
      }
      .row {
        display: flex;
        justify-content: space-between;
        gap: var(--space-3);
        font-size: var(--fs-body);
      }
      dt {
        color: var(--color-text-secondary);
      }
      dd {
        margin: 0;
        font-weight: 600;
        color: var(--color-text);
        text-align: right;
      }
      .empty {
        margin: 0;
        color: var(--color-text-secondary);
        font-size: var(--fs-body);
        font-style: italic;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReviewSectionComponent {
  readonly title = input.required<string>();
  readonly items = input.required<ReviewItem[]>();
  readonly edit = output<void>();
}
