/**
 * asabah-engine's tier table was rewritten to emit translation keys instead of
 * English labels. This walks every tier 1..13 to confirm the ordering, the
 * allocation and the (now localized) tier label all still resolve.
 * Also covers prompt.txt section 29: "Asabah chain ordering",
 * "Father blocking grandfather".
 */
import { TestBed } from '@angular/core/testing';
import { Fraction } from '../../../shared/utils/fraction';
import { CalculatorAnswers, createEmptyAnswers } from '../models/calculator-answers.model';
import { HeirRelationship } from '../models/heir.model';
import { CalculationEngineService } from './calculation-engine.service';

/** No spouse, no parents, no descendants -> the whole estate falls to the residuary chain. */
const BARE: Partial<CalculatorAnswers> = {
  deceasedGender: 'male',
  wivesCount: 0,
  hasDescendants: false,
  fatherAlive: false,
  paternalGrandfatherAlive: false,
  motherAlive: false,
  grandmothersCount: 0,
};

interface TierCase {
  tier: number;
  answers: Partial<CalculatorAnswers>;
  taker: HeirRelationship;
}

const TIERS: TierCase[] = [
  { tier: 1, answers: { ...BARE, hasDescendants: true, sonsCount: 1 }, taker: 'son' },
  { tier: 2, answers: { ...BARE, hasDescendants: true, sonsCount: 0, paternalGrandsonsCount: 1 }, taker: 'sonsSon' },
  { tier: 3, answers: { ...BARE, fatherAlive: true }, taker: 'father' },
  { tier: 3, answers: { ...BARE, paternalGrandfatherAlive: true }, taker: 'paternalGrandfather' },
  { tier: 4, answers: { ...BARE, fullBrothersCount: 1 }, taker: 'fullBrother' },
  { tier: 5, answers: { ...BARE, paternalHalfBrothersCount: 1 }, taker: 'paternalHalfBrother' },
  { tier: 6, answers: { ...BARE, fullNephewsCount: 1 }, taker: 'fullNephew' },
  { tier: 7, answers: { ...BARE, halfNephewsCount: 1 }, taker: 'halfNephew' },
  { tier: 8, answers: { ...BARE, fullNephewsSonsCount: 1 }, taker: 'fullNephewsSon' },
  { tier: 9, answers: { ...BARE, halfNephewsSonsCount: 1 }, taker: 'halfNephewsSon' },
  { tier: 10, answers: { ...BARE, fullUnclesCount: 1 }, taker: 'fullUncle' },
  { tier: 11, answers: { ...BARE, halfUnclesCount: 1 }, taker: 'halfUncle' },
  { tier: 12, answers: { ...BARE, fullCousinsCount: 1 }, taker: 'fullCousin' },
  { tier: 13, answers: { ...BARE, halfCousinsCount: 1 }, taker: 'halfCousin' },
];

describe('asabah chain - every tier resolves after the label refactor', () => {
  let engine: CalculationEngineService;
  beforeEach(() => {
    TestBed.configureTestingModule({});
    engine = TestBed.inject(CalculationEngineService);
  });

  for (const { tier, answers, taker } of TIERS) {
    it(`tier ${tier}: ${taker} takes the whole residue with a resolved label`, () => {
      const result = engine.calculate({ ...createEmptyAnswers(), ...answers });
      const share = result.finalShares.find((s) => s.relationship === taker);
      expect(share).withContext(`${taker} must inherit at tier ${tier}`).toBeTruthy();
      expect(share!.poolShare.equals(Fraction.one()))
        .withContext(`${taker} expected the whole estate, got ${share!.poolShare.toDisplayString()}`)
        .toBeTrue();

      const step = result.detailedSteps.find((s) => s.value.startsWith('Tier '));
      expect(step).withContext(`tier ${tier} must be reported in the detailed steps`).toBeTruthy();
      expect(step!.value).toContain(`Tier ${tier}:`);
      expect(step!.value.includes('asabahTier.'))
        .withContext(`unresolved tier key: ${step!.value}`)
        .toBeFalse();
      expect(step!.value.replace(`Tier ${tier}:`, '').trim().length)
        .withContext(`tier ${tier} label must not be empty`)
        .toBeGreaterThan(0);
    });
  }

  it('a nearer tier always beats a remoter one (ordering holds across the whole chain)', () => {
    // Every tier populated at once: only tier 1 (son) may inherit.
    const crowded: Partial<CalculatorAnswers> = {
      ...BARE,
      hasDescendants: true,
      sonsCount: 1,
      paternalGrandsonsCount: 1,
      fullBrothersCount: 1,
      paternalHalfBrothersCount: 1,
      fullNephewsCount: 1,
      halfNephewsCount: 1,
      fullNephewsSonsCount: 1,
      halfNephewsSonsCount: 1,
      fullUnclesCount: 1,
      halfUnclesCount: 1,
      fullCousinsCount: 1,
      halfCousinsCount: 1,
    };
    const result = engine.calculate({ ...createEmptyAnswers(), ...crowded });
    expect(result.finalShares.map((s) => s.relationship)).toEqual(['son']);
    expect(result.finalShares[0].poolShare.equals(Fraction.one())).toBeTrue();
  });

  it('father blocks the paternal grandfather (prompt.txt section 29)', () => {
    const result = engine.calculate({
      ...createEmptyAnswers(),
      ...BARE,
      fatherAlive: true,
      paternalGrandfatherAlive: true,
    });
    expect(result.finalShares.some((s) => s.relationship === 'father')).toBeTrue();
    expect(result.finalShares.some((s) => s.relationship === 'paternalGrandfather'))
      .withContext('the grandfather must not inherit while the father is alive')
      .toBeFalse();
    expect(result.blockedHeirs.some((b) => b.relationship === 'paternalGrandfather')).toBeTrue();
  });
});
