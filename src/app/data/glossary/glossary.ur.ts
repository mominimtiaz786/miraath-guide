import { localizeGlossary } from '../content-localization.util';
import { GLOSSARY_TERMS } from './glossary.data';

export const UR_GLOSSARY_TERMS = localizeGlossary(GLOSSARY_TERMS, {
  faraid: { term: 'فرائض', romanUrdu: 'Faraid', definition: 'اسلامی وراثت کا علم، یعنی مقرر قرآنی حصے اور ترکہ تقسیم کرنے کے قواعد۔' },
  mirath: { term: 'میراث', romanUrdu: 'Mirath', definition: 'وہ ترکہ جو جنازہ، قرض اور درست وصیت کے بعد تقسیم کے لیے باقی رہے۔' },
  'ashab-al-furud': { term: 'اصحاب الفروض', romanUrdu: 'Ashab-ul-Furooz', definition: 'وہ ورثاء جن کے لیے مقرر حصے ہیں، جیسے شریک حیات، والدہ اور بیٹیاں۔' },
  asabah: { term: 'عصبہ', romanUrdu: 'Asabah', definition: 'وہ ورثاء جو مقرر حصوں کے بعد بچا ہوا ترکہ لیتے ہیں۔' },
  hajb: { term: 'حجب', romanUrdu: 'Hajb', definition: 'قریبی وارث کی موجودگی سے کسی وارث کا حصہ کم یا ختم ہونا۔' },
  kalalah: { term: 'کلالہ', romanUrdu: 'Kalalah', definition: 'ایسی صورت جس میں متوفی نہ اولاد چھوڑے نہ والد یا دادا۔' },
  awl: { term: 'عول', romanUrdu: 'Awl', definition: 'جب مقرر حصے کل ترکہ سے بڑھ جائیں تو سب حصوں کو ایک نسبت سے کم کرنا۔' },
  radd: { term: 'رد', romanUrdu: 'Radd', definition: 'جب کوئی عصبہ نہ ہو تو بچا ہوا حصہ اہل مقرر ورثاء کو واپس کرنا۔' },
  umariyyatayn: { term: 'عمریاتین', romanUrdu: 'Umariyyatayn', definition: 'وہ دو صورتیں جن میں والدہ کا تہائی شریک حیات کے حصے کے بعد باقی سے لیا جاتا ہے۔' },
  'dhawil-al-arham': { term: 'ذوی الارحام', romanUrdu: 'Zawil Arham', definition: 'دور کے رشتہ دار جو نہ اصحاب الفروض ہیں نہ عصبہ؛ یہ MVP انہیں تقسیم نہیں کرتا۔' },
  wasiyyah: { term: 'وصیت', romanUrdu: 'Wasiyyah', definition: 'غیر وارث کے لیے ایک تہائی تک درست وصیت، جو فرائض سے پہلے ادا ہوتی ہے۔' },
  'asabah-maa-al-ghayr': { term: 'عصبہ مع الغیر', romanUrdu: "Asabah ma'a al-ghayr", definition: 'وہ بہن جو بیٹی یا پوتی کی موجودگی سے باقی ترکہ لینے والی عصبہ بن جائے۔' },
});
