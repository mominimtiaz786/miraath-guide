import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { AppIconComponent } from '../../icons/app-icon.component';

@Component({
  selector: 'app-quran-reference-card',
  standalone: true,
  imports: [AppIconComponent],
  template: `
    <figure class="card">
      <div class="icon-badge"><app-icon name="BookOpen" [size]="20" /></div>
      <div class="content">
        @if (arabic()) {
          <p class="arabic" lang="ar" dir="rtl">{{ arabic() }}</p>
        }
        <blockquote>
          <p class="translation">{{ translation() }}</p>
          <cite>— {{ reference() }}</cite>
        </blockquote>
      </div>
    </figure>
  `,
  styles: [
    `
      .card {
        display: flex;
        gap: var(--space-4);
        background: var(--color-bg-gold-tint);
        border: 1px solid var(--color-gold-soft-30);
        border-radius: var(--radius-lg);
        padding: var(--space-6);
        margin: 0;
      }
      .icon-badge {
        flex-shrink: 0;
        width: 40px;
        height: 40px;
        border-radius: var(--radius-md);
        background: var(--color-white);
        display: flex;
        align-items: center;
        justify-content: center;
        --icon-color: var(--color-gold);
      }
      .content {
        display: flex;
        flex-direction: column;
        gap: var(--space-3);
        min-width: 0;
      }
      .arabic {
        font-family: var(--font-quranic);
        font-size: 24px;
        line-height: 1.9;
        color: var(--color-text);
        margin: 0;
      }
      blockquote {
        margin: 0;
        display: flex;
        flex-direction: column;
        gap: var(--space-2);
      }
      .translation {
        margin: 0;
        color: var(--color-text-secondary);
        font-size: var(--fs-body);
      }
      cite {
        font-style: normal;
        font-weight: 600;
        color: var(--color-gold);
        font-size: var(--fs-helper);
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuranReferenceCardComponent {
  readonly arabic = input<string | null>(null);
  readonly translation = input.required<string>();
  readonly reference = input.required<string>();
}
