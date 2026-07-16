export type FatherFigureType = 'father' | 'grandfather' | 'none';

/**
 * Facts computed from CalculatorAnswers per spec section 13B.1.
 * These never require questions of their own - they are always derived.
 */
export interface DerivedFacts {
  fatherFigure: boolean;
  fatherFigureType: FatherFigureType;
  maleDescendant: boolean;
  femaleDescendant: boolean;
  anyDescendant: boolean;
  /** Sum of full/half/maternal siblings, counted even when blocked (affects the mother's share only). */
  totalSiblings: number;
  hasSpouseShare: boolean;
}
