import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-section-heading',
  standalone: true,
  template: `
    <div class="section-heading" [class.centered]="centered()">
      @if (eyebrow()) {
        <p class="eyebrow">{{ eyebrow() }}</p>
      }
      <h2>{{ heading() }}</h2>
      @if (subheading()) {
        <p class="subheading">{{ subheading() }}</p>
      }
    </div>
  `,
  styles: [
    `
      .section-heading {
        max-width: var(--content-width);
        display: flex;
        flex-direction: column;
        gap: var(--space-3);
      }
      .section-heading.centered {
        margin-inline: auto;
        text-align: center;
      }
      h2 {
        font-size: var(--fs-section-heading);
        color: var(--color-text);
      }
      .subheading {
        font-size: var(--fs-body-lg);
        color: var(--color-text-secondary);
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SectionHeadingComponent {
  readonly eyebrow = input<string | null>(null);
  readonly heading = input.required<string>();
  readonly subheading = input<string | null>(null);
  readonly centered = input<boolean>(false);
}
