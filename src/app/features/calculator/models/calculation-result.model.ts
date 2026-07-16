import { Fraction } from '../../../shared/utils/fraction';
import { CalculatorAnswers } from './calculator-answers.model';
import { DerivedFacts } from './derived-facts.model';
import { BlockedHeirGroup, EligibleHeirShare } from './heir.model';

export type AdjustmentType = 'awl' | 'radd' | 'umariyyatayn';

export interface AdjustmentRecord {
  type: AdjustmentType;
  description: string;
  /** Denominator before / after, for Awl display (e.g. 6 -> 8). */
  fromDenominator?: number;
  toDenominator?: number;
}

export interface DetailedCalculationStep {
  label: string;
  value: string;
}

export interface ExplanationEntry {
  relationship: string;
  simple: string;
  detailed: string;
  sourceRefs: string[];
}

export interface CalculationResult {
  answers: CalculatorAnswers;
  derivedFacts: DerivedFacts;
  eligibleHeirs: EligibleHeirShare[];
  blockedHeirs: BlockedHeirGroup[];
  fixedSharesTotal: Fraction;
  residue: Fraction;
  adjustments: AdjustmentRecord[];
  finalShares: EligibleHeirShare[];
  explanations: ExplanationEntry[];
  detailedSteps: DetailedCalculationStep[];
  validationWarnings: string[];
  estateValue: number | null;
  unassignedRemainder: Fraction;
  unassignedRemainderNote: string | null;
}
