import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ReviewItem, ReviewSectionComponent } from '../../../shared/components/review-section/review-section.component';
import { PrimaryButtonComponent } from '../../../shared/components/primary-button/primary-button.component';
import { AppIconComponent } from '../../../shared/icons/app-icon.component';
import { CalculatorStore } from '../state/calculator-store.service';
import { CalculationEngineService } from '../engine/calculation-engine.service';
import { resolveReason } from '../engine/explanations/explanation-engine';
import { WizardStepId } from '../models/wizard-step.model';

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

  protected readonly preview = computed(() => this.engine.calculate(this.store.answers()));

  protected readonly deceasedItems = computed<ReviewItem[]>(() => {
    const a = this.store.answers();
    return [{ label: 'Gender', value: a.deceasedGender === 'male' ? 'Male' : a.deceasedGender === 'female' ? 'Female' : 'Not answered' }];
  });

  protected readonly spouseItems = computed<ReviewItem[]>(() => {
    const a = this.store.answers();
    const items: ReviewItem[] = [];
    if (a.deceasedGender === 'female') {
      items.push({ label: 'Husband alive', value: a.husbandAlive ? 'Yes' : 'No' });
    } else if (a.deceasedGender === 'male') {
      items.push({ label: 'Wives surviving', value: `${a.wivesCount ?? 0}` });
    }
    return items;
  });

  protected readonly parentsItems = computed<ReviewItem[]>(() => {
    const a = this.store.answers();
    const items: ReviewItem[] = [{ label: 'Father alive', value: a.fatherAlive ? 'Yes' : 'No' }];
    if (a.fatherAlive === false) {
      items.push({ label: 'Paternal grandfather alive', value: a.paternalGrandfatherAlive ? 'Yes' : 'No' });
    }
    items.push({ label: 'Mother alive', value: a.motherAlive ? 'Yes' : 'No' });
    if (a.motherAlive === false) {
      items.push({ label: 'Eligible grandmothers', value: `${a.grandmothersCount ?? 0}` });
    }
    return items;
  });

  protected readonly childrenItems = computed<ReviewItem[]>(() => {
    const a = this.store.answers();
    if (a.hasDescendants !== true) {
      return [{ label: 'Children or descendants', value: 'None' }];
    }
    const items: ReviewItem[] = [
      { label: 'Sons', value: `${a.sonsCount}` },
      { label: 'Daughters', value: `${a.daughtersCount}` },
    ];
    if (a.sonsCount === 0) {
      items.push({ label: "Son's sons", value: `${a.paternalGrandsonsCount}` });
      items.push({ label: "Son's daughters", value: `${a.paternalGranddaughtersCount}` });
    }
    return items;
  });

  protected readonly siblingsItems = computed<ReviewItem[]>(() => {
    const a = this.store.answers();
    const facts = this.store.derivedFacts();
    const items: ReviewItem[] = [];
    if (a.siblingsForMotherShareCount != null) {
      items.push({ label: 'Siblings (for mother\'s share only)', value: `${a.siblingsForMotherShareCount}` });
    }
    if (!facts.fatherFigure && !facts.maleDescendant) {
      items.push({ label: 'Full brothers', value: `${a.fullBrothersCount}` });
      items.push({ label: 'Full sisters', value: `${a.fullSistersCount}` });
      if (!facts.anyDescendant) {
        items.push({ label: 'Maternal siblings', value: `${a.maternalSiblingsCount}` });
      }
      items.push({ label: 'Paternal half-brothers', value: `${a.paternalHalfBrothersCount}` });
      items.push({ label: 'Paternal half-sisters', value: `${a.paternalHalfSistersCount}` });
    }
    return items;
  });

  protected readonly extendedItems = computed<ReviewItem[]>(() => {
    const a = this.store.answers();
    const visible = this.store.visibleSteps();
    const chainSteps: { id: WizardStepId; label: string; value: number }[] = [
      { id: 'fullNephewsCount', label: "Full brothers' sons", value: a.fullNephewsCount },
      { id: 'halfNephewsCount', label: "Paternal half-brothers' sons", value: a.halfNephewsCount },
      { id: 'fullNephewsSonsCount', label: "Full nephews' sons", value: a.fullNephewsSonsCount },
      { id: 'halfNephewsSonsCount', label: "Half nephews' sons", value: a.halfNephewsSonsCount },
      { id: 'fullUnclesCount', label: 'Full paternal uncles', value: a.fullUnclesCount },
      { id: 'halfUnclesCount', label: 'Paternal half-uncles', value: a.halfUnclesCount },
      { id: 'fullCousinsCount', label: 'Full paternal cousins', value: a.fullCousinsCount },
      { id: 'halfCousinsCount', label: 'Paternal half-cousins', value: a.halfCousinsCount },
    ];
    return chainSteps.filter((s) => visible.includes(s.id)).map((s) => ({ label: s.label, value: `${s.value}` }));
  });

  protected readonly estateItems = computed<ReviewItem[]>(() => {
    const a = this.store.answers();
    return [{ label: 'Distributable estate', value: a.estateValue != null ? `PKR ${a.estateValue.toLocaleString()}` : 'Not provided' }];
  });

  protected readonly skippedExplanations = computed(() => {
    const categoryBlocked = this.preview().blockedHeirs.filter((b) => b.detectionLevel === 'category');
    const seen = new Set<string>();
    const unique = categoryBlocked.filter((b) => {
      if (seen.has(b.reasonCode)) return false;
      seen.add(b.reasonCode);
      return true;
    });
    return unique.map((b) => resolveReason(b.reasonCode).simple);
  });

  editSection(stepId: WizardStepId): void {
    this.store.goToStep(stepId);
    this.router.navigateByUrl('/calculator/wizard');
  }

  calculateShares(): void {
    this.store.calculate();
    this.router.navigateByUrl('/calculator/results');
  }
}
