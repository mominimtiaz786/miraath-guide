import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { IconFeatureCardComponent } from '../../../shared/components/icon-feature-card/icon-feature-card.component';
import { ProcessStepComponent } from '../../../shared/components/process-step/process-step.component';
import { QuranReferenceCardComponent } from '../../../shared/components/quran-reference-card/quran-reference-card.component';
import { PrimaryButtonComponent } from '../../../shared/components/primary-button/primary-button.component';
import { AppIconComponent } from '../../../shared/icons/app-icon.component';
import { LocaleUrlService } from '../../../i18n/locale-url.service';
import { TranslationService } from '../../../i18n/translation.service';

@Component({
  selector: 'app-calculator-intro-page',
  standalone: true,
  imports: [IconFeatureCardComponent, ProcessStepComponent, QuranReferenceCardComponent, PrimaryButtonComponent, AppIconComponent],
  templateUrl: './calculator-intro-page.component.html',
  styleUrl: './calculator-intro-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalculatorIntroPageComponent {
  protected readonly i18n = inject(TranslationService);
  protected readonly localeUrl = inject(LocaleUrlService);
  protected readonly situations = () => this.i18n.value<string[]>('calculatorIntro.situations');
  protected readonly features = () => this.i18n.value<string[][]>('calculatorIntro.features');
  protected readonly steps = () => this.i18n.value<string[][]>('calculatorIntro.steps');
}
