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

const GENDER_OPTIONS: ChoiceOption<DeceasedGender>[] = [
  { value: 'male', label: 'Male', icon: 'PersonStanding' },
  { value: 'female', label: 'Female', icon: 'PersonStanding' },
];

const YES_NO_OPTIONS: ChoiceOption<boolean>[] = [
  { value: true, label: 'Yes', icon: 'Check' },
  { value: false, label: 'No', icon: 'X' },
];

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

  protected readonly genderOptions = GENDER_OPTIONS;
  protected readonly yesNoOptions = YES_NO_OPTIONS;

  protected readonly stepId = this.store.currentStepId;
  protected readonly answers = this.store.answers;
  protected readonly content = computed(() => WIZARD_QUESTION_CONTENT[this.stepId()]);

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
      this.router.navigateByUrl('/calculator/review');
    }
  }

  back(): void {
    const moved = this.store.goBack();
    if (!moved) {
      this.router.navigateByUrl('/calculator');
    }
  }

  exit(): void {
    this.router.navigateByUrl('/calculator');
  }
}
