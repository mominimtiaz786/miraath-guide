import { CalculatorAnswers } from './calculator-answers.model';
import { HeirRelationship } from './heir.model';

export interface ExpectedShare {
  relationship: HeirRelationship;
  numerator: number;
  denominator: number;
}

export interface ExpectedBlockedHeir {
  relationship: HeirRelationship;
}

export interface ApprovedCaseFixture {
  id: string;
  description: string;
  /** Merged over createEmptyAnswers(). */
  answers: Partial<CalculatorAnswers>;
  expectedFinalShares: ExpectedShare[];
  expectedBlockedHeirs: ExpectedBlockedHeir[];
  expectedAdjustment?: 'awl' | 'radd' | 'umariyyatayn';
  /** Every fixture in this file is reference-implementation verified; scholarly review is pending. */
  verificationStatus: 'reference-implementation verified, scholarly review pending';
}
