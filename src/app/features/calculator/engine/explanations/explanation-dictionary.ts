export interface ExplanationDictionaryEntry {
  simple: string;
  detailed: string;
  sourceRefs: string[];
}

/**
 * Every reasonCode produced by the fixed-share, asabah, and blocking
 * engines resolves to an entry here. Keyed strings (rather than inline
 * literals in the engine) keep this MVP ready for future localization.
 */
export const EXPLANATION_DICTIONARY: Record<string, ExplanationDictionaryEntry> = {
  // Spouse
  'husband.withDescendant': {
    simple: 'The husband receives one-quarter because the deceased left descendants.',
    detailed: "Qur'an 4:12 fixes the husband's share at 1/4 when the wife leaves children or son's descendants, and 1/2 otherwise.",
    sourceRefs: ['quran-4-12'],
  },
  'husband.noDescendant': {
    simple: 'The husband receives one-half because the deceased left no descendants.',
    detailed: "Qur'an 4:12 fixes the husband's share at 1/2 when the wife leaves no children or son's descendants.",
    sourceRefs: ['quran-4-12'],
  },
  'wife.withDescendant': {
    simple: 'The wife (or wives, sharing equally) receives one-eighth because the deceased left descendants.',
    detailed: "Qur'an 4:12 fixes the wife/wives' pooled share at 1/8 when the husband leaves children or son's descendants, and 1/4 otherwise. Up to four wives share this pool equally.",
    sourceRefs: ['quran-4-12'],
  },
  'wife.noDescendant': {
    simple: 'The wife (or wives, sharing equally) receives one-quarter because the deceased left no descendants.',
    detailed: "Qur'an 4:12 fixes the wife/wives' pooled share at 1/4 when the husband leaves no children or son's descendants. Up to four wives share this pool equally.",
    sourceRefs: ['quran-4-12'],
  },

  // Umariyyatayn
  'mother.umariyyatayn': {
    simple: "This is an Umariyyatayn case: the mother receives one-third of what remains after the spouse's share, not one-third of the whole estate.",
    detailed:
      'With a spouse and both parents present, no descendants, and fewer than two siblings, the Hanafi position (Umariyyatayn) gives the mother 1/3 of the remainder after the spouse takes their share, so that her share does not overtake the father\'s.',
    sourceRefs: ['quran-4-11'],
  },
  'father.umariyyatayn': {
    simple: "The father receives the rest of the estate as the residuary heir, after the spouse and mother's shares.",
    detailed: 'In this Umariyyatayn case the father takes whatever remains once the spouse and the mother\'s recalculated 1/3-of-the-remainder share are set aside.',
    sourceRefs: ['quran-4-11'],
  },

  // Mother / grandmother
  'mother.reduced': {
    simple: 'The mother receives one-sixth because the deceased left descendants, or two or more siblings (even if those siblings do not inherit themselves).',
    detailed:
      "Qur'an 4:11 reduces the mother's share from 1/3 to 1/6 when the deceased leaves a child, a son's child, or two or more siblings of any kind - siblings count toward this rule even when a father figure blocks them from inheriting.",
    sourceRefs: ['quran-4-11'],
  },
  'mother.full': {
    simple: 'The mother receives one-third because the deceased left no descendants and fewer than two siblings.',
    detailed: "Qur'an 4:11 gives the mother 1/3 when there is no child, no son's child, and fewer than two siblings of any kind.",
    sourceRefs: ['quran-4-11'],
  },
  'grandmother.pool': {
    simple: 'The eligible grandmother(s) share one-sixth equally, since the mother is no longer alive.',
    detailed:
      "A grandmother takes the mother's 1/6 by analogy when the mother is deceased, as established in hadith. Where two eligible grandmothers of the same degree are present, they share the 1/6 pool equally.",
    sourceRefs: ['bukhari-6732'],
  },

  // Father / grandfather
  'father.fixed': {
    simple: 'The father receives one-sixth because the deceased left a male descendant.',
    detailed: "Qur'an 4:11 fixes the father's share at 1/6 whenever a son or son's son survives the deceased.",
    sourceRefs: ['quran-4-11'],
  },
  'grandfather.fixed': {
    simple: "The paternal grandfather receives one-sixth, standing in the father's place because the father is deceased.",
    detailed: "The paternal grandfather takes the father's 1/6 fixed share whenever a son or son's son survives, since the father is no longer alive.",
    sourceRefs: ['quran-4-11'],
  },
  'father.residue': {
    simple: 'The father receives the remaining estate as the residuary heir.',
    detailed: 'With no male descendant present, the father takes what remains after other fixed-share heirs (his fixed 1/6, if any, plus the residue) as the nearest agnate relative.',
    sourceRefs: ['bukhari-6732'],
  },
  'grandfather.residue': {
    simple: "The paternal grandfather receives the remaining estate as the residuary heir, standing in the father's place.",
    detailed: 'With no male descendant present and the father deceased, the paternal grandfather takes what remains as the nearest agnate relative.',
    sourceRefs: ['bukhari-6732'],
  },
  'father.fixedPlusResidue': {
    simple: 'The father receives one-sixth as a fixed share, plus the remaining estate as the residuary heir.',
    detailed: "With a female descendant present but no male descendant, the father takes his fixed 1/6 (Qur'an 4:11) and, since no nearer residuary heir exists, also takes whatever residue remains.",
    sourceRefs: ['quran-4-11', 'bukhari-6732'],
  },
  'paternalGrandfather.fixedPlusResidue': {
    simple: "The paternal grandfather receives one-sixth as a fixed share, plus the remaining estate as the residuary heir, standing in the father's place.",
    detailed: "With a female descendant present but no male descendant, and the father deceased, the paternal grandfather takes the father's fixed 1/6 and also whatever residue remains.",
    sourceRefs: ['quran-4-11', 'bukhari-6732'],
  },

  // Daughters / son's daughters
  'daughter.single': {
    simple: 'The one daughter receives one-half because there is no son.',
    detailed: "Qur'an 4:11 gives a single daughter 1/2 of the estate when there is no son to make her residuary.",
    sourceRefs: ['quran-4-11'],
  },
  'daughter.multiple': {
    simple: 'The daughters share two-thirds equally because there is no son.',
    detailed: "Qur'an 4:11 gives two or more daughters a pooled 2/3 of the estate, shared equally, when there is no son.",
    sourceRefs: ['quran-4-11'],
  },
  'sonsDaughter.single': {
    simple: "The son's daughter takes the daughter's rule and receives one-half, since there is no daughter, son, or son's son.",
    detailed: "With no daughter present, a single son's daughter steps into the daughter's 1/2 fixed share.",
    sourceRefs: ['quran-4-11'],
  },
  'sonsDaughter.multiple': {
    simple: "The son's daughters take the daughters' rule and share two-thirds, since there is no daughter, son, or son's son.",
    detailed: "With no daughter present, two or more son's daughters step into the daughters' pooled 2/3 fixed share.",
    sourceRefs: ['quran-4-11'],
  },
  'sonsDaughter.completing': {
    simple: "The son's daughter(s) receive one-sixth, completing the two-thirds alongside the one daughter.",
    detailed:
      "A single daughter already holds 1/2. Because there is no son's son to make them residuary, the son's daughter(s) take 1/6, completing the Qur'anic 2/3 pool for daughters as a class.",
    sourceRefs: ['quran-4-11'],
  },

  // Full sisters
  'fullSister.single': {
    simple: 'The one full sister receives one-half, since there is no father figure, descendant, or full brother.',
    detailed: "Qur'an 4:176 gives a single full sister 1/2 in a kalalah case where no father figure, descendant, or full brother exists.",
    sourceRefs: ['quran-4-176'],
  },
  'fullSister.multiple': {
    simple: 'The full sisters share two-thirds equally, since there is no father figure, descendant, or full brother.',
    detailed: "Qur'an 4:176 gives two or more full sisters a pooled 2/3 in a kalalah case where no father figure, descendant, or full brother exists.",
    sourceRefs: ['quran-4-176'],
  },
  'fullSister.residuaryWithBrothers': {
    simple: "The full sister(s) join their full brother(s) as residuary heirs, receiving half of what each brother receives.",
    detailed: "When a full brother is present, full sisters no longer take a fixed share; instead they become residuary (asabah) alongside him, at a 2:1 male-to-female ratio.",
    sourceRefs: ['bukhari-6732'],
  },
  'fullSister.asabahMaaGhayr': {
    simple: "The full sister(s) become residuary heirs (asabah ma'a al-ghayr) because of the daughter(s)/son's daughter(s), and take the remaining estate.",
    detailed:
      "With a female descendant present, a female descendant's fixed share and no full brother, full sisters convert from fixed-share heirs into residuary heirs (asabah ma'a al-ghayr) and take whatever remains after the female descendants' fixed shares. This also blocks every lower residuary tier, including paternal half-brothers.",
    sourceRefs: ['quran-4-176', 'bukhari-6732'],
  },

  // Paternal half-sisters
  'paternalHalfSister.single': {
    simple: 'The one paternal half-sister receives one-half, taking the full sister\'s rule since there is no full sister.',
    detailed: "With no full sister present, a single paternal half-sister takes the 1/2 fixed share in a qualifying kalalah case.",
    sourceRefs: ['quran-4-176'],
  },
  'paternalHalfSister.multiple': {
    simple: 'The paternal half-sisters share two-thirds equally, taking the full sisters\' rule since there is no full sister.',
    detailed: "With no full sister present, two or more paternal half-sisters share a pooled 2/3 fixed share in a qualifying kalalah case.",
    sourceRefs: ['quran-4-176'],
  },
  'paternalHalfSister.completing': {
    simple: 'The paternal half-sister(s) receive one-sixth, completing the two-thirds alongside the one full sister.',
    detailed: "A single full sister already holds 1/2. With no paternal half-brother to make them residuary, the paternal half-sister(s) take 1/6, completing the 2/3 pool for the sisters as a class.",
    sourceRefs: ['quran-4-176'],
  },
  'paternalHalfSister.residuaryWithHalfBrothers': {
    simple: 'The paternal half-sister(s) join their paternal half-brother(s) as residuary heirs, receiving half of what each half-brother receives.',
    detailed: "When a paternal half-brother is present, paternal half-sisters no longer take a fixed share; instead they become residuary alongside him, at a 2:1 male-to-female ratio.",
    sourceRefs: ['bukhari-6732'],
  },

  // Maternal siblings
  'maternalSibling.single': {
    simple: 'The one maternal sibling receives one-sixth (a kalalah case with no descendant and no father figure).',
    detailed: "Qur'an 4:12 gives a single maternal sibling 1/6 when the deceased leaves no descendant and no father figure.",
    sourceRefs: ['quran-4-12'],
  },
  'maternalSibling.multiple': {
    simple: 'The maternal siblings share one-third equally regardless of gender (a kalalah case with no descendant and no father figure).',
    detailed:
      "Qur'an 4:12 gives two or more maternal siblings a pooled 1/3, shared equally between males and females - the usual 2:1 ratio never applies to maternal siblings.",
    sourceRefs: ['quran-4-12'],
  },

  // Residuary descendants
  'son.residuary': {
    simple: 'The son(s) receive the residue, together with any daughters at a 2:1 ratio.',
    detailed: "Sons are always residuary heirs. They take the entire residue after fixed shares are paid, sharing it with any daughters present at a 2:1 male-to-female ratio.",
    sourceRefs: ['quran-4-11', 'bukhari-6732'],
  },
  'daughter.residuaryWithSons': {
    simple: 'The daughter(s) receive half of what each son receives, as residuary heirs alongside the son(s).',
    detailed: "With a son present, daughters no longer take a fixed share; they become residuary alongside him at a 2:1 male-to-female ratio.",
    sourceRefs: ['quran-4-11'],
  },
  "sonsSon.residuary": {
    simple: "The son's son(s) receive the residue, together with any son's daughters at a 2:1 ratio.",
    detailed: "With no son present, a son's son is residuary in the son's place, sharing the residue with any son's daughters at a 2:1 ratio.",
    sourceRefs: ['bukhari-6732'],
  },
  'sonsDaughter.residuaryWithSonsSons': {
    simple: "The son's daughter(s) receive half of what each son's son receives, as residuary heirs alongside them.",
    detailed: "With a son's son present, son's daughters no longer take a fixed share; they become residuary alongside him at a 2:1 male-to-female ratio.",
    sourceRefs: ['bukhari-6732'],
  },

  // Residuary siblings
  'fullBrother.residuary': {
    simple: 'The full brother(s) receive the residue, together with any full sisters at a 2:1 ratio.',
    detailed: "Full brothers are residuary heirs in a kalalah case where no father figure or male descendant exists, sharing the residue with any full sisters at a 2:1 ratio.",
    sourceRefs: ['bukhari-6732'],
  },
  'paternalHalfBrother.residuary': {
    simple: 'The paternal half-brother(s) receive the residue, together with any paternal half-sisters at a 2:1 ratio.',
    detailed: "With no full brother present, paternal half-brothers are residuary in a kalalah case, sharing the residue with any paternal half-sisters at a 2:1 ratio.",
    sourceRefs: ['bukhari-6732'],
  },
  'fullNephew.residuary': {
    simple: "The full brother's son(s) receive the entire residue.",
    detailed: "With no nearer residuary heir present, a full brother's son(s) take the entire residue as the next agnate tier. Females do not appear at this degree.",
    sourceRefs: ['bukhari-6732'],
  },
  'halfNephew.residuary': {
    simple: "The paternal half-brother's son(s) receive the entire residue.",
    detailed: "With no full brother's son present, a paternal half-brother's son(s) take the entire residue as the next agnate tier.",
    sourceRefs: ['bukhari-6732'],
  },
  'fullNephewsSon.residuary': {
    simple: "The full nephew's son(s) receive the entire residue.",
    detailed: "With no nearer nephew present, the full nephew's son(s) take the entire residue as the next agnate tier.",
    sourceRefs: ['bukhari-6732'],
  },
  'halfNephewsSon.residuary': {
    simple: "The half nephew's son(s) receive the entire residue.",
    detailed: "With no nearer nephew present, the half nephew's son(s) take the entire residue as the next agnate tier - this degree outranks a full nephew's son.",
    sourceRefs: ['bukhari-6732'],
  },
  'fullUncle.residuary': {
    simple: 'The full paternal uncle(s) receive the entire residue.',
    detailed: "With no nearer agnate present, the deceased's full paternal uncle(s) take the entire residue as the next agnate tier.",
    sourceRefs: ['bukhari-6732'],
  },
  'halfUncle.residuary': {
    simple: 'The paternal half-uncle(s) receive the entire residue.',
    detailed: "With no full paternal uncle present, the deceased's paternal half-uncle(s) take the entire residue as the next agnate tier.",
    sourceRefs: ['bukhari-6732'],
  },
  'fullCousin.residuary': {
    simple: "The full uncle's son(s) receive the entire residue.",
    detailed: "With no nearer agnate present, the full paternal uncle's son(s) take the entire residue as the final modelled agnate tier.",
    sourceRefs: ['bukhari-6732'],
  },
  'halfCousin.residuary': {
    simple: "The paternal half-uncle's son(s) receive the entire residue.",
    detailed: "With no full uncle's son present, the paternal half-uncle's son(s) take the entire residue as the final modelled agnate tier.",
    sourceRefs: ['bukhari-6732'],
  },

  // Blocking - category level
  'blocked.grandfatherByFather': {
    simple: 'The paternal grandfather does not inherit and was not asked about, because the father is alive.',
    detailed: 'A living father always stands closer than a paternal grandfather, so the grandfather is entirely excluded and the wizard skips the question.',
    sourceRefs: ['quran-4-11'],
  },
  'blocked.grandmotherByMother': {
    simple: 'Grandmothers do not inherit and were not asked about, because the mother is alive.',
    detailed: 'A living mother blocks every grandmother from inheriting, so the wizard skips the grandmother question entirely.',
    sourceRefs: ['bukhari-6732'],
  },
  'blocked.siblingsByFatherFigure': {
    simple: 'Siblings of every kind are blocked from inheriting by the father or paternal grandfather.',
    detailed: 'The Hanafi position holds that a living father-figure (father or, in his absence, the paternal grandfather) blocks all siblings - full, paternal half-, and maternal - and everything below them in the residuary chain.',
    sourceRefs: ['quran-4-11'],
  },
  'blocked.siblingsByMaleDescendant': {
    simple: 'Siblings of every kind are blocked from inheriting by a male descendant of the deceased.',
    detailed: "A son or son's son blocks all siblings - full, paternal half-, and maternal - from inheriting.",
    sourceRefs: ['quran-4-11'],
  },
  'blocked.extendedByCloserHeir': {
    simple: 'Extended paternal relatives were not asked about because a closer heir already exists in this case.',
    detailed: 'Nephews, uncles, and cousins are only relevant once every nearer residuary heir - descendants, father figure, and sibling tiers - is confirmed absent.',
    sourceRefs: ['bukhari-6732'],
  },

  // Blocking - specific
  'blocked.sonsDaughterByDaughters': {
    simple: "The son's daughter(s) do not inherit because two or more daughters already take the full 2/3 pool.",
    detailed: "With two or more daughters already sharing the Qur'anic 2/3, there is nothing left to complete for a son's daughter, and no son's son is present to make her residuary.",
    sourceRefs: ['quran-4-11'],
  },
  'blocked.paternalHalfSisterByFullSisters': {
    simple: 'The paternal half-sister(s) do not inherit because two or more full sisters already take the full share available to sisters.',
    detailed: 'With two or more full sisters already sharing the pooled 2/3 (or acting as asabah ma\'a al-ghayr), there is nothing left for a paternal half-sister, and no paternal half-brother is present to make her residuary.',
    sourceRefs: ['quran-4-176'],
  },
  'blocked.paternalHalfBrotherByFullBrothers': {
    simple: 'The paternal half-brother(s) do not inherit because full brothers, being closer in blood, take the residue instead.',
    detailed: 'Within the same residuary degree, full-blood relatives always block half-blood relatives - full brothers exclude paternal half-brothers entirely.',
    sourceRefs: ['bukhari-6732'],
  },
  'blocked.paternalHalfSisterByFullBrothers': {
    simple: 'The paternal half-sister(s) do not inherit because full brothers absorb the residue alongside the full sisters.',
    detailed: 'Full brothers, being closer in blood, exclude paternal half-siblings entirely from the residuary chain.',
    sourceRefs: ['bukhari-6732'],
  },
  'blocked.paternalHalfBrotherByFullSisters': {
    simple: "The paternal half-brother(s) do not inherit because the full sister(s) already absorb the entire residue as asabah ma'a al-ghayr.",
    detailed: "When full sisters convert to residuary heirs alongside a female descendant, they take the entire remaining residue and block every lower residuary tier, including paternal half-brothers.",
    sourceRefs: ['quran-4-176'],
  },
  'blocked.residueExhausted': {
    simple: 'This relative does not inherit because the fixed-share heirs already account for the entire estate, leaving no residue.',
    detailed:
      "In this Hanafi (Mushtaraka-style) case, the fixed-share heirs exhaust the estate exactly, so no residuary share remains - this relative's tier is never reached.",
    sourceRefs: ['bukhari-6732'],
  },
  'blocked.chainByNearerDegree': {
    simple: 'This relative does not inherit because a nearer relative in the same extended-family chain already takes the entire residue.',
    detailed: 'The residuary chain is strictly ordered - a nearer degree always blocks a more remote one, and within the same degree full blood blocks half blood.',
    sourceRefs: ['bukhari-6732'],
  },
};
