import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PageHeroComponent } from '../../shared/components/page-hero/page-hero.component';
import { IconFeatureCardComponent } from '../../shared/components/icon-feature-card/icon-feature-card.component';
import { LocaleUrlService } from '../../i18n/locale-url.service';
import { TranslationService } from '../../i18n/translation.service';

@Component({
  selector: 'app-privacy-page',
  standalone: true,
  imports: [PageHeroComponent, IconFeatureCardComponent, RouterLink],
  templateUrl: './privacy-page.component.html',
  styleUrl: './misc-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrivacyPageComponent {
  protected readonly i18n = inject(TranslationService);
  protected readonly localeUrl = inject(LocaleUrlService);
  protected readonly notDoItems = () => this.i18n.value<string[]>('privacyPage.notDo');
}
