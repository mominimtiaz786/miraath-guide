import { localizeSources } from '../content-localization.util';
import { SOURCE_REFERENCES } from './sources.data';

export const FR_SOURCE_REFERENCES = localizeSources(SOURCE_REFERENCES, {
  'quran-4-11': {
    label: 'Coran 4:11',
    translation:
      'Allah vous enjoint au sujet de vos enfants : au fils, une part égale à celle de deux filles. Ce verset fixe également les parts des parents.',
    note: 'Base principale des parts des enfants, des parents et des parts fixes du père et de la mère.',
  },
  'quran-4-12': {
    label: 'Coran 4:12',
    translation:
      'Fixe les parts des époux, des épouses et des frères et sœurs utérins (kalalah), c’est-à-dire du côté de la mère.',
    note: 'Base principale des parts du conjoint et de la part fixe des frères et sœurs utérins.',
  },
  'quran-4-176': {
    label: 'Coran 4:176',
    translation:
      'Le dernier verset sur l’héritage (kalalah), qui traite d’une personne mourant sans enfant ni père, et des parts d’une sœur ou d’un frère dans ce cas.',
    note: 'Base principale des parts fixes des frères et sœurs germains et consanguins.',
  },
  'bukhari-6732': {
    label: 'Sahih al-Bukhari 6732',
    translation:
      'Le Prophète (paix sur lui) a dit : « Donnez les parts d’héritage à ceux qui y ont droit, et ce qui reste revient au parent mâle le plus proche du défunt. »',
    note: 'Base principale de la chaîne des héritiers résiduaires (asabah) et de son ordre.',
  },
});
