import { Fraction } from '../../../shared/utils/fraction';
import { CalculatorAnswers } from '../models/calculator-answers.model';
import { DerivedFacts } from '../models/derived-facts.model';
import { HeirRelationship } from '../models/heir.model';

export interface AsabahAllocation {
  relationship: HeirRelationship;
  count: number;
  /** Residue allocated to this relationship. Merge (add) with any existing fixed share for the same relationship. */
  poolShare: Fraction;
  reasonCode: string;
}

export interface AsabahResult {
  tier: number | null;
  tierLabel: string | null;
  allocations: AsabahAllocation[];
}

function twoToOneSplit(
  residue: Fraction,
  maleCount: number,
  femaleCount: number,
): { malePerPerson: Fraction; femalePerPerson: Fraction } {
  const units = maleCount * 2 + femaleCount;
  if (units === 0) {
    return { malePerPerson: Fraction.zero(), femalePerPerson: Fraction.zero() };
  }
  const unitShare = residue.divide(Fraction.of(units));
  return { malePerPerson: unitShare.multiply(Fraction.of(2)), femalePerPerson: unitShare };
}

/** Implements spec section 13B.3 (Asabah residuary chain). Assumes residue > 0. */
export function computeResiduaryChain(
  answers: CalculatorAnswers,
  facts: DerivedFacts,
  residue: Fraction,
): AsabahResult {
  const none: AsabahResult = { tier: null, tierLabel: null, allocations: [] };
  if (residue.isZero() || residue.lessThan(Fraction.zero())) {
    return none;
  }

  // Tier 1: sons (daughters join at 2:1)
  if (answers.sonsCount > 0) {
    const { malePerPerson, femalePerPerson } = twoToOneSplit(residue, answers.sonsCount, answers.daughtersCount);
    const allocations: AsabahAllocation[] = [
      { relationship: 'son', count: answers.sonsCount, poolShare: malePerPerson.multiply(Fraction.of(answers.sonsCount)), reasonCode: 'son.residuary' },
    ];
    if (answers.daughtersCount > 0) {
      allocations.push({
        relationship: 'daughter',
        count: answers.daughtersCount,
        poolShare: femalePerPerson.multiply(Fraction.of(answers.daughtersCount)),
        reasonCode: 'daughter.residuaryWithSons',
      });
    }
    return { tier: 1, tierLabel: 'Sons (with daughters)', allocations };
  }

  // Tier 2: son's sons (son's daughters join at 2:1)
  if (answers.paternalGrandsonsCount > 0) {
    const { malePerPerson, femalePerPerson } = twoToOneSplit(
      residue,
      answers.paternalGrandsonsCount,
      answers.paternalGranddaughtersCount,
    );
    const allocations: AsabahAllocation[] = [
      {
        relationship: 'sonsSon',
        count: answers.paternalGrandsonsCount,
        poolShare: malePerPerson.multiply(Fraction.of(answers.paternalGrandsonsCount)),
        reasonCode: 'sonsSon.residuary',
      },
    ];
    if (answers.paternalGranddaughtersCount > 0) {
      allocations.push({
        relationship: 'sonsDaughter',
        count: answers.paternalGranddaughtersCount,
        poolShare: femalePerPerson.multiply(Fraction.of(answers.paternalGranddaughtersCount)),
        reasonCode: 'sonsDaughter.residuaryWithSonsSons',
      });
    }
    return { tier: 2, tierLabel: "Son's sons (with son's daughters)", allocations };
  }

  // Tier 3: father, else paternal grandfather
  if (facts.fatherFigureType === 'father') {
    return {
      tier: 3,
      tierLabel: 'Father',
      allocations: [{ relationship: 'father', count: 1, poolShare: residue, reasonCode: 'father.residue' }],
    };
  }
  if (facts.fatherFigureType === 'grandfather') {
    return {
      tier: 3,
      tierLabel: 'Paternal grandfather',
      allocations: [
        { relationship: 'paternalGrandfather', count: 1, poolShare: residue, reasonCode: 'grandfather.residue' },
      ],
    };
  }

  // From here on, the Hanafi father-figure block applies: a living father or
  // paternal grandfather blocks every remaining tier, so fatherFigure is always false below.

  // Tier 4: full brothers (full sisters join at 2:1)
  if (answers.fullBrothersCount > 0) {
    const { malePerPerson, femalePerPerson } = twoToOneSplit(residue, answers.fullBrothersCount, answers.fullSistersCount);
    const allocations: AsabahAllocation[] = [
      {
        relationship: 'fullBrother',
        count: answers.fullBrothersCount,
        poolShare: malePerPerson.multiply(Fraction.of(answers.fullBrothersCount)),
        reasonCode: 'fullBrother.residuary',
      },
    ];
    if (answers.fullSistersCount > 0) {
      allocations.push({
        relationship: 'fullSister',
        count: answers.fullSistersCount,
        poolShare: femalePerPerson.multiply(Fraction.of(answers.fullSistersCount)),
        reasonCode: 'fullSister.residuaryWithBrothers',
      });
    }
    return { tier: 4, tierLabel: 'Full brothers (with full sisters)', allocations };
  }

  // Tier 4b: full sisters alone, asabah ma'a al-ghayr (blocks everything below, including half-brothers)
  if (answers.fullSistersCount > 0 && facts.femaleDescendant) {
    return {
      tier: 4.5,
      tierLabel: "Full sisters (asabah ma'a al-ghayr)",
      allocations: [
        {
          relationship: 'fullSister',
          count: answers.fullSistersCount,
          poolShare: residue,
          reasonCode: 'fullSister.asabahMaaGhayr',
        },
      ],
    };
  }

  // Tier 5: paternal half-brothers (paternal half-sisters join at 2:1)
  if (answers.paternalHalfBrothersCount > 0) {
    const { malePerPerson, femalePerPerson } = twoToOneSplit(
      residue,
      answers.paternalHalfBrothersCount,
      answers.paternalHalfSistersCount,
    );
    const allocations: AsabahAllocation[] = [
      {
        relationship: 'paternalHalfBrother',
        count: answers.paternalHalfBrothersCount,
        poolShare: malePerPerson.multiply(Fraction.of(answers.paternalHalfBrothersCount)),
        reasonCode: 'paternalHalfBrother.residuary',
      },
    ];
    if (answers.paternalHalfSistersCount > 0) {
      allocations.push({
        relationship: 'paternalHalfSister',
        count: answers.paternalHalfSistersCount,
        poolShare: femalePerPerson.multiply(Fraction.of(answers.paternalHalfSistersCount)),
        reasonCode: 'paternalHalfSister.residuaryWithHalfBrothers',
      });
    }
    return { tier: 5, tierLabel: 'Paternal half-brothers (with paternal half-sisters)', allocations };
  }

  // Tiers 6-13: males only, first non-empty count wins the entire residue.
  const maleOnlyTiers: { tier: number; label: string; count: number; relationship: HeirRelationship; reasonCode: string }[] = [
    { tier: 6, label: "Full brothers' sons (full nephews)", count: answers.fullNephewsCount, relationship: 'fullNephew', reasonCode: 'fullNephew.residuary' },
    { tier: 7, label: "Paternal half-brothers' sons (half nephews)", count: answers.halfNephewsCount, relationship: 'halfNephew', reasonCode: 'halfNephew.residuary' },
    { tier: 8, label: "Full nephews' sons", count: answers.fullNephewsSonsCount, relationship: 'fullNephewsSon', reasonCode: 'fullNephewsSon.residuary' },
    { tier: 9, label: "Half nephews' sons", count: answers.halfNephewsSonsCount, relationship: 'halfNephewsSon', reasonCode: 'halfNephewsSon.residuary' },
    { tier: 10, label: 'Full paternal uncles', count: answers.fullUnclesCount, relationship: 'fullUncle', reasonCode: 'fullUncle.residuary' },
    { tier: 11, label: 'Paternal half-uncles', count: answers.halfUnclesCount, relationship: 'halfUncle', reasonCode: 'halfUncle.residuary' },
    { tier: 12, label: 'Full paternal cousins', count: answers.fullCousinsCount, relationship: 'fullCousin', reasonCode: 'fullCousin.residuary' },
    { tier: 13, label: 'Paternal half-cousins', count: answers.halfCousinsCount, relationship: 'halfCousin', reasonCode: 'halfCousin.residuary' },
  ];

  for (const candidate of maleOnlyTiers) {
    if (candidate.count > 0) {
      return {
        tier: candidate.tier,
        tierLabel: candidate.label,
        allocations: [
          { relationship: candidate.relationship, count: candidate.count, poolShare: residue, reasonCode: candidate.reasonCode },
        ],
      };
    }
  }

  return none;
}
