import { CalculatorAnswers } from '../models/calculator-answers.model';
import { DerivedFacts } from '../models/derived-facts.model';
import { WizardSection, WizardStepId } from '../models/wizard-step.model';

export interface RouterContext {
  answers: CalculatorAnswers;
  facts: DerivedFacts;
  /** Whether the extended-family (asabah) chain has any residue left to distribute - spec 13B.8. */
  chainOpen: boolean;
}

export interface WizardStepDefinition {
  id: WizardStepId;
  section: WizardSection;
  isVisible: (ctx: RouterContext) => boolean;
  isAnswered: (answers: CalculatorAnswers) => boolean;
}

const isCount = (value: number | null): value is number => value != null;

/** Implements the exact conditional flow in spec section 13. Order matters. */
export const WIZARD_STEPS: WizardStepDefinition[] = [
  {
    id: 'deceasedGender',
    section: 'deceased',
    isVisible: () => true,
    isAnswered: (a) => a.deceasedGender != null,
  },
  {
    id: 'husbandAlive',
    section: 'immediateFamily',
    isVisible: (ctx) => ctx.answers.deceasedGender === 'female',
    isAnswered: (a) => a.husbandAlive != null,
  },
  {
    id: 'wivesCount',
    section: 'immediateFamily',
    isVisible: (ctx) => ctx.answers.deceasedGender === 'male',
    isAnswered: (a) => isCount(a.wivesCount),
  },
  {
    id: 'hasDescendants',
    section: 'childrenDescendants',
    isVisible: (ctx) => ctx.answers.deceasedGender != null,
    isAnswered: (a) => a.hasDescendants != null,
  },
  {
    id: 'fatherAlive',
    section: 'immediateFamily',
    isVisible: (ctx) => ctx.answers.hasDescendants != null,
    isAnswered: (a) => a.fatherAlive != null,
  },
  {
    id: 'paternalGrandfatherAlive',
    section: 'immediateFamily',
    isVisible: (ctx) => ctx.answers.fatherAlive === false,
    isAnswered: (a) => a.paternalGrandfatherAlive != null,
  },
  {
    id: 'motherAlive',
    section: 'immediateFamily',
    isVisible: (ctx) => ctx.answers.fatherAlive != null,
    isAnswered: (a) => a.motherAlive != null,
  },
  {
    id: 'grandmothersCount',
    section: 'immediateFamily',
    isVisible: (ctx) => ctx.answers.motherAlive === false,
    isAnswered: (a) => isCount(a.grandmothersCount),
  },
  {
    id: 'sonsCount',
    section: 'childrenDescendants',
    isVisible: (ctx) => ctx.answers.hasDescendants === true,
    isAnswered: (a) => isCount(a.sonsCount) || a.sonsCount === 0,
  },
  {
    id: 'daughtersCount',
    section: 'childrenDescendants',
    isVisible: (ctx) => ctx.answers.hasDescendants === true,
    isAnswered: (a) => isCount(a.daughtersCount) || a.daughtersCount === 0,
  },
  {
    id: 'paternalGrandsonsCount',
    section: 'childrenDescendants',
    isVisible: (ctx) => ctx.answers.hasDescendants === true && ctx.answers.sonsCount === 0,
    isAnswered: (a) => isCount(a.paternalGrandsonsCount) || a.paternalGrandsonsCount === 0,
  },
  {
    id: 'paternalGranddaughtersCount',
    section: 'childrenDescendants',
    isVisible: (ctx) =>
      ctx.answers.hasDescendants === true &&
      ctx.answers.sonsCount === 0 &&
      (ctx.answers.paternalGrandsonsCount > 0 || ctx.answers.daughtersCount <= 1),
    isAnswered: (a) => isCount(a.paternalGranddaughtersCount) || a.paternalGranddaughtersCount === 0,
  },
  {
    id: 'siblingsForMotherShareCount',
    section: 'siblings',
    isVisible: (ctx) => ctx.facts.fatherFigure && ctx.answers.motherAlive === true && !ctx.facts.anyDescendant,
    isAnswered: (a) => isCount(a.siblingsForMotherShareCount),
  },
  {
    id: 'fullBrothersCount',
    section: 'siblings',
    isVisible: (ctx) => !ctx.facts.fatherFigure && !ctx.facts.maleDescendant,
    isAnswered: (a) => a.fullBrothersCount >= 0 && a.fullBrothersCount !== null,
  },
  {
    id: 'fullSistersCount',
    section: 'siblings',
    isVisible: (ctx) => !ctx.facts.fatherFigure && !ctx.facts.maleDescendant,
    isAnswered: (a) => a.fullSistersCount != null,
  },
  {
    id: 'maternalSiblingsCount',
    section: 'siblings',
    isVisible: (ctx) => !ctx.facts.fatherFigure && !ctx.facts.maleDescendant && !ctx.facts.anyDescendant,
    isAnswered: (a) => a.maternalSiblingsCount != null,
  },
  {
    id: 'paternalHalfBrothersCount',
    section: 'siblings',
    isVisible: (ctx) =>
      !ctx.facts.fatherFigure &&
      !ctx.facts.maleDescendant &&
      ctx.answers.fullBrothersCount === 0 &&
      !(ctx.answers.fullSistersCount > 0 && ctx.facts.femaleDescendant),
    isAnswered: (a) => a.paternalHalfBrothersCount != null,
  },
  {
    id: 'paternalHalfSistersCount',
    section: 'siblings',
    isVisible: (ctx) =>
      !ctx.facts.fatherFigure &&
      !ctx.facts.maleDescendant &&
      ctx.answers.fullBrothersCount === 0 &&
      !(ctx.answers.fullSistersCount > 0 && ctx.facts.femaleDescendant) &&
      (ctx.answers.paternalHalfBrothersCount > 0 || ctx.answers.fullSistersCount <= 1),
    isAnswered: (a) => a.paternalHalfSistersCount != null,
  },
  {
    id: 'fullNephewsCount',
    section: 'extendedFamily',
    isVisible: (ctx) => ctx.chainOpen,
    isAnswered: (a) => a.fullNephewsCount != null,
  },
  {
    id: 'halfNephewsCount',
    section: 'extendedFamily',
    isVisible: (ctx) => ctx.chainOpen && ctx.answers.fullNephewsCount === 0,
    isAnswered: (a) => a.halfNephewsCount != null,
  },
  {
    id: 'fullNephewsSonsCount',
    section: 'extendedFamily',
    isVisible: (ctx) => ctx.chainOpen && ctx.answers.fullNephewsCount === 0 && ctx.answers.halfNephewsCount === 0,
    isAnswered: (a) => a.fullNephewsSonsCount != null,
  },
  {
    id: 'halfNephewsSonsCount',
    section: 'extendedFamily',
    isVisible: (ctx) =>
      ctx.chainOpen &&
      ctx.answers.fullNephewsCount === 0 &&
      ctx.answers.halfNephewsCount === 0 &&
      ctx.answers.fullNephewsSonsCount === 0,
    isAnswered: (a) => a.halfNephewsSonsCount != null,
  },
  {
    id: 'fullUnclesCount',
    section: 'extendedFamily',
    isVisible: (ctx) =>
      ctx.chainOpen &&
      ctx.answers.fullNephewsCount === 0 &&
      ctx.answers.halfNephewsCount === 0 &&
      ctx.answers.fullNephewsSonsCount === 0 &&
      ctx.answers.halfNephewsSonsCount === 0,
    isAnswered: (a) => a.fullUnclesCount != null,
  },
  {
    id: 'halfUnclesCount',
    section: 'extendedFamily',
    isVisible: (ctx) =>
      ctx.chainOpen &&
      ctx.answers.fullNephewsCount === 0 &&
      ctx.answers.halfNephewsCount === 0 &&
      ctx.answers.fullNephewsSonsCount === 0 &&
      ctx.answers.halfNephewsSonsCount === 0 &&
      ctx.answers.fullUnclesCount === 0,
    isAnswered: (a) => a.halfUnclesCount != null,
  },
  {
    id: 'fullCousinsCount',
    section: 'extendedFamily',
    isVisible: (ctx) =>
      ctx.chainOpen &&
      ctx.answers.fullNephewsCount === 0 &&
      ctx.answers.halfNephewsCount === 0 &&
      ctx.answers.fullNephewsSonsCount === 0 &&
      ctx.answers.halfNephewsSonsCount === 0 &&
      ctx.answers.fullUnclesCount === 0 &&
      ctx.answers.halfUnclesCount === 0,
    isAnswered: (a) => a.fullCousinsCount != null,
  },
  {
    id: 'halfCousinsCount',
    section: 'extendedFamily',
    isVisible: (ctx) =>
      ctx.chainOpen &&
      ctx.answers.fullNephewsCount === 0 &&
      ctx.answers.halfNephewsCount === 0 &&
      ctx.answers.fullNephewsSonsCount === 0 &&
      ctx.answers.halfNephewsSonsCount === 0 &&
      ctx.answers.fullUnclesCount === 0 &&
      ctx.answers.halfUnclesCount === 0 &&
      ctx.answers.fullCousinsCount === 0,
    isAnswered: (a) => a.halfCousinsCount != null,
  },
  {
    id: 'estateValue',
    section: 'estate',
    isVisible: () => true,
    // Estate value is optional and always considered "answered" so it never blocks Continue.
    isAnswered: () => true,
  },
];
