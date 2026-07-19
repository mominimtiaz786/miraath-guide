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

const isCountOrDefault = (value: number | null): boolean => value == null || value >= 0;

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
    isAnswered: (a) => isCountOrDefault(a.wivesCount),
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
    isAnswered: (a) => isCountOrDefault(a.grandmothersCount),
  },
  {
    id: 'sonsCount',
    section: 'childrenDescendants',
    isVisible: (ctx) => ctx.answers.hasDescendants === true,
    isAnswered: (a) => isCountOrDefault(a.sonsCount),
  },
  {
    id: 'daughtersCount',
    section: 'childrenDescendants',
    isVisible: (ctx) => ctx.answers.hasDescendants === true,
    isAnswered: (a) => isCountOrDefault(a.daughtersCount),
  },
  {
    id: 'paternalGrandsonsCount',
    section: 'childrenDescendants',
    isVisible: (ctx) => ctx.answers.hasDescendants === true && ctx.answers.sonsCount === 0,
    isAnswered: (a) => isCountOrDefault(a.paternalGrandsonsCount),
  },
  {
    id: 'paternalGranddaughtersCount',
    section: 'childrenDescendants',
    isVisible: (ctx) =>
      ctx.answers.hasDescendants === true &&
      ctx.answers.sonsCount === 0 &&
      (ctx.answers.paternalGrandsonsCount > 0 || ctx.answers.daughtersCount <= 1),
    isAnswered: (a) => isCountOrDefault(a.paternalGranddaughtersCount),
  },
  {
    id: 'siblingsForMotherShareCount',
    section: 'siblings',
    isVisible: (ctx) => ctx.facts.fatherFigure && ctx.answers.motherAlive === true && !ctx.facts.anyDescendant,
    isAnswered: (a) => isCountOrDefault(a.siblingsForMotherShareCount),
  },
  {
    id: 'fullBrothersCount',
    section: 'siblings',
    isVisible: (ctx) => !ctx.facts.fatherFigure && !ctx.facts.maleDescendant,
    isAnswered: (a) => isCountOrDefault(a.fullBrothersCount),
  },
  {
    id: 'fullSistersCount',
    section: 'siblings',
    isVisible: (ctx) => !ctx.facts.fatherFigure && !ctx.facts.maleDescendant,
    isAnswered: (a) => isCountOrDefault(a.fullSistersCount),
  },
  {
    id: 'maternalSiblingsCount',
    section: 'siblings',
    isVisible: (ctx) => !ctx.facts.fatherFigure && !ctx.facts.maleDescendant && !ctx.facts.anyDescendant,
    isAnswered: (a) => isCountOrDefault(a.maternalSiblingsCount),
  },
  {
    id: 'paternalHalfBrothersCount',
    section: 'siblings',
    isVisible: (ctx) =>
      !ctx.facts.fatherFigure &&
      !ctx.facts.maleDescendant &&
      ctx.answers.fullBrothersCount === 0 &&
      !(ctx.answers.fullSistersCount > 0 && ctx.facts.femaleDescendant),
    isAnswered: (a) => isCountOrDefault(a.paternalHalfBrothersCount),
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
    isAnswered: (a) => isCountOrDefault(a.paternalHalfSistersCount),
  },
  {
    id: 'fullNephewsCount',
    section: 'extendedFamily',
    isVisible: (ctx) => ctx.chainOpen,
    isAnswered: (a) => isCountOrDefault(a.fullNephewsCount),
  },
  {
    id: 'halfNephewsCount',
    section: 'extendedFamily',
    isVisible: (ctx) => ctx.chainOpen && ctx.answers.fullNephewsCount === 0,
    isAnswered: (a) => isCountOrDefault(a.halfNephewsCount),
  },
  {
    id: 'fullNephewsSonsCount',
    section: 'extendedFamily',
    isVisible: (ctx) => ctx.chainOpen && ctx.answers.fullNephewsCount === 0 && ctx.answers.halfNephewsCount === 0,
    isAnswered: (a) => isCountOrDefault(a.fullNephewsSonsCount),
  },
  {
    id: 'halfNephewsSonsCount',
    section: 'extendedFamily',
    isVisible: (ctx) =>
      ctx.chainOpen &&
      ctx.answers.fullNephewsCount === 0 &&
      ctx.answers.halfNephewsCount === 0 &&
      ctx.answers.fullNephewsSonsCount === 0,
    isAnswered: (a) => isCountOrDefault(a.halfNephewsSonsCount),
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
    isAnswered: (a) => isCountOrDefault(a.fullUnclesCount),
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
    isAnswered: (a) => isCountOrDefault(a.halfUnclesCount),
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
    isAnswered: (a) => isCountOrDefault(a.fullCousinsCount),
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
    isAnswered: (a) => isCountOrDefault(a.halfCousinsCount),
  },
  {
    id: 'estateValue',
    section: 'estate',
    isVisible: () => true,
    // Estate value is optional and always considered "answered" so it never blocks Continue.
    isAnswered: () => true,
  },
];
