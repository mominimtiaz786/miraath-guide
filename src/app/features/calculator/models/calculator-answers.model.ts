export type DeceasedGender = 'male' | 'female';

/**
 * Raw wizard answers. Every count defaults to 0 and every unanswered
 * boolean/enum defaults to null so the question router can tell
 * "not yet asked" apart from "answered no / zero".
 */
export interface CalculatorAnswers {
  deceasedGender: DeceasedGender | null;

  // Spouse
  husbandAlive: boolean | null;
  wivesCount: number | null;

  // Descendant gate
  hasDescendants: boolean | null;
  sonsCount: number;
  daughtersCount: number;
  paternalGrandsonsCount: number;
  paternalGranddaughtersCount: number;

  // Parents / grandparents
  fatherAlive: boolean | null;
  paternalGrandfatherAlive: boolean | null;
  motherAlive: boolean | null;
  grandmothersCount: number | null;

  // Sibling branch (mother's-share-only combined count)
  siblingsForMotherShareCount: number | null;

  // Sibling branch (full detail, when father figure absent and no male descendant)
  fullBrothersCount: number;
  fullSistersCount: number;
  maternalSiblingsCount: number;
  paternalHalfBrothersCount: number;
  paternalHalfSistersCount: number;

  // Asabah chain (extended male relatives)
  fullNephewsCount: number;
  halfNephewsCount: number;
  fullNephewsSonsCount: number;
  halfNephewsSonsCount: number;
  fullUnclesCount: number;
  halfUnclesCount: number;
  fullCousinsCount: number;
  halfCousinsCount: number;

  // Estate
  estateValue: number | null;
}

export function createEmptyAnswers(): CalculatorAnswers {
  return {
    deceasedGender: null,
    husbandAlive: null,
    wivesCount: null,
    hasDescendants: null,
    sonsCount: 0,
    daughtersCount: 0,
    paternalGrandsonsCount: 0,
    paternalGranddaughtersCount: 0,
    fatherAlive: null,
    paternalGrandfatherAlive: null,
    motherAlive: null,
    grandmothersCount: null,
    siblingsForMotherShareCount: null,
    fullBrothersCount: 0,
    fullSistersCount: 0,
    maternalSiblingsCount: 0,
    paternalHalfBrothersCount: 0,
    paternalHalfSistersCount: 0,
    fullNephewsCount: 0,
    halfNephewsCount: 0,
    fullNephewsSonsCount: 0,
    halfNephewsSonsCount: 0,
    fullUnclesCount: 0,
    halfUnclesCount: 0,
    fullCousinsCount: 0,
    halfCousinsCount: 0,
    estateValue: null,
  };
}
