import { GlossaryTerm } from './glossary-term.model';

export const GLOSSARY_TERMS: GlossaryTerm[] = [
  {
    term: 'Faraid',
    romanUrdu: 'Faraid',
    icon: 'BookOpenCheck',
    definition: 'The Islamic science of inheritance - the fixed, Qur\'anically-prescribed shares and the rules governing how an estate is distributed among heirs.',
  },
  {
    term: 'Mirath',
    romanUrdu: 'Mirath',
    icon: 'FileText',
    definition: 'The estate or inheritance itself - what remains for distribution after funeral expenses, debts, and valid bequests (wasiyyah) have been settled.',
  },
  {
    term: 'Ashab al-Furud',
    romanUrdu: 'Ashab-ul-Farooz',
    icon: 'BookOpenCheck',
    definition: "Heirs with fixed, Qur'anically-prescribed shares - such as 1/2, 1/4, 1/8, 1/3, 1/6, or 2/3 - for example the spouse, mother, and daughters.",
  },
  {
    term: 'Asabah',
    romanUrdu: 'Asba',
    icon: 'Network',
    definition: 'Residuary heirs who take whatever remains of the estate after fixed shares are paid, rather than a fixed fraction - for example sons, and the father when no descendant exists.',
  },
  {
    term: 'Hajb',
    romanUrdu: 'Hajb',
    icon: 'Shield',
    definition: 'Blocking - the exclusion of an heir from inheriting, whether completely or partially, because a closer relative exists. For example, a living father blocks the paternal grandfather entirely.',
  },
  {
    term: 'Kalalah',
    romanUrdu: 'Kalalah',
    icon: 'GitBranch',
    definition: 'A case where the deceased leaves no descendant and no father (or paternal grandfather) - the condition under which siblings of any kind become eligible to inherit.',
  },
  {
    term: 'Awl',
    romanUrdu: 'Aul',
    icon: 'Scale',
    definition: 'Proportional reduction applied when the total of the fixed shares exceeds the whole estate - every fixed-share heir, including the spouse, is scaled down by the same ratio.',
  },
  {
    term: 'Radd',
    romanUrdu: 'Radd',
    icon: 'ChartPie',
    definition: "Return of the surplus - when fixed shares leave a remainder and no residuary heir exists to claim it, the surplus is returned proportionally to the fixed-share heirs, excluding the spouse.",
  },
  {
    term: 'Umariyyatayn',
    romanUrdu: 'Umariyyatayn',
    icon: 'UsersRound',
    definition: "The 'two cases of Umar' - when a spouse and both parents are the only heirs (with no descendants and fewer than two siblings), the mother's third is calculated on the remainder after the spouse's share, not the whole estate.",
  },
  {
    term: 'Dhawil al-Arham',
    romanUrdu: 'Zawil Arham',
    icon: 'Network',
    definition: 'Distant kindred - relatives who are neither fixed-share heirs nor residuary heirs (such as maternal uncles or daughters\' children). This MVP does not distribute to this category.',
  },
  {
    term: 'Wasiyyah',
    romanUrdu: 'Wasiyat',
    icon: 'FileText',
    definition: "A valid bequest of up to one-third of the estate to a non-heir, settled before the remaining estate is distributed by Faraid. Not calculated by this MVP - enter the estate net of any wasiyyah.",
  },
  {
    term: "Asabah ma'a al-ghayr",
    romanUrdu: 'Asba maal ghair',
    icon: 'Network',
    definition: "'Residuary through another' - full or paternal half-sisters who convert from fixed-share heirs into residuary heirs because a daughter or son's daughter is present, taking the remainder after the descendant's fixed share.",
  },
];
