import { CalculatorAnswers } from '../models/calculator-answers.model';
import { DerivedFacts } from '../models/derived-facts.model';
import { BlockedHeirGroup, HeirRelationship } from '../models/heir.model';

/**
 * Routing-level blocking: relatives the wizard never even asked about
 * because a closer heir made the question moot. These are always
 * reported as category-level statements (spec section 13B.6).
 */
export function computeRoutingBlockedCategories(
  answers: CalculatorAnswers,
  facts: DerivedFacts,
): BlockedHeirGroup[] {
  const blocked: BlockedHeirGroup[] = [];

  if (answers.fatherAlive === true) {
    blocked.push({
      relationship: 'paternalGrandfather',
      detectionLevel: 'category',
      reasonCode: 'blocked.grandfatherByFather',
      blockingRelationship: 'father',
    });
  }

  if (answers.motherAlive === true) {
    blocked.push({
      relationship: 'grandmother',
      detectionLevel: 'category',
      reasonCode: 'blocked.grandmotherByMother',
      blockingRelationship: 'mother',
    });
  }

  if (facts.fatherFigure) {
    const blockingRelationship: HeirRelationship = facts.fatherFigureType === 'father' ? 'father' : 'paternalGrandfather';
    (['fullBrother', 'fullSister', 'paternalHalfBrother', 'paternalHalfSister', 'maternalSibling'] as HeirRelationship[]).forEach(
      (relationship) => {
        blocked.push({
          relationship,
          detectionLevel: 'category',
          reasonCode: 'blocked.siblingsByFatherFigure',
          blockingRelationship,
        });
      },
    );
  } else if (facts.maleDescendant) {
    const blockingRelationship: HeirRelationship = answers.sonsCount > 0 ? 'son' : 'sonsSon';
    (['fullBrother', 'fullSister', 'paternalHalfBrother', 'paternalHalfSister', 'maternalSibling'] as HeirRelationship[]).forEach(
      (relationship) => {
        blocked.push({
          relationship,
          detectionLevel: 'category',
          reasonCode: 'blocked.siblingsByMaleDescendant',
          blockingRelationship,
        });
      },
    );
  }

  if (facts.fatherFigure || facts.maleDescendant) {
    const blockingRelationship: HeirRelationship = facts.fatherFigure
      ? facts.fatherFigureType === 'father'
        ? 'father'
        : 'paternalGrandfather'
      : answers.sonsCount > 0
        ? 'son'
        : 'sonsSon';
    (
      [
        'fullNephew',
        'halfNephew',
        'fullNephewsSon',
        'halfNephewsSon',
        'fullUncle',
        'halfUncle',
        'fullCousin',
        'halfCousin',
      ] as HeirRelationship[]
    ).forEach((relationship) => {
      blocked.push({
        relationship,
        detectionLevel: 'category',
        reasonCode: 'blocked.extendedByCloserHeir',
        blockingRelationship,
      });
    });
  }

  return blocked;
}

/**
 * Specific blocking: a count WAS collected for this relationship, but it
 * ends up with zero share because a nearer or fuller-blood relative of the
 * same tier already absorbed the group's share.
 */
export function computeSpecificBlockedCases(
  answers: CalculatorAnswers,
  facts: DerivedFacts,
  eligibleRelationships: ReadonlySet<HeirRelationship>,
): BlockedHeirGroup[] {
  const blocked: BlockedHeirGroup[] = [];
  const isEligible = (relationship: HeirRelationship): boolean => eligibleRelationships.has(relationship);

  if (
    answers.sonsCount === 0 &&
    answers.paternalGrandsonsCount === 0 &&
    answers.daughtersCount >= 2 &&
    answers.paternalGranddaughtersCount > 0 &&
    !isEligible('sonsDaughter')
  ) {
    blocked.push({
      relationship: 'sonsDaughter',
      detectionLevel: 'specific',
      reasonCode: 'blocked.sonsDaughterByDaughters',
      blockingRelationship: 'daughter',
    });
  }

  const siblingsFixedShareGate = !facts.maleDescendant && !facts.fatherFigure;
  if (
    siblingsFixedShareGate &&
    !facts.femaleDescendant &&
    answers.paternalHalfBrothersCount === 0 &&
    answers.fullSistersCount >= 2 &&
    answers.paternalHalfSistersCount > 0 &&
    !isEligible('paternalHalfSister')
  ) {
    blocked.push({
      relationship: 'paternalHalfSister',
      detectionLevel: 'specific',
      reasonCode: 'blocked.paternalHalfSisterByFullSisters',
      blockingRelationship: 'fullSister',
    });
  }

  if (siblingsFixedShareGate && answers.fullBrothersCount > 0 && answers.paternalHalfBrothersCount > 0) {
    blocked.push({
      relationship: 'paternalHalfBrother',
      detectionLevel: 'specific',
      reasonCode: 'blocked.paternalHalfBrotherByFullBrothers',
      blockingRelationship: 'fullBrother',
    });
    if (answers.paternalHalfSistersCount > 0) {
      blocked.push({
        relationship: 'paternalHalfSister',
        detectionLevel: 'specific',
        reasonCode: 'blocked.paternalHalfSisterByFullBrothers',
        blockingRelationship: 'fullBrother',
      });
    }
  } else if (
    siblingsFixedShareGate &&
    answers.fullBrothersCount === 0 &&
    answers.fullSistersCount > 0 &&
    facts.femaleDescendant &&
    answers.paternalHalfBrothersCount > 0
  ) {
    blocked.push({
      relationship: 'paternalHalfBrother',
      detectionLevel: 'specific',
      reasonCode: 'blocked.paternalHalfBrotherByFullSisters',
      blockingRelationship: 'fullSister',
    });
    if (answers.paternalHalfSistersCount > 0) {
      blocked.push({
        relationship: 'paternalHalfSister',
        detectionLevel: 'specific',
        reasonCode: 'blocked.paternalHalfSisterByFullSisters',
        blockingRelationship: 'fullSister',
      });
    }
  }

  const chainTierCandidates: { relationship: HeirRelationship; count: number }[] = [
    { relationship: 'fullNephew', count: answers.fullNephewsCount },
    { relationship: 'halfNephew', count: answers.halfNephewsCount },
    { relationship: 'fullNephewsSon', count: answers.fullNephewsSonsCount },
    { relationship: 'halfNephewsSon', count: answers.halfNephewsSonsCount },
    { relationship: 'fullUncle', count: answers.fullUnclesCount },
    { relationship: 'halfUncle', count: answers.halfUnclesCount },
    { relationship: 'fullCousin', count: answers.fullCousinsCount },
    { relationship: 'halfCousin', count: answers.halfCousinsCount },
  ];
  const provided = chainTierCandidates.filter((c) => c.count > 0);
  for (let i = 1; i < provided.length; i++) {
    if (!isEligible(provided[i].relationship)) {
      blocked.push({
        relationship: provided[i].relationship,
        detectionLevel: 'specific',
        reasonCode: 'blocked.chainByNearerDegree',
        blockingRelationship: provided[0].relationship,
      });
    }
  }

  // Safety net: any residuary-only candidate that was answered but never made
  // it into the eligible list, and was not already explained above, gets a
  // generic reason. This covers cases like Mushtaraka (spec 13B.6) where full
  // brothers exist but the residue is fully exhausted by fixed shares before
  // their tier is ever reached.
  const residuaryOnlyCandidates: { relationship: HeirRelationship; count: number }[] = [
    { relationship: 'fullBrother', count: answers.fullBrothersCount },
    { relationship: 'paternalHalfBrother', count: answers.paternalHalfBrothersCount },
    ...chainTierCandidates,
  ];
  const alreadyBlocked = new Set(blocked.map((b) => b.relationship));
  const residueAbsorber: HeirRelationship = answers.maternalSiblingsCount > 0 ? 'maternalSibling' : 'mother';
  for (const candidate of residuaryOnlyCandidates) {
    if (candidate.count > 0 && !isEligible(candidate.relationship) && !alreadyBlocked.has(candidate.relationship)) {
      blocked.push({
        relationship: candidate.relationship,
        detectionLevel: 'specific',
        reasonCode: 'blocked.residueExhausted',
        blockingRelationship: residueAbsorber,
      });
    }
  }

  return blocked;
}
