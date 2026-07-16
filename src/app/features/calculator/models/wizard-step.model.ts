export type WizardSection =
  | 'deceased'
  | 'immediateFamily'
  | 'childrenDescendants'
  | 'siblings'
  | 'extendedFamily'
  | 'estate'
  | 'review';

export type WizardStepId =
  | 'deceasedGender'
  | 'husbandAlive'
  | 'wivesCount'
  | 'hasDescendants'
  | 'sonsCount'
  | 'daughtersCount'
  | 'paternalGrandsonsCount'
  | 'paternalGranddaughtersCount'
  | 'fatherAlive'
  | 'paternalGrandfatherAlive'
  | 'motherAlive'
  | 'grandmothersCount'
  | 'siblingsForMotherShareCount'
  | 'fullBrothersCount'
  | 'fullSistersCount'
  | 'maternalSiblingsCount'
  | 'paternalHalfBrothersCount'
  | 'paternalHalfSistersCount'
  | 'fullNephewsCount'
  | 'halfNephewsCount'
  | 'fullNephewsSonsCount'
  | 'halfNephewsSonsCount'
  | 'fullUnclesCount'
  | 'halfUnclesCount'
  | 'fullCousinsCount'
  | 'halfCousinsCount'
  | 'estateValue';

export const WIZARD_SECTION_LABELS: Record<WizardSection, string> = {
  deceased: 'About the Deceased',
  immediateFamily: 'Immediate Family',
  childrenDescendants: 'Children & Descendants',
  siblings: 'Siblings',
  extendedFamily: 'Extended Family',
  estate: 'Estate',
  review: 'Review',
};

export const WIZARD_SECTION_ORDER: WizardSection[] = [
  'deceased',
  'immediateFamily',
  'childrenDescendants',
  'siblings',
  'extendedFamily',
  'estate',
  'review',
];
