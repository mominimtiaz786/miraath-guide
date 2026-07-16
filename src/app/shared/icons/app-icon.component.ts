import { NgComponentOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { APP_ICONS, AppIconName } from './icon-registry';

/**
 * Single entry point for every icon in the app - keeps the outline style,
 * stroke width, and default green color consistent everywhere (spec section 9).
 * Renders the matching Lucide icon component dynamically so callers never
 * need to import individual icon components themselves.
 */
@Component({
  selector: 'app-icon',
  standalone: true,
  imports: [NgComponentOutlet],
  template: `
    <ng-container
      *ngComponentOutlet="iconComponent(); inputs: { size: size(), strokeWidth: strokeWidth() }"
    ></ng-container>
  `,
  styles: [
    `
      :host {
        display: inline-flex;
        color: var(--icon-color, var(--color-primary));
        line-height: 0;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppIconComponent {
  readonly name = input.required<AppIconName>();
  readonly size = input<number>(20);
  readonly strokeWidth = input<number>(1.75);

  protected readonly iconComponent = computed(() => APP_ICONS[this.name()]);
}
