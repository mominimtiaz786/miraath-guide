import { Fraction } from '../../../shared/utils/fraction';
import { CalculatorAnswers } from '../models/calculator-answers.model';
import { DerivedFacts } from '../models/derived-facts.model';
import { HeirRelationship } from '../models/heir.model';

export interface FixedShareDraft {
  relationship: HeirRelationship;
  count: number;
  poolShare: Fraction;
  reasonCode: string;
}

export interface FixedShareResult {
  shares: FixedShareDraft[];
  /** True when Umariyyatayn fired - spouse/mother/father fully resolve the estate on their own. */
  umariyyatayn: boolean;
}

const ZERO = Fraction.zero();
const HALF = Fraction.of(1, 2);
const ONE_THIRD = Fraction.of(1, 3);
const TWO_THIRDS = Fraction.of(2, 3);
const ONE_QUARTER = Fraction.of(1, 4);
const ONE_SIXTH = Fraction.of(1, 6);
const ONE_EIGHTH = Fraction.of(1, 8);

/** Implements spec section 13B.2 (Ashab al-Furud). */
export function computeFixedShares(answers: CalculatorAnswers, facts: DerivedFacts): FixedShareResult {
  const shares: FixedShareDraft[] = [];

  // --- Spouse ---
  let spousePool = ZERO;
  if (answers.deceasedGender === 'female' && answers.husbandAlive === true) {
    spousePool = facts.anyDescendant ? ONE_QUARTER : HALF;
    shares.push({
      relationship: 'husband',
      count: 1,
      poolShare: spousePool,
      reasonCode: facts.anyDescendant ? 'husband.withDescendant' : 'husband.noDescendant',
    });
  } else if (answers.deceasedGender === 'male' && (answers.wivesCount ?? 0) > 0) {
    spousePool = facts.anyDescendant ? ONE_EIGHTH : ONE_QUARTER;
    shares.push({
      relationship: 'wife',
      count: answers.wivesCount ?? 0,
      poolShare: spousePool,
      reasonCode: facts.anyDescendant ? 'wife.withDescendant' : 'wife.noDescendant',
    });
  }

  // --- Umariyyatayn gate (13B.5) ---
  const umariyyatayn =
    spousePool.greaterThan(ZERO) &&
    answers.fatherAlive === true &&
    !facts.anyDescendant &&
    facts.totalSiblings < 2 &&
    answers.motherAlive === true;

  if (umariyyatayn) {
    const remainderAfterSpouse = Fraction.one().subtract(spousePool);
    const motherShare = remainderAfterSpouse.multiply(ONE_THIRD);
    const fatherShare = remainderAfterSpouse.subtract(motherShare);
    shares.push({
      relationship: 'mother',
      count: 1,
      poolShare: motherShare,
      reasonCode: 'mother.umariyyatayn',
    });
    shares.push({
      relationship: 'father',
      count: 1,
      poolShare: fatherShare,
      reasonCode: 'father.umariyyatayn',
    });
    return { shares, umariyyatayn: true };
  }

  // --- Mother ---
  if (answers.motherAlive === true) {
    const motherShare = facts.anyDescendant || facts.totalSiblings >= 2 ? ONE_SIXTH : ONE_THIRD;
    shares.push({
      relationship: 'mother',
      count: 1,
      poolShare: motherShare,
      reasonCode:
        facts.anyDescendant || facts.totalSiblings >= 2 ? 'mother.reduced' : 'mother.full',
    });
  }

  // --- Grandmother(s), only when mother is dead ---
  if (answers.motherAlive === false && (answers.grandmothersCount ?? 0) > 0) {
    shares.push({
      relationship: 'grandmother',
      count: answers.grandmothersCount ?? 0,
      poolShare: ONE_SIXTH,
      reasonCode: 'grandmother.pool',
    });
  }

  // --- Father / paternal grandfather fixed 1/6 (residue is added later by the Asabah engine) ---
  if (facts.anyDescendant) {
    if (facts.fatherFigureType === 'father') {
      shares.push({ relationship: 'father', count: 1, poolShare: ONE_SIXTH, reasonCode: 'father.fixed' });
    } else if (facts.fatherFigureType === 'grandfather') {
      shares.push({
        relationship: 'paternalGrandfather',
        count: 1,
        poolShare: ONE_SIXTH,
        reasonCode: 'grandfather.fixed',
      });
    }
  }

  // --- Daughters (only when there are no sons - otherwise they are residuary with the sons) ---
  if (answers.sonsCount === 0 && answers.daughtersCount > 0) {
    const daughtersShare = answers.daughtersCount === 1 ? HALF : TWO_THIRDS;
    shares.push({
      relationship: 'daughter',
      count: answers.daughtersCount,
      poolShare: daughtersShare,
      reasonCode: answers.daughtersCount === 1 ? 'daughter.single' : 'daughter.multiple',
    });
  }

  // --- Son's daughters (only when there are no sons AND no son's sons) ---
  if (answers.sonsCount === 0 && answers.paternalGrandsonsCount === 0 && answers.paternalGranddaughtersCount > 0) {
    if (answers.daughtersCount === 0) {
      const share = answers.paternalGranddaughtersCount === 1 ? HALF : TWO_THIRDS;
      shares.push({
        relationship: 'sonsDaughter',
        count: answers.paternalGranddaughtersCount,
        poolShare: share,
        reasonCode: answers.paternalGranddaughtersCount === 1 ? 'sonsDaughter.single' : 'sonsDaughter.multiple',
      });
    } else if (answers.daughtersCount === 1) {
      shares.push({
        relationship: 'sonsDaughter',
        count: answers.paternalGranddaughtersCount,
        poolShare: ONE_SIXTH,
        reasonCode: 'sonsDaughter.completing',
      });
    }
    // daughtersCount >= 2: son's daughters are blocked entirely - no fixed share added.
  }

  // --- Full sisters (fixed-share branch only; the asabah-ma'a-al-ghayr branch is handled by the Asabah engine) ---
  const siblingsFixedShareGate = !facts.maleDescendant && !facts.fatherFigure;
  const fullSisterFixedEligible =
    siblingsFixedShareGate && !facts.femaleDescendant && answers.fullBrothersCount === 0;
  if (fullSisterFixedEligible && answers.fullSistersCount > 0) {
    const share = answers.fullSistersCount === 1 ? HALF : TWO_THIRDS;
    shares.push({
      relationship: 'fullSister',
      count: answers.fullSistersCount,
      poolShare: share,
      reasonCode: answers.fullSistersCount === 1 ? 'fullSister.single' : 'fullSister.multiple',
    });
  }

  // --- Paternal half-sisters (fixed-share branch) ---
  const halfSisterFixedEligible =
    siblingsFixedShareGate && !facts.femaleDescendant && answers.paternalHalfBrothersCount === 0;
  if (halfSisterFixedEligible && answers.paternalHalfSistersCount > 0) {
    if (answers.fullSistersCount === 0) {
      const share = answers.paternalHalfSistersCount === 1 ? HALF : TWO_THIRDS;
      shares.push({
        relationship: 'paternalHalfSister',
        count: answers.paternalHalfSistersCount,
        poolShare: share,
        reasonCode: answers.paternalHalfSistersCount === 1 ? 'paternalHalfSister.single' : 'paternalHalfSister.multiple',
      });
    } else if (answers.fullSistersCount === 1) {
      shares.push({
        relationship: 'paternalHalfSister',
        count: answers.paternalHalfSistersCount,
        poolShare: ONE_SIXTH,
        reasonCode: 'paternalHalfSister.completing',
      });
    }
    // fullSistersCount >= 2: paternal half-sisters are blocked entirely.
  }

  // --- Maternal siblings (kalalah condition only) ---
  if (!facts.anyDescendant && !facts.fatherFigure && answers.maternalSiblingsCount > 0) {
    const share = answers.maternalSiblingsCount === 1 ? ONE_SIXTH : ONE_THIRD;
    shares.push({
      relationship: 'maternalSibling',
      count: answers.maternalSiblingsCount,
      poolShare: share,
      reasonCode: answers.maternalSiblingsCount === 1 ? 'maternalSibling.single' : 'maternalSibling.multiple',
    });
  }

  return { shares, umariyyatayn: false };
}
