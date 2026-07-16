import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { SOURCE_REFERENCES } from '../../../data/sources/sources.data';
import { AppIconComponent } from '../../icons/app-icon.component';

@Component({
  selector: 'app-source-reference',
  standalone: true,
  imports: [AppIconComponent],
  template: `
    <ul class="sources">
      @for (id of sourceIds(); track id) {
        @if (source(id); as ref) {
          <li class="source-pill" [title]="ref.translation">
            <app-icon name="BookMarked" [size]="14" />
            {{ ref.label }}
          </li>
        }
      }
    </ul>
  `,
  styles: [
    `
      .sources {
        list-style: none;
        margin: 0;
        padding: 0;
        display: flex;
        flex-wrap: wrap;
        gap: var(--space-2);
      }
      .source-pill {
        display: inline-flex;
        align-items: center;
        gap: var(--space-1);
        background: var(--color-gold-soft-12);
        color: var(--color-gold);
        border-radius: var(--radius-pill);
        padding: var(--space-1) var(--space-3);
        font-size: 12px;
        font-weight: 600;
        --icon-color: var(--color-gold);
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SourceReferenceComponent {
  readonly sourceIds = input.required<string[]>();

  protected source(id: string) {
    return SOURCE_REFERENCES[id];
  }
}
