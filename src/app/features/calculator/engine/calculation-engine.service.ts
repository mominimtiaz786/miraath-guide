import { Injectable, inject } from '@angular/core';
import { Fraction } from '../../../shared/utils/fraction';
import { CalculatorAnswers } from '../models/calculator-answers.model';
import { AdjustmentRecord, CalculationResult, DetailedCalculationStep } from '../models/calculation-result.model';
import { BlockedHeirGroup, EligibleHeirShare, HeirRelationship, ShareType } from '../models/heir.model';
import { heirLabel } from '../models/heir-labels';
import { applyAwl, applyRadd } from './adjustment-engine';
import { computeResiduaryChain } from './asabah-engine';
import { computeRoutingBlockedCategories, computeSpecificBlockedCases } from './blocking-engine';
import { deriveFacts } from './derive-facts';
import { ExplanationEngine } from './explanations/explanation-engine';
import { FixedShareDraft, computeFixedShares } from './fixed-share-engine';

function shareTypeForReasonCode(reasonCode: string): ShareType {
  const lower = reasonCode.toLowerCase();
  if (lower.includes('umariyyatayn')) {
    return reasonCode.startsWith('father') ? 'residuary' : 'fixed';
  }
  if (lower.includes('fixedplusresidue')) {
    return 'fixed-plus-residue';
  }
  if (lower.includes('residue') || lower.includes('residuary') || lower.includes('maaghayr')) {
    return 'residuary';
  }
  return 'fixed';
}

@Injectable({ providedIn: 'root' })
export class CalculationEngineService {
  private readonly explanationEngine = inject(ExplanationEngine);

  calculate(answers: CalculatorAnswers): CalculationResult {
    const facts = deriveFacts(answers);
    const fixedResult = computeFixedShares(answers, facts);
    const detailedSteps: DetailedCalculationStep[] = [];
    const adjustments: AdjustmentRecord[] = [];

    detailedSteps.push({
      label: 'Fixed shares assigned',
      value: fixedResult.shares.map((s) => `${heirLabel(s.relationship, s.count)}: ${s.poolShare.toDisplayString()}`).join(', ') || 'None',
    });

    let workingShares: FixedShareDraft[] = fixedResult.shares;
    let residue = Fraction.zero();
    let unassignedRemainder = Fraction.zero();
    let unassignedRemainderNote: string | null = null;

    if (fixedResult.umariyyatayn) {
      adjustments.push({
        type: 'umariyyatayn',
        description: "Umariyyatayn applied: the mother's third is calculated on the remainder after the spouse's share, not the whole estate.",
      });
      detailedSteps.push({ label: 'Umariyyatayn', value: 'Applied - see mother and father reasons.' });
    } else {
      const fixedTotal = Fraction.sum(workingShares.map((s) => s.poolShare));
      detailedSteps.push({ label: 'Total fixed shares', value: fixedTotal.toDisplayString() });

      if (fixedTotal.greaterThan(Fraction.one())) {
        const awl = applyAwl(workingShares);
        workingShares = awl.shares;
        if (awl.adjustment) {
          adjustments.push(awl.adjustment);
          detailedSteps.push({ label: 'Awl adjustment', value: awl.adjustment.description });
        }
      } else {
        residue = Fraction.one().subtract(fixedTotal);
        detailedSteps.push({ label: 'Residue after fixed shares', value: residue.toDisplayString() });

        const asabah = computeResiduaryChain(answers, facts, residue);
        if (asabah.tier !== null) {
          detailedSteps.push({ label: 'Residuary (Asabah) tier', value: `Tier ${asabah.tier}: ${asabah.tierLabel}` });
          for (const allocation of asabah.allocations) {
            const existingIndex = workingShares.findIndex((s) => s.relationship === allocation.relationship);
            if (existingIndex >= 0) {
              const existing = workingShares[existingIndex];
              workingShares[existingIndex] = {
                ...existing,
                poolShare: existing.poolShare.add(allocation.poolShare),
                reasonCode: `${existing.relationship}.fixedPlusResidue`,
              };
              // relationship is always 'father' or 'paternalGrandfather' here, matching the dictionary keys above.
            } else {
              workingShares.push({
                relationship: allocation.relationship,
                count: allocation.count,
                poolShare: allocation.poolShare,
                reasonCode: allocation.reasonCode,
              });
            }
          }
        } else {
          const radd = applyRadd(workingShares, residue);
          workingShares = radd.shares;
          unassignedRemainder = radd.unassignedRemainder;
          unassignedRemainderNote = radd.unassignedRemainderNote;
          if (radd.adjustment) {
            adjustments.push(radd.adjustment);
            detailedSteps.push({ label: 'Radd adjustment', value: radd.adjustment.description });
          } else if (unassignedRemainderNote) {
            detailedSteps.push({ label: 'Unassigned remainder', value: unassignedRemainderNote });
          }
        }
      }
    }

    const finalShares: EligibleHeirShare[] = workingShares
      .filter((s) => s.count > 0 && s.poolShare.greaterThan(Fraction.zero()))
      .map((s) => ({
        relationship: s.relationship,
        count: s.count,
        poolShare: s.poolShare,
        perPersonShare: s.poolShare.divide(Fraction.of(s.count)),
        shareType: shareTypeForReasonCode(s.reasonCode),
        reasonCode: s.reasonCode,
        sourceRefs: [],
      }));

    const eligibleRelationships = new Set<HeirRelationship>(finalShares.map((s) => s.relationship));

    const blockedHeirs: BlockedHeirGroup[] = [
      ...computeRoutingBlockedCategories(answers, facts),
      ...computeSpecificBlockedCases(answers, facts, eligibleRelationships),
    ];

    const explanations = this.explanationEngine.buildEligibleExplanations(finalShares);
    finalShares.forEach((share, index) => {
      share.sourceRefs = explanations[index]?.sourceRefs ?? [];
    });

    const fixedSharesTotal = Fraction.sum(fixedResult.shares.map((s) => s.poolShare));

    return {
      answers,
      derivedFacts: facts,
      eligibleHeirs: finalShares,
      blockedHeirs,
      fixedSharesTotal,
      residue,
      adjustments,
      finalShares,
      explanations,
      detailedSteps,
      validationWarnings: [],
      estateValue: answers.estateValue,
      unassignedRemainder,
      unassignedRemainderNote,
    };
  }
}
