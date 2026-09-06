/**
 * Independent re-verification of the normative golden fixtures in
 * design-process/prompt.txt section 13B.7 (GF-01..GF-20).
 *
 * Expected values here are transcribed directly from prompt.txt rather than
 * read from golden-fixtures.data.ts, so a wrong value in the fixture file
 * cannot make this suite pass.
 */
import { TestBed } from '@angular/core/testing';
import { Fraction } from '../../../shared/utils/fraction';
import { createEmptyAnswers, CalculatorAnswers } from '../models/calculator-answers.model';
import { HeirRelationship } from '../models/heir.model';
import { CalculationEngineService } from './calculation-engine.service';
import { GOLDEN_FIXTURES } from './golden-fixtures.data';

type Frac = [number, number];
interface PromptCase {
  shares: Partial<Record<HeirRelationship, Frac>>;
  blocked?: HeirRelationship[];
  adjustment?: 'awl' | 'radd' | 'umariyyatayn';
  unassigned?: Frac;
}

/** Transcribed from design-process/prompt.txt, section 13B.7. */
const PROMPT: Record<string, PromptCase> = {
  'GF-01': { shares: { wife: [1, 8], mother: [1, 6], father: [1, 6], son: [13, 30], daughter: [13, 120] } },
  'GF-02': { shares: { wife: [1, 9], daughter: [16, 27], mother: [4, 27], father: [4, 27] }, adjustment: 'awl' },
  'GF-03': { shares: { wife: [1, 4], mother: [1, 4], father: [1, 2] }, adjustment: 'umariyyatayn' },
  'GF-04': { shares: { husband: [1, 2], mother: [1, 6], father: [1, 3] }, adjustment: 'umariyyatayn' },
  'GF-05': { shares: { wife: [1, 4], mother: [1, 4], father: [1, 2] }, blocked: ['fullBrother'], adjustment: 'umariyyatayn' },
  'GF-06': { shares: { mother: [1, 6], father: [5, 6] }, blocked: ['fullBrother'] },
  'GF-07': { shares: { husband: [3, 8], mother: [1, 8], fullSister: [1, 2] }, adjustment: 'awl' },
  'GF-08': { shares: { husband: [3, 7], fullSister: [4, 7] }, adjustment: 'awl' },
  'GF-09': { shares: { wife: [1, 8], daughter: [7, 8] }, adjustment: 'radd' },
  'GF-10': { shares: { mother: [1, 4], daughter: [3, 4] }, adjustment: 'radd' },
  'GF-11': { shares: { daughter: [1, 2], sonsDaughter: [1, 6], fullUncle: [1, 3] } },
  'GF-12': { shares: { daughter: [1, 2], fullSister: [1, 2] }, blocked: ['paternalHalfBrother'] },
  'GF-13': { shares: { fullSister: [1, 2], paternalHalfBrother: [1, 2] } },
  'GF-14': { shares: { husband: [1, 2], maternalSibling: [1, 6], fullBrother: [1, 3] } },
  'GF-15': { shares: { husband: [1, 2], mother: [1, 6], maternalSibling: [1, 3] }, blocked: ['fullBrother'] },
  'GF-16': { shares: { paternalGrandfather: [1, 1] }, blocked: ['fullBrother'] },
  'GF-17': { shares: { wife: [1, 4], fullNephew: [3, 4] }, blocked: ['halfNephew'] },
  'GF-18': { shares: { daughter: [1, 2], halfNephew: [1, 2] } },
  'GF-19': { shares: { wife: [1, 4], fullUncle: [3, 4] }, blocked: ['halfUncle'] },
  'GF-20': { shares: { husband: [1, 2] }, unassigned: [1, 2] },
};

describe('prompt.txt 13B.7 golden fixtures - independent re-verification', () => {
  let engine: CalculationEngineService;
  beforeEach(() => {
    TestBed.configureTestingModule({});
    engine = TestBed.inject(CalculationEngineService);
  });

  it('covers every fixture named in prompt.txt', () => {
    expect(Object.keys(PROMPT).length).toBe(20);
    for (const id of Object.keys(PROMPT)) {
      expect(GOLDEN_FIXTURES.find((f) => f.id === id))
        .withContext(`${id} must exist in golden-fixtures.data.ts`)
        .toBeTruthy();
    }
  });

  for (const [id, expected] of Object.entries(PROMPT)) {
    it(`${id} matches prompt.txt exactly`, () => {
      const fixture = GOLDEN_FIXTURES.find((f) => f.id === id)!;
      const answers: CalculatorAnswers = { ...createEmptyAnswers(), ...fixture.answers };
      const result = engine.calculate(answers);

      // 1. Every expected heir gets exactly the prompt's fraction.
      for (const [rel, [num, den]] of Object.entries(expected.shares) as [HeirRelationship, Frac][]) {
        const actual = result.finalShares.find((s) => s.relationship === rel);
        expect(actual).withContext(`${id}: ${rel} must inherit`).toBeTruthy();
        if (actual) {
          expect(actual.poolShare.equals(Fraction.of(num, den)))
            .withContext(`${id}: ${rel} expected ${num}/${den}, got ${actual.poolShare.toDisplayString()}`)
            .toBeTrue();
        }
      }

      // 2. Nobody else inherits.
      const allowed = new Set(Object.keys(expected.shares));
      for (const s of result.finalShares) {
        expect(allowed.has(s.relationship))
          .withContext(`${id}: unexpected heir ${s.relationship} = ${s.poolShare.toDisplayString()}`)
          .toBeTrue();
      }

      // 3. Heirs the prompt says get nothing are reported blocked.
      for (const rel of expected.blocked ?? []) {
        expect(result.blockedHeirs.some((b) => b.relationship === rel))
          .withContext(`${id}: ${rel} must be blocked`)
          .toBeTrue();
        expect(result.finalShares.some((s) => s.relationship === rel))
          .withContext(`${id}: ${rel} must not inherit`)
          .toBeFalse();
      }

      // 4. Declared adjustment is recorded.
      if (expected.adjustment) {
        expect(result.adjustments.some((a) => a.type === expected.adjustment))
          .withContext(`${id}: expected ${expected.adjustment}, got [${result.adjustments.map((a) => a.type).join(',')}]`)
          .toBeTrue();
      }

      // 5. GF-20: the undistributed half is labelled, not silently dropped.
      if (expected.unassigned) {
        const [n, d] = expected.unassigned;
        expect(result.unassignedRemainder.equals(Fraction.of(n, d)))
          .withContext(`${id}: unassigned remainder must be ${n}/${d}`)
          .toBeTrue();
        expect(result.unassignedRemainderNote)
          .withContext(`${id}: unassigned remainder must carry an explanatory note`)
          .toBeTruthy();
      } else {
        expect(result.unassignedRemainder.isZero())
          .withContext(`${id}: nothing should be left unassigned`)
          .toBeTrue();
      }

      // 6. "Total 1" - shares plus any unassigned remainder always resolve the estate.
      const total = Fraction.sum(result.finalShares.map((s) => s.poolShare)).add(result.unassignedRemainder);
      expect(total.equals(Fraction.one()))
        .withContext(`${id}: total must equal 1, got ${total.toDisplayString()}`)
        .toBeTrue();
    });
  }
});
