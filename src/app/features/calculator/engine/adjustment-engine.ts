import { Fraction } from '../../../shared/utils/fraction';
import { AdjustmentDraft } from '../models/calculation-result.model';
import { HeirRelationship } from '../models/heir.model';
import { FixedShareDraft } from './fixed-share-engine';

const SPOUSE_RELATIONSHIPS: HeirRelationship[] = ['husband', 'wife'];

export interface AwlResult {
  shares: FixedShareDraft[];
  adjustment: AdjustmentDraft | null;
}

/** Implements spec section 13B.4 (Awl). Only call when the fixed-share total exceeds 1. */
export function applyAwl(shares: FixedShareDraft[]): AwlResult {
  const commonDenominator = Fraction.commonDenominator(shares.map((s) => s.poolShare));
  const sumOverCommonDenominator = shares.reduce(
    (acc, s) => acc + s.poolShare.numerator * (commonDenominator / s.poolShare.denominator),
    0,
  );
  const scaled = shares.map((s) => ({
    ...s,
    poolShare: s.poolShare.multiply(Fraction.of(commonDenominator, sumOverCommonDenominator)),
  }));
  return {
    shares: scaled,
    adjustment: {
      type: 'awl',
      descriptionKey: 'adjustment.awl',
      descriptionParams: { from: commonDenominator, to: sumOverCommonDenominator },
      fromDenominator: commonDenominator,
      toDenominator: sumOverCommonDenominator,
    },
  };
}

export interface RaddResult {
  shares: FixedShareDraft[];
  adjustment: AdjustmentDraft | null;
  unassignedRemainder: Fraction;
  unassignedRemainderNoteKey: string | null;
}

/** Implements spec section 13B.4 (Radd). Only call when no residuary tier claimed the residue. */
export function applyRadd(shares: FixedShareDraft[], residue: Fraction): RaddResult {
  if (residue.isZero()) {
    return { shares, adjustment: null, unassignedRemainder: Fraction.zero(), unassignedRemainderNoteKey: null };
  }

  const nonSpouseShares = shares.filter((s) => !SPOUSE_RELATIONSHIPS.includes(s.relationship));
  const nonSpouseTotal = Fraction.sum(nonSpouseShares.map((s) => s.poolShare));

  if (nonSpouseShares.length === 0 || nonSpouseTotal.isZero()) {
    return {
      shares,
      adjustment: null,
      unassignedRemainder: residue,
      unassignedRemainderNoteKey: 'adjustment.spouseOnlySurplus',
    };
  }

  const updated = shares.map((s) => {
    if (SPOUSE_RELATIONSHIPS.includes(s.relationship)) {
      return s;
    }
    const weight = s.poolShare.divide(nonSpouseTotal);
    const addition = residue.multiply(weight);
    return { ...s, poolShare: s.poolShare.add(addition) };
  });

  return {
    shares: updated,
    adjustment: {
      type: 'radd',
      descriptionKey: 'adjustment.radd',
    },
    unassignedRemainder: Fraction.zero(),
    unassignedRemainderNoteKey: null,
  };
}
