import { createEmptyAnswers } from '../models/calculator-answers.model';
import { deriveFacts } from './derive-facts';

describe('deriveFacts', () => {
  it('marks fatherFigure true when the father is alive, and reports fatherFigureType as father', () => {
    const facts = deriveFacts({ ...createEmptyAnswers(), fatherAlive: true, paternalGrandfatherAlive: null });
    expect(facts.fatherFigure).toBeTrue();
    expect(facts.fatherFigureType).toBe('father');
  });

  it('falls back to the paternal grandfather only when the father is not alive', () => {
    const facts = deriveFacts({ ...createEmptyAnswers(), fatherAlive: false, paternalGrandfatherAlive: true });
    expect(facts.fatherFigure).toBeTrue();
    expect(facts.fatherFigureType).toBe('grandfather');
  });

  it('reports no father figure when neither father nor grandfather is alive', () => {
    const facts = deriveFacts({ ...createEmptyAnswers(), fatherAlive: false, paternalGrandfatherAlive: false });
    expect(facts.fatherFigure).toBeFalse();
    expect(facts.fatherFigureType).toBe('none');
  });

  it('derives maleDescendant from sons OR paternal grandsons', () => {
    expect(deriveFacts({ ...createEmptyAnswers(), sonsCount: 1 }).maleDescendant).toBeTrue();
    expect(deriveFacts({ ...createEmptyAnswers(), paternalGrandsonsCount: 1 }).maleDescendant).toBeTrue();
    expect(deriveFacts(createEmptyAnswers()).maleDescendant).toBeFalse();
  });

  it('derives femaleDescendant from daughters OR paternal granddaughters', () => {
    expect(deriveFacts({ ...createEmptyAnswers(), daughtersCount: 1 }).femaleDescendant).toBeTrue();
    expect(deriveFacts({ ...createEmptyAnswers(), paternalGranddaughtersCount: 1 }).femaleDescendant).toBeTrue();
  });

  it('uses the combined mother-share sibling count when it was the question asked', () => {
    const facts = deriveFacts({ ...createEmptyAnswers(), siblingsForMotherShareCount: 3, fullBrothersCount: 0 });
    expect(facts.totalSiblings).toBe(3);
  });

  it('falls back to summing individual sibling counts when no combined count was asked', () => {
    const facts = deriveFacts({
      ...createEmptyAnswers(),
      fullBrothersCount: 1,
      fullSistersCount: 1,
      paternalHalfBrothersCount: 1,
      paternalHalfSistersCount: 0,
      maternalSiblingsCount: 2,
    });
    expect(facts.totalSiblings).toBe(5);
  });

  it('recognizes a spouse share for a male deceased only when wives are present', () => {
    expect(deriveFacts({ ...createEmptyAnswers(), deceasedGender: 'male', wivesCount: 1 }).hasSpouseShare).toBeTrue();
    expect(deriveFacts({ ...createEmptyAnswers(), deceasedGender: 'male', wivesCount: 0 }).hasSpouseShare).toBeFalse();
  });

  it('recognizes a spouse share for a female deceased only when the husband is alive', () => {
    expect(deriveFacts({ ...createEmptyAnswers(), deceasedGender: 'female', husbandAlive: true }).hasSpouseShare).toBeTrue();
    expect(deriveFacts({ ...createEmptyAnswers(), deceasedGender: 'female', husbandAlive: false }).hasSpouseShare).toBeFalse();
  });
});
