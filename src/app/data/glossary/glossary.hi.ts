import { localizeGlossary } from '../content-localization.util';
import { GLOSSARY_TERMS } from './glossary.data';

export const HI_GLOSSARY_TERMS = localizeGlossary(GLOSSARY_TERMS, {
  faraid: { term: 'Faraid', romanUrdu: 'Faraid', definition: 'इस्लामी विरासत का विज्ञान: कुरआनी निश्चित हिस्से और estate distribution के नियम।' },
  mirath: { term: 'Mirath', romanUrdu: 'Mirath', definition: 'वह संपत्ति जो खर्च, ऋण और वैध wasiyyah के बाद वितरण के लिए बचे।' },
  'ashab-al-furud': { term: 'Ashab al-Furud', romanUrdu: 'Ashab-ul-Furooz', definition: 'वे वारिस जिनके हिस्से निश्चित हैं, जैसे spouse, मां और बेटियाँ।' },
  asabah: { term: 'Asabah', romanUrdu: 'Asabah', definition: 'वे residuary heirs जो fixed shares के बाद बचा हिस्सा लेते हैं।' },
  hajb: { term: 'Hajb', romanUrdu: 'Hajb', definition: 'निकट रिश्तेदार की मौजूदगी से किसी वारिस का हिस्सा कम या समाप्त होना।' },
  kalalah: { term: 'Kalalah', romanUrdu: 'Kalalah', definition: 'ऐसा मामला जिसमें मृत व्यक्ति न descendant छोड़े न पिता या पैतृक दादा।' },
  awl: { term: 'Awl', romanUrdu: 'Awl', definition: 'जब fixed shares estate से अधिक हों तो सभी हिस्सों को proportional घटाना।' },
  radd: { term: 'Radd', romanUrdu: 'Radd', definition: 'कोई Asabah न हो तो surplus को पात्र fixed-share heirs को लौटाना।' },
  umariyyatayn: { term: 'Umariyyatayn', romanUrdu: 'Umariyyatayn', definition: 'दो प्रसिद्ध मामले जहाँ मां का एक-तिहाई spouse के हिस्से के बाद बचे से लिया जाता है।' },
  'dhawil-al-arham': { term: 'Dhawil al-Arham', romanUrdu: 'Zawil Arham', definition: 'दूर के रिश्तेदार जो fixed-share heir या Asabah नहीं; यह MVP उन्हें distribute नहीं करता।' },
  wasiyyah: { term: 'Wasiyyah', romanUrdu: 'Wasiyyah', definition: 'गैर-वारिस के लिए एक-तिहाई तक वैध bequest, जो वितरण से पहले निपटाई जाती है।' },
  'asabah-maa-al-ghayr': { term: "Asabah ma'a al-ghayr", romanUrdu: "Asabah ma'a al-ghayr", definition: 'वह बहन जो बेटी या बेटे की बेटी की मौजूदगी से residuary बन जाती है।' },
});
