import { ChangeDetectionStrategy, Component, ElementRef, effect, inject, input, output, viewChild } from '@angular/core';
import { AppIconComponent } from '../../icons/app-icon.component';
import { TranslationService } from '../../../i18n/translation.service';

@Component({
  selector: 'app-wizard-question-card',
  standalone: true,
  imports: [AppIconComponent],
  templateUrl: './wizard-question-card.component.html',
  styleUrl: './wizard-question-card.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WizardQuestionCardComponent {
  protected readonly i18n = inject(TranslationService);
  readonly question = input.required<string>();
  readonly helper = input<string | null>(null);
  readonly whyWeAsk = input<string | null>(null);
  readonly canContinue = input<boolean>(true);
  readonly showBack = input<boolean>(true);
  readonly continueLabel = input<string | null>(null);

  readonly back = output<void>();
  readonly continue = output<void>();

  private readonly headingRef = viewChild<ElementRef<HTMLHeadingElement>>('questionHeading');

  constructor() {
    // Move focus to the new question heading whenever it changes (spec section 26).
    effect(() => {
      this.question();
      const heading = this.headingRef()?.nativeElement;
      if (heading) {
        queueMicrotask(() => heading.focus());
      }
    });
  }
}
