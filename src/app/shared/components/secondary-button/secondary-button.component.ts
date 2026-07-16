import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AppIconComponent } from '../../icons/app-icon.component';

@Component({
  selector: 'app-secondary-button',
  standalone: true,
  imports: [RouterLink, AppIconComponent, NgTemplateOutlet],
  template: `
    <ng-template #content>
      <ng-content></ng-content>
    </ng-template>
    @if (routerLink()) {
      <a class="btn btn-secondary" [class.full-width]="fullWidth()" [routerLink]="routerLink()">
        <ng-container [ngTemplateOutlet]="content"></ng-container>
        @if (showIcon()) {
          <app-icon [name]="showIcon()!" [size]="18" />
        }
      </a>
    } @else {
      <button class="btn btn-secondary" [class.full-width]="fullWidth()" [type]="type()" [disabled]="disabled()">
        <ng-container [ngTemplateOutlet]="content"></ng-container>
        @if (showIcon()) {
          <app-icon [name]="showIcon()!" [size]="18" />
        }
      </button>
    }
  `,
  styles: [':host { display: inline-flex; }'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SecondaryButtonComponent {
  readonly routerLink = input<string | null>(null);
  readonly type = input<'button' | 'submit'>('button');
  readonly disabled = input<boolean>(false);
  readonly fullWidth = input<boolean>(false);
  readonly showIcon = input<'CirclePlay' | null>(null);
}
