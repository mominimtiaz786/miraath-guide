import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type IslamicPatternPosition = 'top-right' | 'bottom-left' | 'corner';

/**
 * Purely decorative geometric line motif (spec section 7) - a subtle nod to
 * Islamic star-pattern tiling, never covering more than a page corner.
 */
@Component({
  selector: 'app-islamic-pattern',
  standalone: true,
  template: `
    <svg
      class="pattern"
      [class]="position()"
      viewBox="0 0 200 200"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <g stroke="var(--color-primary)" stroke-width="1" opacity="0.14">
        <path
          d="M100 10 L140 50 L180 10 M100 10 L60 50 L20 10 M100 190 L140 150 L180 190 M100 190 L60 150 L20 190"
        />
        <rect x="60" y="60" width="80" height="80" transform="rotate(45 100 100)" />
        <rect x="75" y="75" width="50" height="50" transform="rotate(45 100 100)" />
        <circle cx="100" cy="100" r="55" />
      </g>
    </svg>
  `,
  styles: [
    `
      :host {
        display: block;
      }
      .pattern {
        width: 200px;
        height: 200px;
      }
      .pattern.top-right {
        position: absolute;
        top: -40px;
        right: -40px;
      }
      .pattern.bottom-left {
        position: absolute;
        bottom: -40px;
        left: -40px;
      }
      .pattern.corner {
        width: 120px;
        height: 120px;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IslamicPatternComponent {
  readonly position = input<IslamicPatternPosition>('corner');
}
