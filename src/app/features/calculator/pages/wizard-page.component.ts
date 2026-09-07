import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { WizardProgressComponent } from '../../../shared/components/wizard-progress/wizard-progress.component';
import { WizardQuestionCardComponent } from '../../../shared/components/wizard-question-card/wizard-question-card.component';
import { ChoiceOption, YesNoChoiceComponent } from '../../../shared/components/yes-no-choice/yes-no-choice.component';
import { CountSelectorComponent } from '../../../shared/components/count-selector/count-selector.component';
import { AppIconComponent } from '../../../shared/icons/app-icon.component';
import { CalculatorAnswers, DeceasedGender } from '../models/calculator-answers.model';
import { WIZARD_QUESTION_CONTENT } from '../engine/questions/wizard-question-content';
import { CalculatorStore } from '../state/calculator-store.service';
import { LocaleUrlService } from '../../../i18n/locale-url.service';
import { TranslationService } from '../../../i18n/translation.service';

@Component({
  selector: 'app-wizard-page',
  standalone: true,
  imports: [
    RouterLink,
    WizardProgressComponent,
    WizardQuestionCardComponent,
    YesNoChoiceComponent,
    CountSelectorComponent,
    AppIconComponent,
  ],
  templateUrl: './wizard-page.component.html',
  styleUrl: './wizard-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WizardPageComponent {
  protected readonly store = inject(CalculatorStore);
  private readonly router = inject(Router);
  protected readonly i18n = inject(TranslationService);
  protected readonly localeUrl = inject(LocaleUrlService);

  protected readonly genderOptions = computed<ChoiceOption<DeceasedGender>[]>(() => [
    { value: 'male', label: this.i18n.t('common.male'), icon: 'PersonStanding' },
    { value: 'female', label: this.i18n.t('common.female'), icon: 'PersonStanding' },
  ]);
  protected readonly yesNoOptions = computed<ChoiceOption<boolean>[]>(() => [
    { value: true, label: this.i18n.t('common.yes'), icon: 'Check' },
    { value: false, label: this.i18n.t('common.no'), icon: 'X' },
  ]);

  protected readonly stepId = this.store.currentStepId;
  protected readonly answers = this.store.answers;
  protected readonly content = computed(() => {
    const base = WIZARD_QUESTION_CONTENT[this.stepId()];
    const key = `wizard.${this.stepId()}`;
    return {
      ...base,
      question: this.i18n.t(`${key}.question`),
      helper: this.i18n.has(`${key}.helper`, this.i18n.locale()) ? this.i18n.t(`${key}.helper`) : base.helper,
      whyWeAsk: this.i18n.has(`${key}.whyWeAsk`, this.i18n.locale()) ? this.i18n.t(`${key}.whyWeAsk`) : base.whyWeAsk,
    };
  });

  protected readonly answerKey = computed(() => this.stepId() as unknown as keyof CalculatorAnswers);

  protected currentValue(): unknown {
    return this.answers()[this.answerKey()];
  }

  onChoiceChange(value: unknown): void {
    this.store.setAnswer(this.answerKey(), value as never);
  }

  onCountChange(value: number): void {
    this.store.setAnswer(this.answerKey(), value as never);
  }

  onEstateChange(value: string): void {
    const parsed = value.trim() === '' ? null : Number(value);
    this.store.setAnswer('estateValue', Number.isFinite(parsed) ? parsed : null);
  }

  continue(): void {
    const outcome = this.store.goNext();
    if (outcome === 'review') {
      this.router.navigateByUrl(this.localeUrl.localize('/calculator/review'));
    }
  }

  back(): void {
    const moved = this.store.goBack();
    if (!moved) {
      this.router.navigateByUrl(this.localeUrl.localize('/calculator'));
    }
  }

  exit(): void {
    this.router.navigateByUrl(this.localeUrl.localize('/calculator'));
  }
}
