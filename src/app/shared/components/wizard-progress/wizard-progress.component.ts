import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { WizardSection, WIZARD_SECTION_ORDER } from '../../../features/calculator/models/wizard-step.model';
import { TranslationService } from '../../../i18n/translation.service';
import { AppIconComponent } from '../../icons/app-icon.component';
import { AppIconName } from '../../icons/icon-registry';

const SECTION_ICONS: Record<WizardSection, AppIconName> = {
  deceased: 'UserRound',
  immediateFamily: 'UsersRound',
  childrenDescendants: 'Baby',
  siblings: 'UsersRound',
  extendedFamily: 'Network',
  estate: 'FileText',
  review: 'CircleCheck',
};

@Component({
  selector: 'app-wizard-progress',
  standalone: true,
  imports: [AppIconComponent],
  templateUrl: './wizard-progress.component.html',
  styleUrl: './wizard-progress.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WizardProgressComponent {
  readonly currentSection = input.required<WizardSection>();
  readonly percent = input.required<number>();

  protected readonly i18n = inject(TranslationService);
  protected readonly sections = WIZARD_SECTION_ORDER;
  protected readonly sectionIcons = SECTION_ICONS;

  protected sectionLabel(section: WizardSection): string {
    return this.i18n.t(`wizard.sections.${section}`);
  }

  protected sectionState(section: WizardSection): 'done' | 'active' | 'upcoming' {
    const currentIndex = this.sections.indexOf(this.currentSection());
    const sectionIndex = this.sections.indexOf(section);
    if (sectionIndex < currentIndex) return 'done';
    if (sectionIndex === currentIndex) return 'active';
    return 'upcoming';
  }
}
