import { SourceReference } from '../../core/models/source-reference.model';

export const SOURCE_REFERENCES: Record<string, SourceReference> = {
  'quran-4-11': {
    id: 'quran-4-11',
    label: "Qur'an 4:11",
    arabic:
      'يُوصِيكُمُ اللَّهُ فِي أَوْلَادِكُمْ لِلذَّكَرِ مِثْلُ حَظِّ الْأُنثَيَيْنِ',
    translation:
      'Allah instructs you concerning your children: for the male, what is equal to the share of two females. It also prescribes the fixed shares of parents.',
    note: 'Primary basis for the shares of children, parents, and the father/mother fixed shares.',
  },
  'quran-4-12': {
    id: 'quran-4-12',
    label: "Qur'an 4:12",
    translation:
      "Prescribes the shares of husbands, wives, and maternal siblings (kalalah) - a brother or sister from the mother's side.",
    note: 'Primary basis for spousal shares and the maternal-sibling (uterine) fixed share.',
  },
  'quran-4-176': {
    id: 'quran-4-176',
    label: "Qur'an 4:176",
    translation:
      'The final verse on inheritance (kalalah), addressing a person who dies leaving no children or father, and the shares of a sister or brother in that case.',
    note: 'Primary basis for full and paternal half-sibling fixed shares.',
  },
  'bukhari-6732': {
    id: 'bukhari-6732',
    label: 'Sahih al-Bukhari 6732',
    translation:
      'The Prophet (peace be upon him) said: "Give the shares of the inheritance to those who are entitled to receive it, and whatever remains, should be given to the closest male relative of the deceased."',
    note: 'Primary basis for the residuary (asabah) chain and its ordering.',
  },
};
