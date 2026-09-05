import { EN_EXPLANATIONS } from './en.explanations';

export const FR_EXPLANATIONS = {
  ...EN_EXPLANATIONS,
  'husband.withDescendant': { simple: 'Le mari reçoit un quart car la défunte laisse des descendants.', detailed: 'Le Coran 4:12 fixe la part du mari à 1/4 lorsqu’il existe des descendants.', sourceRefs: ['quran-4-12'] },
  'husband.noDescendant': { simple: 'Le mari reçoit la moitié car la défunte ne laisse pas de descendants.', detailed: 'Le Coran 4:12 fixe la part du mari à 1/2 en l’absence de descendants.', sourceRefs: ['quran-4-12'] },
  'wife.withDescendant': { simple: 'L’épouse ou les épouses partagent un huitième car des descendants existent.', detailed: 'Le Coran 4:12 fixe leur part commune à 1/8 avec descendants.', sourceRefs: ['quran-4-12'] },
  'wife.noDescendant': { simple: 'L’épouse ou les épouses partagent un quart car il n’y a pas de descendants.', detailed: 'Le Coran 4:12 fixe leur part commune à 1/4 sans descendants.', sourceRefs: ['quran-4-12'] },
  'mother.reduced': { simple: 'La mère reçoit un sixième en présence de descendants ou de deux frères/soeurs ou plus.', detailed: 'Le Coran 4:11 réduit la part de la mère de 1/3 à 1/6 dans cette situation.', sourceRefs: ['quran-4-11'] },
  'mother.full': { simple: 'La mère reçoit un tiers car il n’y a pas de descendants et moins de deux frères/soeurs.', detailed: 'Le Coran 4:11 donne alors 1/3 à la mère.', sourceRefs: ['quran-4-11'] },
  'daughter.single': { simple: 'La fille unique reçoit la moitié car aucun fils n’est présent.', detailed: 'Le Coran 4:11 donne 1/2 à une fille unique sans fils.', sourceRefs: ['quran-4-11'] },
  'daughter.multiple': { simple: 'Les filles partagent deux tiers en l’absence de fils.', detailed: 'Le Coran 4:11 donne un pool de 2/3 à deux filles ou plus sans fils.', sourceRefs: ['quran-4-11'] },
};
