import { Fraction } from '../../../shared/utils/fraction';

/** Every heir group the engine can recognize, fixed-share or residuary. */
export type HeirRelationship =
  | 'husband'
  | 'wife'
  | 'mother'
  | 'father'
  | 'paternalGrandfather'
  | 'grandmother'
  | 'son'
  | 'daughter'
  | 'sonsSon'
  | 'sonsDaughter'
  | 'fullBrother'
  | 'fullSister'
  | 'paternalHalfBrother'
  | 'paternalHalfSister'
  | 'maternalSibling'
  | 'fullNephew'
  | 'halfNephew'
  | 'fullNephewsSon'
  | 'halfNephewsSon'
  | 'fullUncle'
  | 'halfUncle'
  | 'fullCousin'
  | 'halfCousin';

export type ShareType = 'fixed' | 'fixed-plus-residue' | 'residuary' | 'radd';

export interface EligibleHeirShare {
  relationship: HeirRelationship;
  /** Number of individuals occupying this relationship group. */
  count: number;
  /** Total fraction of the estate allocated to this whole group. */
  poolShare: Fraction;
  /** poolShare divided across the individuals in the group (accounting for 2:1 pairing where relevant). */
  perPersonShare: Fraction;
  shareType: ShareType;
  /** Explanation key resolved by the ExplanationEngine into localized copy. */
  reasonCode: string;
  sourceRefs: string[];
}

export interface BlockedHeirGroup {
  relationship: HeirRelationship;
  /** Category-level ("no count collected") vs a specific answered-but-blocked case. */
  detectionLevel: 'category' | 'specific';
  reasonCode: string;
  blockingRelationship: HeirRelationship | HeirRelationship[];
}
