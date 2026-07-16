import { TestBed } from '@angular/core/testing';
import { Fraction } from '../../../shared/utils/fraction';
import { createEmptyAnswers } from '../models/calculator-answers.model';
import { CalculationEngineService } from './calculation-engine.service';
import { GOLDEN_FIXTURES } from './golden-fixtures.data';

describe('CalculationEngineService - golden fixtures (GF-01..GF-20)', () => {
  let engine: CalculationEngineService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    engine = TestBed.inject(CalculationEngineService);
  });

  for (const fixture of GOLDEN_FIXTURES) {
    it(`${fixture.id}: ${fixture.description}`, () => {
      const answers = { ...createEmptyAnswers(), ...fixture.answers };
      const result = engine.calculate(answers);

      for (const expected of fixture.expectedFinalShares) {
        const actual = result.finalShares.find((s) => s.relationship === expected.relationship);
        expect(actual)
          .withContext(`${fixture.id}: expected ${expected.relationship} to be present`)
          .toBeTruthy();
        if (actual) {
          expect(actual.poolShare.numerator)
            .withContext(`${fixture.id}: ${expected.relationship} numerator`)
            .toBe(expected.numerator);
          expect(actual.poolShare.denominator)
            .withContext(`${fixture.id}: ${expected.relationship} denominator`)
            .toBe(expected.denominator);
        }
      }

      // Every relationship not explicitly expected should not appear with a positive share.
      const expectedRelationships = new Set(fixture.expectedFinalShares.map((s) => s.relationship));
      for (const actual of result.finalShares) {
        if (!expectedRelationships.has(actual.relationship)) {
          fail(`${fixture.id}: unexpected share for ${actual.relationship}: ${actual.poolShare.toDisplayString()}`);
        }
      }

      for (const expectedBlocked of fixture.expectedBlockedHeirs) {
        const found = result.blockedHeirs.find((b) => b.relationship === expectedBlocked.relationship);
        expect(found).withContext(`${fixture.id}: expected ${expectedBlocked.relationship} to be blocked`).toBeTruthy();
      }

      if (fixture.expectedAdjustment) {
        const found = result.adjustments.find((a) => a.type === fixture.expectedAdjustment);
        expect(found).withContext(`${fixture.id}: expected ${fixture.expectedAdjustment} adjustment`).toBeTruthy();
      }

      // The estate must always fully resolve: assigned shares + unassigned remainder = 1.
      const totalAssigned = Fraction.sum(result.finalShares.map((s) => s.poolShare)).add(result.unassignedRemainder);
      expect(totalAssigned.equals(Fraction.one())).withContext(`${fixture.id}: total must sum to 1`).toBeTrue();
    });
  }
});
