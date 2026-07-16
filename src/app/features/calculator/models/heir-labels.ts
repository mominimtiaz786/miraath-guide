import { HeirRelationship } from './heir.model';

export interface HeirLabel {
  singular: string;
  plural: string;
}

export const HEIR_LABELS: Record<HeirRelationship, HeirLabel> = {
  husband: { singular: 'Husband', plural: 'Husband' },
  wife: { singular: 'Wife', plural: 'Wives' },
  mother: { singular: 'Mother', plural: 'Mother' },
  father: { singular: 'Father', plural: 'Father' },
  paternalGrandfather: { singular: 'Paternal grandfather', plural: 'Paternal grandfather' },
  grandmother: { singular: 'Grandmother', plural: 'Grandmothers' },
  son: { singular: 'Son', plural: 'Sons' },
  daughter: { singular: 'Daughter', plural: 'Daughters' },
  sonsSon: { singular: "Son's son", plural: "Son's sons" },
  sonsDaughter: { singular: "Son's daughter", plural: "Son's daughters" },
  fullBrother: { singular: 'Full brother', plural: 'Full brothers' },
  fullSister: { singular: 'Full sister', plural: 'Full sisters' },
  paternalHalfBrother: { singular: 'Paternal half-brother', plural: 'Paternal half-brothers' },
  paternalHalfSister: { singular: 'Paternal half-sister', plural: 'Paternal half-sisters' },
  maternalSibling: { singular: 'Maternal sibling', plural: 'Maternal siblings' },
  fullNephew: { singular: "Full brother's son", plural: "Full brother's sons" },
  halfNephew: { singular: "Paternal half-brother's son", plural: "Paternal half-brother's sons" },
  fullNephewsSon: { singular: "Full nephew's son", plural: "Full nephews' sons" },
  halfNephewsSon: { singular: "Half nephew's son", plural: "Half nephews' sons" },
  fullUncle: { singular: 'Full paternal uncle', plural: 'Full paternal uncles' },
  halfUncle: { singular: 'Paternal half-uncle', plural: 'Paternal half-uncles' },
  fullCousin: { singular: "Full uncle's son", plural: "Full uncle's sons" },
  halfCousin: { singular: "Half uncle's son", plural: "Half uncle's sons" },
};

export function heirLabel(relationship: HeirRelationship, count: number): string {
  const entry = HEIR_LABELS[relationship];
  return count === 1 ? entry.singular : entry.plural;
}
