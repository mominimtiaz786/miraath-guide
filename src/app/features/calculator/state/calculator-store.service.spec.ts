import { TestBed } from '@angular/core/testing';
import { CalculatorStore } from './calculator-store.service';

describe('CalculatorStore', () => {
  let store: CalculatorStore;

  beforeEach(() => {
    sessionStorage.clear();
    TestBed.configureTestingModule({});
    store = TestBed.inject(CalculatorStore);
    store.resetCalculation();
  });

  it('starts on the deceasedGender step with empty answers', () => {
    expect(store.currentStepId()).toBe('deceasedGender');
    expect(store.answers().deceasedGender).toBeNull();
  });

  it('setAnswer updates the answers signal', () => {
    store.setAnswer('deceasedGender', 'male');
    expect(store.answers().deceasedGender).toBe('male');
  });

  it('resets descendant counts to zero when hasDescendants is set to false', () => {
    store.setAnswer('deceasedGender', 'male');
    store.setAnswer('hasDescendants', true);
    store.setAnswer('sonsCount', 2);
    store.setAnswer('daughtersCount', 1);
    store.setAnswer('hasDescendants', false);

    expect(store.answers().sonsCount).toBe(0);
    expect(store.answers().daughtersCount).toBe(0);
    expect(store.answers().paternalGrandsonsCount).toBe(0);
    expect(store.answers().paternalGranddaughtersCount).toBe(0);
  });

  it('clears paternalGrandfatherAlive when the father is set alive', () => {
    store.setAnswer('deceasedGender', 'male');
    store.setAnswer('hasDescendants', false);
    store.setAnswer('fatherAlive', false);
    store.setAnswer('paternalGrandfatherAlive', true);
    store.setAnswer('fatherAlive', true);

    expect(store.answers().paternalGrandfatherAlive).toBeNull();
  });

  it('goNext advances through visible steps and goBack reverses', () => {
    store.setAnswer('deceasedGender', 'male');
    const outcome = store.goNext();
    expect(outcome).toBe('continue');
    expect(store.currentStepId()).toBe('wivesCount');

    const moved = store.goBack();
    expect(moved).toBeTrue();
    expect(store.currentStepId()).toBe('deceasedGender');
  });

  it('calculate() runs the engine and stores the result', () => {
    store.setAnswer('deceasedGender', 'female');
    store.setAnswer('husbandAlive', true);
    store.setAnswer('hasDescendants', false);

    const result = store.calculate();
    expect(store.result()).toBe(result);
    expect(result.finalShares.some((s) => s.relationship === 'husband')).toBeTrue();
  });

  it('resetCalculation clears answers, result, and returns to the first step', () => {
    store.setAnswer('deceasedGender', 'male');
    store.calculate();
    store.resetCalculation();

    expect(store.answers().deceasedGender).toBeNull();
    expect(store.result()).toBeNull();
    expect(store.currentStepId()).toBe('deceasedGender');
  });

  it('loadScenario preloads answers and jumps to the first relevant step', () => {
    store.loadScenario({ deceasedGender: 'male', wivesCount: 1, hasDescendants: false, fatherAlive: true, motherAlive: true });
    expect(store.answers().wivesCount).toBe(1);
    expect(store.answers().fatherAlive).toBeTrue();
  });
});
