import { localizeGlossary } from '../content-localization.util';
import { GLOSSARY_TERMS } from './glossary.data';

export const FR_GLOSSARY_TERMS = localizeGlossary(GLOSSARY_TERMS, {
  faraid: { term: 'Faraid', romanUrdu: 'Faraid', definition: "Science islamique de l'héritage : parts coraniques fixées et règles de distribution." },
  mirath: { term: 'Mirath', romanUrdu: 'Mirath', definition: 'La succession à distribuer après frais funéraires, dettes et wasiyyah valide.' },
  'ashab-al-furud': { term: 'Ashab al-Furud', romanUrdu: 'Ashab-ul-Furooz', definition: 'Héritiers à parts fixes, comme le conjoint, la mère et les filles.' },
  asabah: { term: 'Asabah', romanUrdu: 'Asabah', definition: 'Héritiers résiduaires qui reçoivent ce qui reste après les parts fixes.' },
  hajb: { term: 'Hajb', romanUrdu: 'Hajb', definition: 'Exclusion ou réduction d’un héritier par la présence d’un proche plus prioritaire.' },
  kalalah: { term: 'Kalalah', romanUrdu: 'Kalalah', definition: 'Cas où le défunt ne laisse ni descendant ni père ou grand-père paternel.' },
  awl: { term: 'Awl', romanUrdu: 'Awl', definition: 'Réduction proportionnelle lorsque les parts fixes dépassent la succession.' },
  radd: { term: 'Radd', romanUrdu: 'Radd', definition: 'Retour du surplus aux héritiers à parts fixes admissibles lorsqu’il n’y a pas d’Asabah.' },
  umariyyatayn: { term: 'Umariyyatayn', romanUrdu: 'Umariyyatayn', definition: 'Deux cas où le tiers de la mère se calcule sur le reliquat après la part du conjoint.' },
  'dhawil-al-arham': { term: 'Dhawil al-Arham', romanUrdu: 'Zawil Arham', definition: 'Parents éloignés qui ne sont ni héritiers à part fixe ni Asabah; hors périmètre de ce MVP.' },
  wasiyyah: { term: 'Wasiyyah', romanUrdu: 'Wasiyyah', definition: 'Legs valide jusqu’à un tiers à un non-héritier, réglé avant la distribution par Faraid.' },
  'asabah-maa-al-ghayr': { term: "Asabah ma'a al-ghayr", romanUrdu: "Asabah ma'a al-ghayr", definition: 'Soeur qui devient résiduaire grâce à la présence d’une fille ou fille du fils.' },
});
