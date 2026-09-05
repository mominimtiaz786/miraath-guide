import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { PageHeroComponent } from '../../shared/components/page-hero/page-hero.component';
import { SectionHeadingComponent } from '../../shared/components/section-heading/section-heading.component';
import { ProcessStepComponent } from '../../shared/components/process-step/process-step.component';
import { IconFeatureCardComponent } from '../../shared/components/icon-feature-card/icon-feature-card.component';
import { PrimaryButtonComponent } from '../../shared/components/primary-button/primary-button.component';
import { AppIconComponent } from '../../shared/icons/app-icon.component';
import { SourceRepository } from '../../data/sources/source.repository';
import { LocaleUrlService } from '../../i18n/locale-url.service';
import { TranslationService } from '../../i18n/translation.service';

@Component({
  selector: 'app-methodology-page',
  standalone: true,
  imports: [
    PageHeroComponent,
    SectionHeadingComponent,
    ProcessStepComponent,
    IconFeatureCardComponent,
    PrimaryButtonComponent,
    AppIconComponent,
  ],
  templateUrl: './methodology-page.component.html',
  styleUrl: './methodology-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MethodologyPageComponent {
  protected readonly i18n = inject(TranslationService);
  protected readonly localeUrl = inject(LocaleUrlService);
  private readonly sourceRepository = inject(SourceRepository);
  protected readonly sources = this.sourceRepository.all;
  protected readonly methodologyChips = () => this.i18n.value<string[]>('methodologyPage.chips');
  protected readonly includedItems = () => this.i18n.value<string[]>('methodologyPage.included');
}
