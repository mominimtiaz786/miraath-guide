import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IconFeatureCardComponent } from '../../../shared/components/icon-feature-card/icon-feature-card.component';
import { ProcessStepComponent } from '../../../shared/components/process-step/process-step.component';
import { QuranReferenceCardComponent } from '../../../shared/components/quran-reference-card/quran-reference-card.component';
import { PrimaryButtonComponent } from '../../../shared/components/primary-button/primary-button.component';
import { AppIconComponent } from '../../../shared/icons/app-icon.component';

@Component({
  selector: 'app-calculator-intro-page',
  standalone: true,
  imports: [IconFeatureCardComponent, ProcessStepComponent, QuranReferenceCardComponent, PrimaryButtonComponent, AppIconComponent],
  templateUrl: './calculator-intro-page.component.html',
  styleUrl: './calculator-intro-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalculatorIntroPageComponent {
  protected readonly situations = [
    'Husband, wife and parents',
    'Parents and children',
    'One daughter with parents',
    'Daughters with no son',
    'Siblings in a kalalah case',
    'Awl adjustment',
    'Radd adjustment',
  ];
}
