import { EN_EXPLANATIONS } from './en.explanations';

export const HI_EXPLANATIONS = {
  ...EN_EXPLANATIONS,
  'husband.withDescendant': { simple: 'पति को 1/4 मिलता है क्योंकि मृत पत्नी ने descendants छोड़े हैं।', detailed: 'कुरआन 4:12 में descendants होने पर पति का हिस्सा 1/4 है।', sourceRefs: ['quran-4-12'] },
  'husband.noDescendant': { simple: 'पति को 1/2 मिलता है क्योंकि कोई descendants नहीं हैं।', detailed: 'कुरआन 4:12 में descendants न हों तो पति का हिस्सा 1/2 है।', sourceRefs: ['quran-4-12'] },
  'wife.withDescendant': { simple: 'पत्नी या पत्नियाँ 1/8 साझा करती हैं क्योंकि descendants मौजूद हैं।', detailed: 'कुरआन 4:12 descendants होने पर पत्नी/पत्नियों का pooled share 1/8 बताता है।', sourceRefs: ['quran-4-12'] },
  'wife.noDescendant': { simple: 'पत्नी या पत्नियाँ 1/4 साझा करती हैं क्योंकि descendants नहीं हैं।', detailed: 'कुरआन 4:12 descendants न हों तो पत्नी/पत्नियों का pooled share 1/4 बताता है।', sourceRefs: ['quran-4-12'] },
  'mother.reduced': { simple: 'मां को 1/6 मिलता है क्योंकि descendant या दो या अधिक siblings मौजूद हैं।', detailed: 'कुरआन 4:11 इस स्थिति में मां का हिस्सा 1/3 से 1/6 करता है।', sourceRefs: ['quran-4-11'] },
  'mother.full': { simple: 'मां को 1/3 मिलता है क्योंकि descendants नहीं और siblings दो से कम हैं।', detailed: 'कुरआन 4:11 ऐसी स्थिति में मां के लिए 1/3 बताता है।', sourceRefs: ['quran-4-11'] },
  'daughter.single': { simple: 'एक बेटी को 1/2 मिलता है क्योंकि बेटा नहीं है।', detailed: 'कुरआन 4:11 एक बेटी के लिए बेटे के बिना 1/2 निर्धारित करता है।', sourceRefs: ['quran-4-11'] },
  'daughter.multiple': { simple: 'बेटियाँ बेटे के बिना 2/3 साझा करती हैं।', detailed: 'कुरआन 4:11 दो या अधिक बेटियों के लिए pooled 2/3 बताता है।', sourceRefs: ['quran-4-11'] },
};
