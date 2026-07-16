import { CalculatorAnswers } from '../models/calculator-answers.model';
import { DerivedFacts } from '../models/derived-facts.model';

/**
 * Pure derivation per spec section 13B.1. No question in the wizard
 * ever asks for these directly - they are always computed from answers.
 */
export function deriveFacts(answers: CalculatorAnswers): DerivedFacts {
  const fatherAlive = answers.fatherAlive === true;
  const grandfatherAlive = answers.paternalGrandfatherAlive === true;
  const fatherFigure = fatherAlive || grandfatherAlive;
  const fatherFigureType = fatherAlive ? 'father' : grandfatherAlive ? 'grandfather' : 'none';

  const maleDescendant = answers.sonsCount > 0 || answers.paternalGrandsonsCount > 0;
  const femaleDescendant = answers.daughtersCount > 0 || answers.paternalGranddaughtersCount > 0;
  const anyDescendant = maleDescendant || femaleDescendant;

  const totalSiblings =
    answers.siblingsForMotherShareCount != null
      ? answers.siblingsForMotherShareCount
      : answers.fullBrothersCount +
        answers.fullSistersCount +
        answers.paternalHalfBrothersCount +
        answers.paternalHalfSistersCount +
        answers.maternalSiblingsCount;

  const hasSpouseShare =
    (answers.deceasedGender === 'male' && (answers.wivesCount ?? 0) > 0) ||
    (answers.deceasedGender === 'female' && answers.husbandAlive === true);

  return {
    fatherFigure,
    fatherFigureType,
    maleDescendant,
    femaleDescendant,
    anyDescendant,
    totalSiblings,
    hasSpouseShare,
  };
}
