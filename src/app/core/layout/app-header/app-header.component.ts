import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LocaleUrlService } from '../../../i18n/locale-url.service';
import { TranslationService } from '../../../i18n/translation.service';
import { AppIconComponent } from '../../../shared/icons/app-icon.component';
import { PrimaryButtonComponent } from '../../../shared/components/primary-button/primary-button.component';
import { LanguageSwitcherComponent } from '../../../shared/components/language-switcher/language-switcher.component';

interface NavLink {
  labelKey: string;
  path: string;
}

const NAV_LINKS: NavLink[] = [
  { labelKey: 'nav.calculator', path: '/calculator' },
  { labelKey: 'nav.commonCases', path: '/common-cases' },
  { labelKey: 'nav.learn', path: '/learn' },
  { labelKey: 'nav.methodology', path: '/methodology' },
  { labelKey: 'nav.about', path: '/about' },
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
  protected readonly i18n = inject(TranslationService);
  protected readonly localeUrl = inject(LocaleUrlService);
  protected readonly navLinks = NAV_LINKS;
  protected readonly menuOpen = signal(false);

  toggleMenu(): void {
    this.menuOpen.update((open) => !open);
  }

  closeMenu(): void {
    this.menuOpen.set(false);
  }
}
