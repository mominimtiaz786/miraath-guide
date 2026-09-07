/**
 * The calculation engine now injects TranslationService (to localize step
 * labels, tier names and adjustment text). Arithmetic must remain identical in
 * every locale: only the prose may change.
 */
import { TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { AppLocale } from '../../../i18n/config/locale.types';
import { LocaleService } from '../../../i18n/locale.service';
import { createEmptyAnswers } from '../models/calculator-answers.model';
import { CalculationEngineService } from './calculation-engine.service';
import { GOLDEN_FIXTURES } from './golden-fixtures.data';

const LOCALES: AppLocale[] = ['en', 'ur', 'hi', 'fr', 'ar'];

describe('calculation engine - locale invariance across GF-01..GF-20', () => {
  const localeSignal = signal<AppLocale>('en');

  beforeEach(() => {
    localeSignal.set('en');
    TestBed.configureTestingModule({
      providers: [{ provide: LocaleService, useValue: { locale: localeSignal.asReadonly() } }],
    });
  });

  it('produces identical fractions, blocked heirs and adjustments in all 5 locales', () => {
    const engine = TestBed.inject(CalculationEngineService);

    for (const fixture of GOLDEN_FIXTURES) {
      const answers = { ...createEmptyAnswers(), ...fixture.answers };
      const numeric = LOCALES.map((loc) => {
        localeSignal.set(loc);
        const r = engine.calculate(answers);
        return JSON.stringify({
          shares: r.finalShares
            .map((s) => `${s.relationship}=${s.poolShare.numerator}/${s.poolShare.denominator}`)
            .sort(),
          blocked: r.blockedHeirs.map((b) => b.relationship).sort(),
          adjustments: r.adjustments.map((a) => a.type).sort(),
          unassigned: `${r.unassignedRemainder.numerator}/${r.unassignedRemainder.denominator}`,
        });
      });

      for (let i = 1; i < numeric.length; i++) {
        expect(numeric[i])
          .withContext(`${fixture.id}: ${LOCALES[i]} diverged from en`)
          .toBe(numeric[0]);
      }
    }
  });

  it('localizes the prose while keeping the same number of steps', () => {
    const engine = TestBed.inject(CalculationEngineService);
    const fixture = GOLDEN_FIXTURES.find((f) => f.id === 'GF-02')!; // has an Awl adjustment
    const answers = { ...createEmptyAnswers(), ...fixture.answers };

    localeSignal.set('en');
    const en = engine.calculate(answers);
    localeSignal.set('ur');
    const ur = engine.calculate(answers);

    expect(ur.detailedSteps.length).toBe(en.detailedSteps.length);
    expect(ur.adjustments.length).toBe(en.adjustments.length);
    // Labels and adjustment prose must actually differ (i.e. be translated).
    expect(ur.detailedSteps[0].label).not.toBe(en.detailedSteps[0].label);
    expect(ur.adjustments[0].description).not.toBe(en.adjustments[0].description);
    // ...and must not be raw translation keys.
    for (const step of ur.detailedSteps) {
      expect(step.label.startsWith('calcSteps.'))
        .withContext(`unresolved key leaked into a step label: ${step.label}`)
        .toBeFalse();
    }
    for (const adj of ur.adjustments) {
      expect(adj.description.startsWith('adjustment.'))
        .withContext(`unresolved key leaked into an adjustment: ${adj.description}`)
        .toBeFalse();
    }
  });

  it('resolves every asabah tier label in every locale', () => {
    const engine = TestBed.inject(CalculationEngineService);
    for (const loc of LOCALES) {
      localeSignal.set(loc);
      for (const fixture of GOLDEN_FIXTURES) {
        const answers = { ...createEmptyAnswers(), ...fixture.answers };
        const tierStep = engine.calculate(answers).detailedSteps.find((s) => /\d/.test(s.value) && s.value.includes(':'));
        if (tierStep) {
          expect(tierStep.value.includes('asabahTier.'))
            .withContext(`${fixture.id}/${loc}: unresolved tier key in "${tierStep.value}"`)
            .toBeFalse();
        }
      }
    }
  });
});
