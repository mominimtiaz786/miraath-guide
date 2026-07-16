import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter, map, startWith } from 'rxjs';
import { AppFooterComponent } from './core/layout/app-footer/app-footer.component';
import { AppHeaderComponent } from './core/layout/app-header/app-header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AppHeaderComponent, AppFooterComponent],
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  private readonly router = inject(Router);

  // The wizard is a distinct, focused, full-screen experience with its own
  // compact header (spec section 12) - the standard site chrome is hidden
  // there to avoid showing two headers at once.
  private readonly isWizardRoute = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map((event) => event.urlAfterRedirects.startsWith('/calculator/wizard')),
      startWith(this.router.url.startsWith('/calculator/wizard')),
    ),
    { initialValue: false },
  );

  protected readonly showChrome = () => !this.isWizardRoute();
}
