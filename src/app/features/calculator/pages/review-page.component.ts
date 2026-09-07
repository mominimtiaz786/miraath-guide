import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ReviewItem, ReviewSectionComponent } from '../../../shared/components/review-section/review-section.component';
import { PrimaryButtonComponent } from '../../../shared/components/primary-button/primary-button.component';
import { AppIconComponent } from '../../../shared/icons/app-icon.component';
import { CalculatorStore } from '../state/calculator-store.service';
import { CalculationEngineService } from '../engine/calculation-engine.service';
import { ExplanationEngine } from '../engine/explanations/explanation-engine';
import { WizardStepId } from '../models/wizard-step.model';
import { LocaleUrlService } from '../../../i18n/locale-url.service';
import { TranslationService } from '../../../i18n/translation.service';

@Component({
  selector: 'app-review-page',
  standalone: true,
  imports: [ReviewSectionComponent, PrimaryButtonComponent, AppIconComponent],
  templateUrl: './review-page.component.html',
  styleUrl: './review-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReviewPageComponent {
  protected readonly store = inject(CalculatorStore);
  private readonly engine = inject(CalculationEngineService);
  private readonly router = inject(Router);
  protected readonly i18n = inject(TranslationService);
  private readonly localeUrl = inject(LocaleUrlService);
  private readonly explanations = inject(ExplanationEngine);

  protected readonly preview = computed(() => this.engine.calculate(this.store.answers()));

  protected readonly deceasedItems = computed<ReviewItem[]>(() => {
    const a = this.store.answers();
    return [
      {
        label: this.i18n.t('reviewPage.labels.gender'),
        value:
          a.deceasedGender === 'male'
            ? this.i18n.t('common.male')
            : a.deceasedGender === 'female'
              ? this.i18n.t('common.female')
              : this.i18n.t('common.notAnswered'),
      },
    ];
  });

  protected readonly spouseItems = computed<ReviewItem[]>(() => {
    const a = this.store.answers();
    const items: ReviewItem[] = [];
    if (a.deceasedGender === 'female') {
      items.push({ label: this.i18n.t('reviewPage.labels.husbandAlive'), value: a.husbandAlive ? this.i18n.t('common.yes') : this.i18n.t('common.no') });
    } else if (a.deceasedGender === 'male') {
      items.push({ label: this.i18n.t('reviewPage.labels.wivesSurviving'), value: `${a.wivesCount ?? 0}` });
    }
    return items;
  });

  protected readonly parentsItems = computed<ReviewItem[]>(() => {
    const a = this.store.answers();
    const items: ReviewItem[] = [{ label: this.i18n.t('reviewPage.labels.fatherAlive'), value: a.fatherAlive ? this.i18n.t('common.yes') : this.i18n.t('common.no') }];
    if (a.fatherAlive === false) {
      items.push({ label: this.i18n.t('reviewPage.labels.paternalGrandfatherAlive'), value: a.paternalGrandfatherAlive ? this.i18n.t('common.yes') : this.i18n.t('common.no') });
    }
    items.push({ label: this.i18n.t('reviewPage.labels.motherAlive'), value: a.motherAlive ? this.i18n.t('common.yes') : this.i18n.t('common.no') });
    if (a.motherAlive === false) {
      items.push({ label: this.i18n.t('reviewPage.labels.eligibleGrandmothers'), value: `${a.grandmothersCount ?? 0}` });
    }
    return items;
  });

  protected readonly childrenItems = computed<ReviewItem[]>(() => {
    const a = this.store.answers();
    if (a.hasDescendants !== true) {
      return [{ label: this.i18n.t('reviewPage.labels.childrenOrDescendants'), value: this.i18n.t('reviewPage.labels.none') }];
    }
    const items: ReviewItem[] = [
      { label: this.i18n.t('reviewPage.labels.sons'), value: `${a.sonsCount}` },
      { label: this.i18n.t('reviewPage.labels.daughters'), value: `${a.daughtersCount}` },
    ];
    if (a.sonsCount === 0) {
      items.push({ label: this.i18n.t('reviewPage.labels.sonsSons'), value: `${a.paternalGrandsonsCount}` });
      items.push({ label: this.i18n.t('reviewPage.labels.sonsDaughters'), value: `${a.paternalGranddaughtersCount}` });
    }
    return items;
  });

  protected readonly siblingsItems = computed<ReviewItem[]>(() => {
    const a = this.store.answers();
    const facts = this.store.derivedFacts();
    const items: ReviewItem[] = [];
    if (a.siblingsForMotherShareCount != null) {
      items.push({ label: this.i18n.t('reviewPage.labels.siblingsMother'), value: `${a.siblingsForMotherShareCount}` });
    }
    if (!facts.fatherFigure && !facts.maleDescendant) {
      items.push({ label: this.i18n.t('reviewPage.labels.fullBrothers'), value: `${a.fullBrothersCount}` });
      items.push({ label: this.i18n.t('reviewPage.labels.fullSisters'), value: `${a.fullSistersCount}` });
      if (!facts.anyDescendant) {
        items.push({ label: this.i18n.t('reviewPage.labels.maternalSiblings'), value: `${a.maternalSiblingsCount}` });
      }
      items.push({ label: this.i18n.t('reviewPage.labels.paternalHalfBrothers'), value: `${a.paternalHalfBrothersCount}` });
      items.push({ label: this.i18n.t('reviewPage.labels.paternalHalfSisters'), value: `${a.paternalHalfSistersCount}` });
    }
    return items;
  });

  protected readonly extendedItems = computed<ReviewItem[]>(() => {
    const a = this.store.answers();
    const visible = this.store.visibleSteps();
    const chainSteps: { id: WizardStepId; label: string; value: number }[] = [
      { id: 'fullNephewsCount', label: this.i18n.t('reviewPage.labels.fullNephews'), value: a.fullNephewsCount },
      { id: 'halfNephewsCount', label: this.i18n.t('reviewPage.labels.halfNephews'), value: a.halfNephewsCount },
      { id: 'fullNephewsSonsCount', label: this.i18n.t('reviewPage.labels.fullNephewsSons'), value: a.fullNephewsSonsCount },
      { id: 'halfNephewsSonsCount', label: this.i18n.t('reviewPage.labels.halfNephewsSons'), value: a.halfNephewsSonsCount },
      { id: 'fullUnclesCount', label: this.i18n.t('reviewPage.labels.fullUncles'), value: a.fullUnclesCount },
      { id: 'halfUnclesCount', label: this.i18n.t('reviewPage.labels.halfUncles'), value: a.halfUnclesCount },
      { id: 'fullCousinsCount', label: this.i18n.t('reviewPage.labels.fullCousins'), value: a.fullCousinsCount },
      { id: 'halfCousinsCount', label: this.i18n.t('reviewPage.labels.halfCousins'), value: a.halfCousinsCount },
    ];
    return chainSteps.filter((s) => visible.includes(s.id)).map((s) => ({ label: s.label, value: `${s.value}` }));
  });

  protected readonly estateItems = computed<ReviewItem[]>(() => {
    const a = this.store.answers();
    return [{ label: this.i18n.t('reviewPage.labels.distributableEstate'), value: a.estateValue != null ? `PKR ${a.estateValue.toLocaleString()}` : this.i18n.t('common.notProvided') }];
  });

  protected readonly skippedExplanations = computed(() => {
    const categoryBlocked = this.preview().blockedHeirs.filter((b) => b.detectionLevel === 'category');
    const seen = new Set<string>();
    const unique = categoryBlocked.filter((b) => {
      if (seen.has(b.reasonCode)) return false;
      seen.add(b.reasonCode);
      return true;
    });
    return unique.map((b) => this.explanations.resolve(b.reasonCode).simple);
  });

  editSection(stepId: WizardStepId): void {
    this.store.goToStep(stepId);
    this.router.navigateByUrl(this.localeUrl.localize('/calculator/wizard'));
  }

  calculateShares(): void {
    this.store.calculate();
    this.router.navigateByUrl(this.localeUrl.localize('/calculator/results'));
  }
}
