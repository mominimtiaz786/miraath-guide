import { EN_EXPLANATIONS } from './en.explanations';

export const AR_EXPLANATIONS = {
  ...EN_EXPLANATIONS,
  'husband.withDescendant': { simple: 'للزوج الربع لأن المتوفاة تركت فرعا وارثا.', detailed: 'يبين القرآن 4:12 أن للزوج الربع عند وجود ولد أو ولد ابن.', sourceRefs: ['quran-4-12'] },
  'husband.noDescendant': { simple: 'للزوج النصف لأن المتوفاة لم تترك فرعا وارثا.', detailed: 'يبين القرآن 4:12 أن للزوج النصف عند عدم الفرع الوارث.', sourceRefs: ['quran-4-12'] },
  'wife.withDescendant': { simple: 'للزوجة أو الزوجات الثمن مشتركا لوجود الفرع الوارث.', detailed: 'يبين القرآن 4:12 أن نصيب الزوجة أو الزوجات الثمن عند وجود الفرع الوارث.', sourceRefs: ['quran-4-12'] },
  'wife.noDescendant': { simple: 'للزوجة أو الزوجات الربع مشتركا عند عدم الفرع الوارث.', detailed: 'يبين القرآن 4:12 أن نصيب الزوجة أو الزوجات الربع عند عدم الفرع الوارث.', sourceRefs: ['quran-4-12'] },
  'mother.reduced': { simple: 'للأم السدس لوجود فرع وارث أو اثنين فأكثر من الإخوة.', detailed: 'ينقص القرآن 4:11 نصيب الأم من الثلث إلى السدس في هذه الحالة.', sourceRefs: ['quran-4-11'] },
  'mother.full': { simple: 'للأم الثلث عند عدم الفرع الوارث وأقل من اثنين من الإخوة.', detailed: 'يبين القرآن 4:11 أن للأم الثلث في هذه الحالة.', sourceRefs: ['quran-4-11'] },
  'daughter.single': { simple: 'للبنت الواحدة النصف عند عدم الابن.', detailed: 'يعطي القرآن 4:11 البنت الواحدة النصف إذا لم يوجد ابن.', sourceRefs: ['quran-4-11'] },
  'daughter.multiple': { simple: 'للبنات الثلثان مشتركا عند عدم الابن.', detailed: 'يعطي القرآن 4:11 للبنتين فأكثر الثلثين عند عدم الابن.', sourceRefs: ['quran-4-11'] },
};
