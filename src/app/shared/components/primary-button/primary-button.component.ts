import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AppIconComponent } from '../../icons/app-icon.component';

@Component({
  selector: 'app-primary-button',
  standalone: true,
  imports: [RouterLink, AppIconComponent],
  templateUrl: './primary-button.component.html',
  styleUrl: './primary-button.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrimaryButtonComponent {
  readonly routerLink = input<string | null>(null);
  readonly type = input<'button' | 'submit'>('button');
  readonly disabled = input<boolean>(false);
  readonly showArrow = input<boolean>(true);
  readonly fullWidth = input<boolean>(false);
}
