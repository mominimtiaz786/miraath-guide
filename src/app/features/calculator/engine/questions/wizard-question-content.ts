import { WizardStepId } from '../../models/wizard-step.model';

export interface CountQuestionContent {
  kind: 'count';
  question: string;
  helper?: string;
  whyWeAsk?: string;
  min: number;
  max: number;
}

export interface ChoiceQuestionContent {
  kind: 'choice';
  question: string;
  helper?: string;
  whyWeAsk?: string;
}

export interface EstateQuestionContent {
  kind: 'estate';
  question: string;
  helper?: string;
  whyWeAsk?: string;
}

export type WizardQuestionContent = CountQuestionContent | ChoiceQuestionContent | EstateQuestionContent;

export const WIZARD_QUESTION_CONTENT: Record<WizardStepId, WizardQuestionContent> = {
  deceasedGender: {
    kind: 'choice',
    question: 'What was the gender of the deceased?',
    helper: 'This helps us identify the applicable Qur’anic shares.',
    whyWeAsk: "Some shares differ between a deceased man and woman - for example, the surviving spouse's fraction.",
  },
  husbandAlive: {
    kind: 'choice',
    question: 'Is the husband still alive?',
    helper: 'Only the husband can be the surviving spouse here, since the deceased is female.',
    whyWeAsk: "A living husband always receives a fixed share - 1/2 or 1/4 depending on descendants.",
  },
  wivesCount: {
    kind: 'count',
    question: 'How many wives survive the deceased?',
    helper: 'Enter 0 if there is no surviving wife. Up to four wives share one pooled fraction.',
    whyWeAsk: 'A surviving wife (or wives) always receives a fixed share of 1/4 or 1/8, split equally if there is more than one.',
    min: 0,
    max: 4,
  },
  hasDescendants: {
    kind: 'choice',
    question: "Are any children or a son's descendants alive?",
    helper: "Include sons, daughters, and any of a son's own children.",
    whyWeAsk: 'This single answer determines whether several other questions about children need to be asked at all.',
  },
  fatherAlive: {
    kind: 'choice',
    question: 'Is the father of the deceased still alive?',
    whyWeAsk: "A living father always inherits, and blocks the paternal grandfather and every sibling entirely.",
  },
  paternalGrandfatherAlive: {
    kind: 'choice',
    question: 'Is the paternal grandfather of the deceased still alive?',
    helper: 'We only ask this because the father is no longer alive.',
    whyWeAsk: 'When the father has passed away, the paternal grandfather can take his place in several share rules.',
  },
  motherAlive: {
    kind: 'choice',
    question: 'Is the mother of the deceased still alive?',
    whyWeAsk: 'A living mother always inherits, and blocks every grandmother entirely.',
  },
  grandmothersCount: {
    kind: 'count',
    question: 'How many eligible grandmothers survive?',
    helper: 'Count only grandmothers on a line not blocked by a closer relative - typically the mother’s mother and the father’s mother.',
    whyWeAsk: "We only ask this because the mother is no longer alive - eligible grandmothers share her 1/6 as a pool.",
    min: 0,
    max: 2,
  },
  sonsCount: {
    kind: 'count',
    question: 'How many sons survive the deceased?',
    min: 0,
    max: 20,
  },
  daughtersCount: {
    kind: 'count',
    question: 'How many daughters survive the deceased?',
    min: 0,
    max: 20,
  },
  paternalGrandsonsCount: {
    kind: 'count',
    question: "How many son's sons (grandsons through a son) survive?",
    helper: 'We only ask this because there is no surviving son.',
    min: 0,
    max: 20,
  },
  paternalGranddaughtersCount: {
    kind: 'count',
    question: "How many son's daughters (granddaughters through a son) survive?",
    min: 0,
    max: 20,
  },
  siblingsForMotherShareCount: {
    kind: 'count',
    question: 'How many siblings of any kind (full, half, or maternal) survive?',
    helper: "This count is used only to determine the mother's share - these siblings will not receive a share themselves, since the father blocks them.",
    whyWeAsk: 'Two or more siblings reduce the mother’s share from 1/3 to 1/6, even though the siblings themselves cannot inherit while the father is alive.',
    min: 0,
    max: 20,
  },
  fullBrothersCount: {
    kind: 'count',
    question: 'How many full brothers (same two parents) survive?',
    min: 0,
    max: 20,
  },
  fullSistersCount: {
    kind: 'count',
    question: 'How many full sisters (same two parents) survive?',
    min: 0,
    max: 20,
  },
  maternalSiblingsCount: {
    kind: 'count',
    question: 'How many maternal siblings (same mother, different father) survive?',
    helper: 'Maternal brothers and sisters share equally - count them together.',
    min: 0,
    max: 20,
  },
  paternalHalfBrothersCount: {
    kind: 'count',
    question: 'How many paternal half-brothers (same father, different mother) survive?',
    min: 0,
    max: 20,
  },
  paternalHalfSistersCount: {
    kind: 'count',
    question: 'How many paternal half-sisters (same father, different mother) survive?',
    min: 0,
    max: 20,
  },
  fullNephewsCount: {
    kind: 'count',
    question: "How many sons of a full brother survive?",
    min: 0,
    max: 20,
  },
  halfNephewsCount: {
    kind: 'count',
    question: 'How many sons of a paternal half-brother survive?',
    helper: 'We only ask this because there is no surviving son of a full brother.',
    min: 0,
    max: 20,
  },
  fullNephewsSonsCount: {
    kind: 'count',
    question: "How many sons of a full brother's son survive?",
    min: 0,
    max: 20,
  },
  halfNephewsSonsCount: {
    kind: 'count',
    question: "How many sons of a paternal half-brother's son survive?",
    min: 0,
    max: 20,
  },
  fullUnclesCount: {
    kind: 'count',
    question: "How many full paternal uncles (the father's full brothers) survive?",
    min: 0,
    max: 20,
  },
  halfUnclesCount: {
    kind: 'count',
    question: "How many paternal half-uncles (the father's paternal half-brothers) survive?",
    min: 0,
    max: 20,
  },
  fullCousinsCount: {
    kind: 'count',
    question: "How many sons of a full paternal uncle survive?",
    min: 0,
    max: 20,
  },
  halfCousinsCount: {
    kind: 'count',
    question: "How many sons of a paternal half-uncle survive?",
    min: 0,
    max: 20,
  },
  estateValue: {
    kind: 'estate',
    question: 'What is the distributable estate value? (optional)',
    helper: 'Enter the net estate after valid expenses, debts, and bequests - or skip this and see fractional results only.',
    whyWeAsk: 'This lets us show PKR amounts alongside every fraction and percentage. It never affects the shares themselves.',
  },
};
