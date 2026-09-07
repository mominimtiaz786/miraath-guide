import { localizeGlossary } from '../content-localization.util';
import { GLOSSARY_TERMS } from './glossary.data';

export const AR_GLOSSARY_TERMS = localizeGlossary(GLOSSARY_TERMS, {
  faraid: { term: 'الفرائض', romanUrdu: 'Faraid', definition: 'علم الميراث الإسلامي: الأنصبة المقدرة في القرآن والقواعد المنظمة لتوزيع التركة.' },
  mirath: { term: 'الميراث', romanUrdu: 'Mirath', definition: 'التركة التي تبقى للتوزيع بعد المصاريف والديون والوصية الصحيحة.' },
  'ashab-al-furud': { term: 'أصحاب الفروض', romanUrdu: 'Ashab-ul-Furooz', definition: 'ورثة لهم أنصبة مقدرة، مثل الزوج أو الزوجة والأم والبنات.' },
  asabah: { term: 'العصبة', romanUrdu: 'Asabah', definition: 'ورثة يأخذون ما بقي من التركة بعد أصحاب الفروض.' },
  hajb: { term: 'الحجب', romanUrdu: 'Hajb', definition: 'منع الوارث أو إنقاص نصيبه بسبب وجود قريب أقرب أو سبب معتبر.' },
  kalalah: { term: 'الكلالة', romanUrdu: 'Kalalah', definition: 'حالة لا يترك فيها المتوفى فرعا وارثا ولا أبا أو جدا لأب.' },
  awl: { term: 'العول', romanUrdu: 'Awl', definition: 'نقصان الفروض بنسبة واحدة عندما يزيد مجموعها على التركة.' },
  radd: { term: 'الرد', romanUrdu: 'Radd', definition: 'إرجاع الفائض إلى أصحاب الفروض المستحقين عند عدم وجود عصبة.' },
  umariyyatayn: { term: 'العمريتان', romanUrdu: 'Umariyyatayn', definition: 'مسألتان تأخذ فيهما الأم ثلث الباقي بعد نصيب الزوج أو الزوجة.' },
  'dhawil-al-arham': { term: 'ذوو الأرحام', romanUrdu: 'Zawil Arham', definition: 'أقارب بعيدون ليسوا أصحاب فروض ولا عصبة؛ لا يوزع عليهم هذا النموذج.' },
  wasiyyah: { term: 'الوصية', romanUrdu: 'Wasiyyah', definition: 'وصية صحيحة لغير وارث في حدود الثلث، تنفذ قبل قسمة الفرائض.' },
  'asabah-maa-al-ghayr': { term: 'العصبة مع الغير', romanUrdu: "Asabah ma'a al-ghayr", definition: 'أخت تصير عصبة بسبب وجود بنت أو بنت ابن، فتأخذ الباقي.' },
});
