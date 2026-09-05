import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PageHeroComponent } from '../../shared/components/page-hero/page-hero.component';
import { InfoBannerComponent } from '../../shared/components/info-banner/info-banner.component';
import { LocaleUrlService } from '../../i18n/locale-url.service';
import { TranslationService } from '../../i18n/translation.service';

@Component({
  selector: 'app-about-page',
  standalone: true,
  imports: [PageHeroComponent, InfoBannerComponent, RouterLink],
  templateUrl: './about-page.component.html',
  styleUrl: '../misc/misc-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutPageComponent {
  protected readonly i18n = inject(TranslationService);
  protected readonly localeUrl = inject(LocaleUrlService);
}
