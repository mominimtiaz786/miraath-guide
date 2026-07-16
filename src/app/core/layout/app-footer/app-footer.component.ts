import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AppIconComponent } from '../../../shared/icons/app-icon.component';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink, AppIconComponent],
  templateUrl: './app-footer.component.html',
  styleUrl: './app-footer.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppFooterComponent {
  protected readonly year = new Date().getFullYear();
}
