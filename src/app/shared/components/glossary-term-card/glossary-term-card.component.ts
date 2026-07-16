import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { GlossaryTerm } from '../../../data/glossary/glossary-term.model';
import { AppIconComponent } from '../../icons/app-icon.component';

@Component({
  selector: 'app-glossary-term-card',
  standalone: true,
  imports: [AppIconComponent],
  template: `
    <article class="term-card" [id]="term().term.toLowerCase().replace(' ', '-')">
      <div class="icon-badge"><app-icon [name]="term().icon" [size]="20" /></div>
      <div class="text">
        <h3>
          {{ term().term }}
          @if (term().romanUrdu) {
            <span class="roman-urdu">({{ term().romanUrdu }})</span>
          }
        </h3>
        <p>{{ term().definition }}</p>
      </div>
    </article>
  `,
  styles: [
    `
      .term-card {
        display: flex;
        gap: var(--space-4);
        background: var(--color-bg);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-md);
        padding: var(--space-5);
      }
      .icon-badge {
        flex-shrink: 0;
        width: 40px;
        height: 40px;
        border-radius: var(--radius-md);
        background: var(--color-green-soft-09);
        display: flex;
        align-items: center;
        justify-content: center;
      }
      h3 {
        font-size: var(--fs-card-heading);
        font-weight: 600;
        margin-bottom: var(--space-1);
      }
      .roman-urdu {
        font-weight: 400;
        font-size: var(--fs-helper);
        color: var(--color-text-secondary);
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
export class GlossaryTermCardComponent {
  readonly term = input.required<GlossaryTerm>();
}
