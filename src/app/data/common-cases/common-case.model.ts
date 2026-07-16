import { FamilyTreeMiniHeir } from '../../shared/components/family-tree-mini/family-tree-mini.component';
import { CalculatorAnswers } from '../../features/calculator/models/calculator-answers.model';

export type CommonCaseCategory = 'spouse-children' | 'parents-siblings' | 'kalalah' | 'special-rules';

export interface KeyShare {
  label: string;
  value: string;
}

export interface CommonCaseDetailSection {
  heading: string;
  body: string;
}

export interface CommonCase {
  number: number;
  slug: string;
  title: string;
  category: CommonCaseCategory;
  heirs: FamilyTreeMiniHeir[];
  summary: string;
  keyShares: KeyShare[];
  scenario: string;
  eligibleHeirs: KeyShare[];
  blockedHeirs: { relationship: string; reason: string }[];
  calculationSteps: string[];
  ruleExplanation: string;
  relatedConcepts: string[];
  exampleEstate: number;
  /** Lets "Try this scenario in the calculator" preload the wizard with this case's answers. */
  answers: Partial<CalculatorAnswers>;
}
