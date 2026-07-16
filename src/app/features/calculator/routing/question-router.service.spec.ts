import { TestBed } from '@angular/core/testing';
import { createEmptyAnswers } from '../models/calculator-answers.model';
import { QuestionRouterService } from './question-router.service';

describe('QuestionRouterService', () => {
  let router: QuestionRouterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    router = TestBed.inject(QuestionRouterService);
  });

  it('starts with the deceased gender question', () => {
    expect(router.getFirstStep(createEmptyAnswers())).toBe('deceasedGender');
  });

  it('asks wivesCount for a male deceased and husbandAlive for a female deceased', () => {
    const male = { ...createEmptyAnswers(), deceasedGender: 'male' as const };
    const female = { ...createEmptyAnswers(), deceasedGender: 'female' as const };

    expect(router.getVisibleSteps(male)).toContain('wivesCount');
    expect(router.getVisibleSteps(male)).not.toContain('husbandAlive');
    expect(router.getVisibleSteps(female)).toContain('husbandAlive');
    expect(router.getVisibleSteps(female)).not.toContain('wivesCount');
  });

  it('skips the paternal grandfather question when the father is alive', () => {
    const answers = { ...createEmptyAnswers(), deceasedGender: 'male' as const, hasDescendants: false, fatherAlive: true };
    expect(router.getVisibleSteps(answers)).not.toContain('paternalGrandfatherAlive');
  });

  it('asks about the paternal grandfather only when the father is not alive', () => {
    const answers = { ...createEmptyAnswers(), deceasedGender: 'male' as const, hasDescendants: false, fatherAlive: false };
    expect(router.getVisibleSteps(answers)).toContain('paternalGrandfatherAlive');
  });

  it('skips grandmother count while the mother is alive, and asks it when she is not', () => {
    const motherAlive = { ...createEmptyAnswers(), deceasedGender: 'male' as const, hasDescendants: false, fatherAlive: false, motherAlive: true };
    const motherDead = { ...motherAlive, motherAlive: false };
    expect(router.getVisibleSteps(motherAlive)).not.toContain('grandmothersCount');
    expect(router.getVisibleSteps(motherDead)).toContain('grandmothersCount');
  });

  it('skips every sibling question when a male descendant (son) is present', () => {
    const answers = {
      ...createEmptyAnswers(),
      deceasedGender: 'male' as const,
      hasDescendants: true,
      sonsCount: 1,
      fatherAlive: false,
      motherAlive: false,
    };
    const visible = router.getVisibleSteps(answers);
    expect(visible).not.toContain('fullBrothersCount');
    expect(visible).not.toContain('fullSistersCount');
    expect(visible).not.toContain('maternalSiblingsCount');
  });

  it('asks the combined mother-share sibling count only when the father is alive, mother is alive, and there is no descendant', () => {
    const answers = {
      ...createEmptyAnswers(),
      deceasedGender: 'male' as const,
      hasDescendants: false,
      fatherAlive: true,
      motherAlive: true,
    };
    const visible = router.getVisibleSteps(answers);
    expect(visible).toContain('siblingsForMotherShareCount');
    expect(visible).not.toContain('fullBrothersCount');
  });

  it('does not ask the extended-family chain questions when a full brother is present', () => {
    const answers = {
      ...createEmptyAnswers(),
      deceasedGender: 'male' as const,
      hasDescendants: false,
      fatherAlive: false,
      motherAlive: false,
      fullBrothersCount: 1,
    };
    expect(router.getVisibleSteps(answers)).not.toContain('fullNephewsCount');
  });

  it('asks the extended-family chain questions when no closer heir exists', () => {
    const answers = {
      ...createEmptyAnswers(),
      deceasedGender: 'male' as const,
      hasDescendants: false,
      fatherAlive: false,
      motherAlive: false,
    };
    expect(router.getVisibleSteps(answers)).toContain('fullNephewsCount');
  });

  it('always includes the estate step as the final question and treats it as answered', () => {
    const answers = { ...createEmptyAnswers(), deceasedGender: 'male' as const, hasDescendants: false };
    const visible = router.getVisibleSteps(answers);
    expect(visible[visible.length - 1]).toBe('estateValue');
    expect(router.isAnswered('estateValue', answers)).toBeTrue();
  });

  it('moves forward and backward through the visible steps', () => {
    const answers = { ...createEmptyAnswers(), deceasedGender: 'male' as const };
    const next = router.getNextStep('deceasedGender', answers);
    expect(next).toBe('wivesCount');
    expect(router.getPreviousStep(next!, answers)).toBe('deceasedGender');
  });
});
