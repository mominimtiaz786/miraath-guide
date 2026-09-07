import { EN_EXPLANATIONS } from './en.explanations';

export const FR_EXPLANATIONS = {
  ...EN_EXPLANATIONS,
  'sonsSon.residuary': {
    simple: 'Le ou les fils du fils reçoivent le reliquat, avec les filles du fils éventuelles selon un rapport de 2:1.',
    detailed: 'En l’absence de fils, un fils du fils est résiduaire à la place du fils, partageant le reliquat avec les filles du fils présentes selon un rapport de 2:1.',
    sourceRefs: ['bukhari-6732'],
  },
  'blocked.sonsDaughterByDaughters': {
    simple: 'La ou les filles du fils n’héritent pas car deux filles ou plus prennent déjà la totalité du pool de 2/3.',
    detailed: 'Deux filles ou plus se partageant déjà les 2/3 coraniques, il ne reste rien à compléter pour une fille du fils, et aucun fils du fils n’est présent pour la rendre résiduaire.',
    sourceRefs: ['quran-4-11'],
  },
  'blocked.paternalHalfSisterByFullSisters': {
    simple: 'La ou les demi-sœurs consanguines n’héritent pas car deux sœurs germaines ou plus prennent déjà la totalité de la part disponible pour les sœurs.',
    detailed: 'Deux sœurs germaines ou plus se partageant déjà le pool de 2/3 (ou agissant comme asabah ma’a al-ghayr), il ne reste rien pour une demi-sœur consanguine, et aucun demi-frère consanguin n’est présent pour la rendre résiduaire.',
    sourceRefs: ['quran-4-176'],
  },
  'blocked.paternalHalfBrotherByFullBrothers': {
    simple: 'Le ou les demi-frères consanguins n’héritent pas car les frères germains, plus proches par le sang, prennent le reliquat à leur place.',
    detailed: 'Au sein d’un même degré résiduaire, les parents de sang complet excluent toujours ceux de demi-sang - les frères germains excluent entièrement les demi-frères consanguins.',
    sourceRefs: ['bukhari-6732'],
  },
  'blocked.paternalHalfSisterByFullBrothers': {
    simple: 'La ou les demi-sœurs consanguines n’héritent pas car les frères germains absorbent le reliquat aux côtés des sœurs germaines.',
    detailed: 'Les frères germains, plus proches par le sang, excluent entièrement les demi-frères et demi-sœurs consanguins de la chaîne résiduaire.',
    sourceRefs: ['bukhari-6732'],
  },
  'blocked.paternalHalfBrotherByFullSisters': {
    simple: 'Le ou les demi-frères consanguins n’héritent pas car la ou les sœurs germaines absorbent déjà tout le reliquat comme asabah ma’a al-ghayr.',
    detailed: 'Lorsque les sœurs germaines deviennent héritières résiduaires aux côtés d’une descendante, elles prennent tout le reliquat restant et excluent tous les rangs résiduaires inférieurs, y compris les demi-frères consanguins.',
    sourceRefs: ['quran-4-176'],
  },
  'blocked.residueExhausted': {
    simple: 'Ce proche n’hérite pas car les héritiers à part fixe absorbent déjà toute la succession, ne laissant aucun reliquat.',
    detailed: 'Dans ce cas hanafite (de type Mushtaraka), les héritiers à part fixe épuisent exactement la succession : il ne reste aucune part résiduaire et le rang de ce proche n’est jamais atteint.',
    sourceRefs: ['bukhari-6732'],
  },
  'blocked.chainByNearerDegree': {
    simple: 'Ce proche n’hérite pas car un parent plus proche dans la même chaîne de famille élargie prend déjà tout le reliquat.',
    detailed: 'La chaîne résiduaire est strictement ordonnée - un degré plus proche exclut toujours un degré plus éloigné, et au sein d’un même degré le sang complet exclut le demi-sang.',
    sourceRefs: ['bukhari-6732'],
  },
  'son.residuary': {
    simple: 'Le ou les fils reçoivent le reliquat, avec les filles éventuelles selon un rapport de 2:1.',
    detailed: 'Les fils sont toujours héritiers résiduaires. Ils prennent tout le reliquat après paiement des parts fixes, en le partageant avec les filles présentes selon un rapport de 2:1 entre hommes et femmes.',
    sourceRefs: ['quran-4-11', 'bukhari-6732'],
  },
  'daughter.residuaryWithSons': {
    simple: 'La ou les filles reçoivent la moitié de ce que reçoit chaque fils, comme héritières résiduaires aux côtés du ou des fils.',
    detailed: 'En présence d’un fils, les filles ne prennent plus de part fixe ; elles deviennent résiduaires à ses côtés selon un rapport de 2:1 entre hommes et femmes.',
    sourceRefs: ['quran-4-11'],
  },
  'sonsDaughter.residuaryWithSonsSons': {
    simple: 'La ou les filles du fils reçoivent la moitié de ce que reçoit chaque fils du fils, comme héritières résiduaires à leurs côtés.',
    detailed: 'En présence d’un fils du fils, les filles du fils ne prennent plus de part fixe ; elles deviennent résiduaires à ses côtés selon un rapport de 2:1.',
    sourceRefs: ['bukhari-6732'],
  },
  'fullBrother.residuary': {
    simple: 'Le ou les frères germains reçoivent le reliquat, avec les sœurs germaines éventuelles selon un rapport de 2:1.',
    detailed: 'Les frères germains sont héritiers résiduaires dans un cas de kalalah où n’existent ni père ou grand-père ni descendant mâle, partageant le reliquat avec les sœurs germaines présentes selon un rapport de 2:1.',
    sourceRefs: ['bukhari-6732'],
  },
  'paternalHalfBrother.residuary': {
    simple: 'Le ou les demi-frères consanguins reçoivent le reliquat, avec les demi-sœurs consanguines éventuelles selon un rapport de 2:1.',
    detailed: 'En l’absence de frère germain, les demi-frères consanguins sont résiduaires dans un cas de kalalah, partageant le reliquat avec les demi-sœurs consanguines présentes selon un rapport de 2:1.',
    sourceRefs: ['bukhari-6732'],
  },
  'fullNephew.residuary': {
    simple: 'Le ou les fils d’un frère germain reçoivent la totalité du reliquat.',
    detailed: 'En l’absence d’héritier résiduaire plus proche, le ou les fils d’un frère germain prennent tout le reliquat en tant que rang agnat suivant. Aucune femme n’apparaît à ce degré.',
    sourceRefs: ['bukhari-6732'],
  },
  'halfNephew.residuary': {
    simple: 'Le ou les fils d’un demi-frère consanguin reçoivent la totalité du reliquat.',
    detailed: 'En l’absence de fils d’un frère germain, le ou les fils d’un demi-frère consanguin prennent tout le reliquat en tant que rang agnat suivant.',
    sourceRefs: ['bukhari-6732'],
  },
  'fullNephewsSon.residuary': {
    simple: 'Le ou les fils d’un neveu germain reçoivent la totalité du reliquat.',
    detailed: 'En l’absence de neveu plus proche, le ou les fils d’un neveu germain prennent tout le reliquat en tant que rang agnat suivant.',
    sourceRefs: ['bukhari-6732'],
  },
  'halfNephewsSon.residuary': {
    simple: 'Le ou les fils d’un demi-neveu reçoivent la totalité du reliquat.',
    detailed: 'En l’absence de neveu plus proche, le ou les fils d’un demi-neveu prennent tout le reliquat en tant que rang agnat suivant - ce degré prime sur le fils d’un neveu germain.',
    sourceRefs: ['bukhari-6732'],
  },
  'fullUncle.residuary': {
    simple: 'Le ou les oncles paternels germains reçoivent la totalité du reliquat.',
    detailed: 'En l’absence d’agnat plus proche, le ou les oncles paternels germains du défunt prennent tout le reliquat en tant que rang agnat suivant.',
    sourceRefs: ['bukhari-6732'],
  },
  'halfUncle.residuary': {
    simple: 'Le ou les demi-oncles paternels reçoivent la totalité du reliquat.',
    detailed: 'En l’absence d’oncle paternel germain, le ou les demi-oncles paternels du défunt prennent tout le reliquat en tant que rang agnat suivant.',
    sourceRefs: ['bukhari-6732'],
  },
  'fullCousin.residuary': {
    simple: 'Le ou les fils d’un oncle paternel germain reçoivent la totalité du reliquat.',
    detailed: 'En l’absence d’agnat plus proche, le ou les fils de l’oncle paternel germain prennent tout le reliquat en tant que dernier rang agnat modélisé.',
    sourceRefs: ['bukhari-6732'],
  },
  'halfCousin.residuary': {
    simple: 'Le ou les fils d’un demi-oncle paternel reçoivent la totalité du reliquat.',
    detailed: 'En l’absence de fils d’un oncle paternel germain, le ou les fils du demi-oncle paternel prennent tout le reliquat en tant que dernier rang agnat modélisé.',
    sourceRefs: ['bukhari-6732'],
  },
  'sonsDaughter.single': {
    simple: 'La fille du fils prend la règle de la fille et reçoit la moitié, puisqu’il n’y a ni fille, ni fils, ni fils du fils.',
    detailed: 'En l’absence de fille, une seule fille du fils prend la part fixe de 1/2 de la fille.',
    sourceRefs: ['quran-4-11'],
  },
  'sonsDaughter.multiple': {
    simple: 'Les filles du fils prennent la règle des filles et se partagent deux tiers, puisqu’il n’y a ni fille, ni fils, ni fils du fils.',
    detailed: 'En l’absence de fille, deux filles du fils ou plus prennent la part commune de 2/3 des filles.',
    sourceRefs: ['quran-4-11'],
  },
  'sonsDaughter.completing': {
    simple: 'La ou les filles du fils reçoivent un sixième, complétant les deux tiers aux côtés de l’unique fille.',
    detailed: 'Une fille unique détient déjà 1/2. Faute de fils du fils pour les rendre résiduaires, les filles du fils prennent 1/6, complétant le pool coranique de 2/3 pour les filles en tant que classe.',
    sourceRefs: ['quran-4-11'],
  },
  'fullSister.single': {
    simple: 'L’unique sœur germaine reçoit la moitié, puisqu’il n’y a ni père ou grand-père, ni descendant, ni frère germain.',
    detailed: 'Le Coran 4:176 donne à une sœur germaine unique 1/2 dans un cas de kalalah où n’existent ni père ou grand-père, ni descendant, ni frère germain.',
    sourceRefs: ['quran-4-176'],
  },
  'fullSister.multiple': {
    simple: 'Les sœurs germaines se partagent également deux tiers, puisqu’il n’y a ni père ou grand-père, ni descendant, ni frère germain.',
    detailed: 'Le Coran 4:176 donne à deux sœurs germaines ou plus un pool de 2/3 dans un cas de kalalah où n’existent ni père ou grand-père, ni descendant, ni frère germain.',
    sourceRefs: ['quran-4-176'],
  },
  'fullSister.residuaryWithBrothers': {
    simple: 'La ou les sœurs germaines rejoignent leur(s) frère(s) germain(s) comme héritières résiduaires, recevant la moitié de ce que reçoit chaque frère.',
    detailed: 'Lorsqu’un frère germain est présent, les sœurs germaines ne prennent plus de part fixe ; elles deviennent résiduaires (asabah) à ses côtés, selon un rapport de 2:1 entre hommes et femmes.',
    sourceRefs: ['bukhari-6732'],
  },
  'fullSister.asabahMaaGhayr': {
    simple: 'La ou les sœurs germaines deviennent héritières résiduaires (asabah ma’a al-ghayr) du fait de la ou des filles / filles du fils, et prennent le reste de la succession.',
    detailed: 'En présence d’une descendante recevant sa part fixe et sans frère germain, les sœurs germaines passent d’héritières à part fixe à héritières résiduaires (asabah ma’a al-ghayr) et prennent tout ce qui reste après les parts fixes des descendantes. Cela exclut également tous les rangs résiduaires inférieurs, y compris les demi-frères consanguins.',
    sourceRefs: ['quran-4-176', 'bukhari-6732'],
  },
  'paternalHalfSister.single': {
    simple: 'L’unique demi-sœur consanguine reçoit la moitié, prenant la règle de la sœur germaine puisqu’il n’y a pas de sœur germaine.',
    detailed: 'En l’absence de sœur germaine, une demi-sœur consanguine unique prend la part fixe de 1/2 dans un cas de kalalah admissible.',
    sourceRefs: ['quran-4-176'],
  },
  'paternalHalfSister.multiple': {
    simple: 'Les demi-sœurs consanguines se partagent également deux tiers, prenant la règle des sœurs germaines puisqu’il n’y a pas de sœur germaine.',
    detailed: 'En l’absence de sœur germaine, deux demi-sœurs consanguines ou plus se partagent une part fixe commune de 2/3 dans un cas de kalalah admissible.',
    sourceRefs: ['quran-4-176'],
  },
  'paternalHalfSister.completing': {
    simple: 'La ou les demi-sœurs consanguines reçoivent un sixième, complétant les deux tiers aux côtés de l’unique sœur germaine.',
    detailed: 'Une sœur germaine unique détient déjà 1/2. Faute de demi-frère consanguin pour les rendre résiduaires, les demi-sœurs consanguines prennent 1/6, complétant le pool de 2/3 pour les sœurs en tant que classe.',
    sourceRefs: ['quran-4-176'],
  },
  'paternalHalfSister.residuaryWithHalfBrothers': {
    simple: 'La ou les demi-sœurs consanguines rejoignent leur(s) demi-frère(s) consanguin(s) comme héritières résiduaires, recevant la moitié de ce que reçoit chaque demi-frère.',
    detailed: 'Lorsqu’un demi-frère consanguin est présent, les demi-sœurs consanguines ne prennent plus de part fixe ; elles deviennent résiduaires à ses côtés, selon un rapport de 2:1.',
    sourceRefs: ['bukhari-6732'],
  },
  'maternalSibling.single': {
    simple: 'L’unique frère ou sœur utérin reçoit un sixième (cas de kalalah sans descendant ni père ou grand-père).',
    detailed: 'Le Coran 4:12 donne à un frère ou une sœur utérin unique 1/6 lorsque le défunt ne laisse ni descendant ni père ou grand-père.',
    sourceRefs: ['quran-4-12'],
  },
  'maternalSibling.multiple': {
    simple: 'Les frères et sœurs utérins se partagent également un tiers, quel que soit leur sexe (cas de kalalah sans descendant ni père ou grand-père).',
    detailed: 'Le Coran 4:12 donne à deux frères et sœurs utérins ou plus un pool de 1/3, partagé également entre hommes et femmes - le rapport habituel de 2:1 ne s’applique jamais aux frères et sœurs utérins.',
    sourceRefs: ['quran-4-12'],
  },
  'mother.umariyyatayn': {
    simple: 'Il s’agit d’un cas d’Umariyyatayn : la mère reçoit un tiers de ce qui reste après la part du conjoint, et non un tiers de toute la succession.',
    detailed: 'Avec un conjoint et les deux parents présents, sans descendants et avec moins de deux frères et sœurs, la position hanafite (Umariyyatayn) donne à la mère 1/3 du reliquat après la part du conjoint, afin que sa part ne dépasse pas celle du père.',
    sourceRefs: ['quran-4-11'],
  },
  'father.umariyyatayn': {
    simple: 'Le père reçoit le reste de la succession en tant qu’héritier résiduaire, après les parts du conjoint et de la mère.',
    detailed: 'Dans ce cas d’Umariyyatayn, le père prend tout ce qui reste une fois mises de côté la part du conjoint et la part recalculée de la mère (1/3 du reliquat).',
    sourceRefs: ['quran-4-11'],
  },
  'grandmother.pool': {
    simple: 'La ou les grands-mères admissibles se partagent également un sixième, puisque la mère n’est plus en vie.',
    detailed: 'Une grand-mère prend le 1/6 de la mère par analogie lorsque celle-ci est décédée, comme l’établit le hadith. Si deux grands-mères admissibles du même degré sont présentes, elles se partagent ce 1/6 à parts égales.',
    sourceRefs: ['bukhari-6732'],
  },
  'father.fixed': {
    simple: 'Le père reçoit un sixième parce que le défunt a laissé un descendant mâle.',
    detailed: 'Le Coran 4:11 fixe la part du père à 1/6 dès qu’un fils ou un fils du fils survit au défunt.',
    sourceRefs: ['quran-4-11'],
  },
  'grandfather.fixed': {
    simple: 'Le grand-père paternel reçoit un sixième, prenant la place du père puisque celui-ci est décédé.',
    detailed: 'Le grand-père paternel prend la part fixe de 1/6 du père dès qu’un fils ou un fils du fils survit, le père n’étant plus en vie.',
    sourceRefs: ['quran-4-11'],
  },
  'father.residue': {
    simple: 'Le père reçoit le reste de la succession en tant qu’héritier résiduaire.',
    detailed: 'En l’absence de descendant mâle, le père prend ce qui reste après les autres parts fixes (son 1/6 le cas échéant, plus le reliquat) en tant que parent agnat le plus proche.',
    sourceRefs: ['bukhari-6732'],
  },
  'grandfather.residue': {
    simple: 'Le grand-père paternel reçoit le reste de la succession en tant qu’héritier résiduaire, prenant la place du père.',
    detailed: 'En l’absence de descendant mâle et le père étant décédé, le grand-père paternel prend ce qui reste en tant que parent agnat le plus proche.',
    sourceRefs: ['bukhari-6732'],
  },
  'father.fixedPlusResidue': {
    simple: 'Le père reçoit un sixième en part fixe, plus le reste de la succession en tant qu’héritier résiduaire.',
    detailed: 'En présence d’une descendante mais sans descendant mâle, le père prend son 1/6 fixe (Coran 4:11) et, aucun héritier résiduaire plus proche n’existant, il prend aussi le reliquat.',
    sourceRefs: ['quran-4-11', 'bukhari-6732'],
  },
  'paternalGrandfather.fixedPlusResidue': {
    simple: 'Le grand-père paternel reçoit un sixième en part fixe, plus le reste de la succession en tant qu’héritier résiduaire, prenant la place du père.',
    detailed: 'En présence d’une descendante mais sans descendant mâle, et le père étant décédé, le grand-père paternel prend le 1/6 fixe du père ainsi que le reliquat.',
    sourceRefs: ['quran-4-11', 'bukhari-6732'],
  },
  'blocked.grandfatherByFather': {
    simple: 'Le grand-père paternel n’hérite pas et n’a pas été demandé, car le père est vivant.',
    detailed: 'Un père vivant est toujours plus proche que le grand-père paternel, celui-ci est donc entièrement exclu et l’assistant ignore la question.',
    sourceRefs: ['quran-4-11'],
  },
  'blocked.grandmotherByMother': {
    simple: 'Les grands-mères n’héritent pas et n’ont pas été demandées, car la mère est vivante.',
    detailed: 'Une mère vivante exclut toutes les grands-mères de l’héritage, l’assistant ignore donc totalement la question.',
    sourceRefs: ['bukhari-6732'],
  },
  'blocked.siblingsByFatherFigure': {
    simple: 'Tous les frères et sœurs sont exclus de l’héritage par le père ou le grand-père paternel.',
    detailed: 'La position hanafite retient qu’un père vivant (ou, à défaut, le grand-père paternel) exclut tous les frères et sœurs - germains, consanguins et utérins - ainsi que tous ceux placés en dessous d’eux dans la chaîne résiduaire.',
    sourceRefs: ['quran-4-11'],
  },
  'blocked.siblingsByMaleDescendant': {
    simple: 'Tous les frères et sœurs sont exclus de l’héritage par un descendant mâle du défunt.',
    detailed: 'Un fils ou un fils du fils exclut de l’héritage tous les frères et sœurs - germains, consanguins et utérins.',
    sourceRefs: ['quran-4-11'],
  },
  'blocked.extendedByCloserHeir': {
    simple: 'Les parents paternels éloignés n’ont pas été demandés car un héritier plus proche existe déjà dans ce cas.',
    detailed: 'Les neveux, oncles et cousins ne deviennent pertinents qu’une fois confirmée l’absence de tout héritier résiduaire plus proche - descendants, père ou grand-père, et rangs de la fratrie.',
    sourceRefs: ['bukhari-6732'],
  },
  'husband.withDescendant': { simple: 'Le mari reçoit un quart car la défunte laisse des descendants.', detailed: 'Le Coran 4:12 fixe la part du mari à 1/4 lorsqu’il existe des descendants.', sourceRefs: ['quran-4-12'] },
  'husband.noDescendant': { simple: 'Le mari reçoit la moitié car la défunte ne laisse pas de descendants.', detailed: 'Le Coran 4:12 fixe la part du mari à 1/2 en l’absence de descendants.', sourceRefs: ['quran-4-12'] },
  'wife.withDescendant': { simple: 'L’épouse ou les épouses partagent un huitième car des descendants existent.', detailed: 'Le Coran 4:12 fixe leur part commune à 1/8 avec descendants.', sourceRefs: ['quran-4-12'] },
  'wife.noDescendant': { simple: 'L’épouse ou les épouses partagent un quart car il n’y a pas de descendants.', detailed: 'Le Coran 4:12 fixe leur part commune à 1/4 sans descendants.', sourceRefs: ['quran-4-12'] },
  'mother.reduced': { simple: 'La mère reçoit un sixième en présence de descendants ou de deux frères/soeurs ou plus.', detailed: 'Le Coran 4:11 réduit la part de la mère de 1/3 à 1/6 dans cette situation.', sourceRefs: ['quran-4-11'] },
  'mother.full': { simple: 'La mère reçoit un tiers car il n’y a pas de descendants et moins de deux frères/soeurs.', detailed: 'Le Coran 4:11 donne alors 1/3 à la mère.', sourceRefs: ['quran-4-11'] },
  'daughter.single': { simple: 'La fille unique reçoit la moitié car aucun fils n’est présent.', detailed: 'Le Coran 4:11 donne 1/2 à une fille unique sans fils.', sourceRefs: ['quran-4-11'] },
  'daughter.multiple': { simple: 'Les filles partagent deux tiers en l’absence de fils.', detailed: 'Le Coran 4:11 donne un pool de 2/3 à deux filles ou plus sans fils.', sourceRefs: ['quran-4-11'] },
};
