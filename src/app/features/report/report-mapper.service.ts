import { Injectable, inject } from '@angular/core';
import { SOURCE_REFERENCES } from '../../data/sources/sources.data';
import { CalculationResult } from '../calculator/models/calculation-result.model';
import { ExplanationEngine } from '../calculator/engine/explanations/explanation-engine';
import { heirLabel } from '../calculator/models/heir-labels';
import { ReportModel } from './report.model';

const DISCLAIMER =
  'Mirath Guide is an educational calculation aid based on the implemented Hanafi methodology. Complex cases, disputed facts, local law, estate ownership, debts, bequests, missing persons, unborn heirs, and other special circumstances should be reviewed by a qualified scholar and relevant legal professional. This is not a fatwa and does not constitute legal advice.';

/** Converts a CalculationResult into a PDF-ready report model, keeping rendering separate from inheritance logic (spec section 21.J). */
@Injectable({ providedIn: 'root' })
export class ReportMapperService {
  private readonly explanationEngine = inject(ExplanationEngine);

  map(result: CalculationResult): ReportModel {
    const eligibleExplanations = this.explanationEngine.buildEligibleExplanations(result.eligibleHeirs);
    const blockedExplanations = this.explanationEngine.buildBlockedExplanations(result.blockedHeirs);

    const familySummary: string[] = [
      `Deceased: ${result.answers.deceasedGender === 'male' ? 'Male' : 'Female'}`,
    ];
    if (result.answers.deceasedGender === 'female') {
      familySummary.push(`Husband alive: ${result.answers.husbandAlive ? 'Yes' : 'No'}`);
    } else {
      familySummary.push(`Wives surviving: ${result.answers.wivesCount ?? 0}`);
    }
    familySummary.push(`Father alive: ${result.answers.fatherAlive ? 'Yes' : 'No'}`);
    familySummary.push(`Mother alive: ${result.answers.motherAlive ? 'Yes' : 'No'}`);
    familySummary.push(`Sons: ${result.answers.sonsCount}, Daughters: ${result.answers.daughtersCount}`);

    const eligibleHeirs = result.eligibleHeirs.map((share, index) => {
      const explanation = eligibleExplanations[index];
      return {
        relationship: heirLabel(share.relationship, share.count),
        fraction: share.poolShare.toDisplayString(),
        percentage: `${share.poolShare.toPercentage(2)}%`,
        amount: result.estateValue != null ? `PKR ${share.poolShare.toMoney(result.estateValue).toLocaleString()}` : null,
        shareType: share.shareType,
        reason: explanation?.simple ?? '',
      };
    });

    const blockedHeirs = result.blockedHeirs.map((blocked, index) => ({
      relationship: heirLabel(blocked.relationship, 2),
      reason: blockedExplanations[index]?.simple ?? '',
    }));

    const sourceIds = new Set<string>();
    result.explanations.forEach((entry) => entry.sourceRefs.forEach((id) => sourceIds.add(id)));

    return {
      generatedDate: new Date().toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' }),
      methodology: 'Hanafi',
      familySummary,
      estateValue: result.estateValue,
      eligibleHeirs,
      blockedHeirs,
      detailedSteps: result.detailedSteps,
      adjustments: result.adjustments.map((a) => a.description),
      sourceReferences: Array.from(sourceIds).map((id) => ({
        label: SOURCE_REFERENCES[id]?.label ?? id,
        translation: SOURCE_REFERENCES[id]?.translation ?? '',
      })),
      disclaimer: DISCLAIMER,
    };
  }
}
