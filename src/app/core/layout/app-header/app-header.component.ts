import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AppIconComponent } from '../../../shared/icons/app-icon.component';
import { PrimaryButtonComponent } from '../../../shared/components/primary-button/primary-button.component';
import { LanguageSwitcherComponent } from '../../../shared/components/language-switcher/language-switcher.component';

interface NavLink {
  label: string;
  path: string;
}

const NAV_LINKS: NavLink[] = [
  { label: 'Calculator', path: '/calculator' },
  { label: 'Common Cases', path: '/common-cases' },
  { label: 'Learn Faraid', path: '/learn' },
  { label: 'Methodology', path: '/methodology' },
  { label: 'About', path: '/about' },
];

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, AppIconComponent, PrimaryButtonComponent, LanguageSwitcherComponent],
  templateUrl: './app-header.component.html',
  styleUrl: './app-header.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppHeaderComponent {
  protected readonly navLinks = NAV_LINKS;
  protected readonly menuOpen = signal(false);

  toggleMenu(): void {
    this.menuOpen.update((open) => !open);
  }

  closeMenu(): void {
    this.menuOpen.set(false);
  }
}
