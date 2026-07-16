import { CommonCase } from './common-case.model';

/**
 * All figures below are computed directly from the Hanafi rules in spec
 * section 13B (the same engine used by the calculator), not copied from
 * mockup placeholder text - see section 34/35 on not reproducing garbled
 * or doctrinally-incorrect mockup numbers.
 */
export const COMMON_CASES: CommonCase[] = [
  {
    number: 1,
    slug: 'wife-and-both-parents',
    title: 'Wife and both parents (Umariyyatayn)',
    category: 'special-rules',
    heirs: [
      { label: 'Wife', icon: 'UserRound' },
      { label: 'Mother', icon: 'UserRound' },
      { label: 'Father', icon: 'UserRound' },
    ],
    summary: "A wife and both living parents, with no children - a classic Umariyyatayn case.",
    keyShares: [
      { label: 'Wife', value: '1/4' },
      { label: 'Mother', value: '1/4' },
      { label: 'Father', value: '1/2' },
    ],
    scenario:
      "A man passes away leaving his wife and both of his parents. He has no children. Because a spouse and both parents are the only heirs, with no descendants and fewer than two siblings, the Umariyyatayn ruling applies.",
    eligibleHeirs: [
      { label: 'Wife', value: '1/4 - fixed share (no descendant)' },
      { label: 'Mother', value: "1/4 - one-third of the remainder after the wife's share (Umariyyatayn)" },
      { label: 'Father', value: 'Remainder as residuary heir' },
    ],
    blockedHeirs: [],
    calculationSteps: [
      'The wife takes her fixed 1/4 (no descendant present).',
      'Remainder after the wife: 1 - 1/4 = 3/4.',
      "Umariyyatayn: the mother takes 1/3 of that remainder, not 1/3 of the whole estate: 3/4 x 1/3 = 1/4.",
      'The father takes what is left: 3/4 - 1/4 = 1/2.',
      'Total: 1/4 + 1/4 + 1/2 = 1.',
    ],
    ruleExplanation:
      "Umariyyatayn applies when a spouse and both parents are the only heirs, there are no descendants, and there are fewer than two siblings. Without this rule, the mother's ordinary 1/3 could equal or exceed the father's share, which the Hanafi position corrects by basing her third on the remainder after the spouse.",
    relatedConcepts: ['Umariyyatayn', 'Fixed shares', 'Residuary heirs'],
    exampleEstate: 4000000,
    answers: {
      deceasedGender: 'male',
      wivesCount: 1,
      hasDescendants: false,
      fatherAlive: true,
      motherAlive: true,
    },
  },
  {
    number: 2,
    slug: 'wife-son-daughter',
    title: 'Wife, one son and one daughter',
    category: 'spouse-children',
    heirs: [
      { label: 'Wife', icon: 'UserRound' },
      { label: 'Son', icon: 'UserRound' },
      { label: 'Daughter', icon: 'UserRound' },
    ],
    summary: 'A wife, one son, and one daughter - children share the remainder in a 2:1 ratio.',
    keyShares: [
      { label: 'Wife', value: '1/8' },
      { label: 'Son', value: '7/12' },
      { label: 'Daughter', value: '7/24' },
    ],
    scenario:
      'A man passes away leaving his wife, one son, and one daughter. There are no surviving parents.',
    eligibleHeirs: [
      { label: 'Wife', value: '1/8 - fixed share (descendants present)' },
      { label: 'Son', value: '7/12 - residuary, 2 shares' },
      { label: 'Daughter', value: '7/24 - residuary, 1 share' },
    ],
    blockedHeirs: [],
    calculationSteps: [
      'The wife takes her fixed 1/8 (descendants are present).',
      'Remainder: 1 - 1/8 = 7/8.',
      'The son and daughter are residuary, sharing at a 2:1 ratio - 3 units total.',
      'Each unit = 7/8 / 3 = 7/24.',
      'The son takes 2 units = 7/12. The daughter takes 1 unit = 7/24.',
      'Total: 1/8 + 7/12 + 7/24 = 1.',
    ],
    ruleExplanation:
      'A son always makes any daughters residuary alongside him rather than fixed-share heirs, sharing the remainder at a male-to-female ratio of 2:1.',
    relatedConcepts: ['Residuary heirs (Asabah)', 'Fixed shares'],
    exampleEstate: 2400000,
    answers: {
      deceasedGender: 'male',
      wivesCount: 1,
      hasDescendants: true,
      sonsCount: 1,
      daughtersCount: 1,
    },
  },
  {
    number: 3,
    slug: 'parents-one-daughter',
    title: 'Parents and one daughter',
    category: 'parents-siblings',
    heirs: [
      { label: 'Father', icon: 'UserRound' },
      { label: 'Mother', icon: 'UserRound' },
      { label: 'Daughter', icon: 'UserRound' },
    ],
    summary: 'The daughter receives her Qur\'anic half, and the remainder passes to the parents.',
    keyShares: [
      { label: 'Daughter', value: '1/2' },
      { label: 'Mother', value: '1/6' },
      { label: 'Father', value: '1/3' },
    ],
    scenario: 'A person passes away leaving both parents and one daughter, with no other descendants.',
    eligibleHeirs: [
      { label: 'Daughter', value: "1/2 - fixed share (the deceased's only daughter, no son)" },
      { label: 'Mother', value: '1/6 - fixed share (a descendant is present)' },
      { label: 'Father', value: '1/3 - 1/6 fixed, plus 1/6 residue as the nearest agnate' },
    ],
    blockedHeirs: [],
    calculationSteps: [
      'The daughter takes her fixed 1/2 (no son present).',
      'The mother takes her fixed 1/6 (a descendant is present).',
      'The father takes his fixed 1/6.',
      'Sum so far: 1/2 + 1/6 + 1/6 = 5/6. Remainder: 1/6.',
      'No nearer residuary heir than the father exists, so he also takes the 1/6 residue: 1/6 + 1/6 = 1/3.',
    ],
    ruleExplanation:
      "The father is both a fixed-share heir (1/6, since a descendant is present) and the residuary heir of last resort - when no closer agnate exists, any leftover residue is added to his fixed share.",
    relatedConcepts: ['Fixed shares', 'Residuary heirs (Asabah)'],
    exampleEstate: 3000000,
    answers: {
      deceasedGender: 'male',
      hasDescendants: true,
      sonsCount: 0,
      daughtersCount: 1,
      fatherAlive: true,
      motherAlive: true,
    },
  },
  {
    number: 4,
    slug: 'one-daughter-with-parents',
    title: 'One daughter with parents',
    category: 'parents-siblings',
    heirs: [
      { label: 'Daughter', icon: 'UserRound' },
      { label: 'Mother', icon: 'UserRound' },
      { label: 'Father', icon: 'UserRound' },
    ],
    summary: "The same family structure viewed from the daughter's side: her half, plus both parents' shares.",
    keyShares: [
      { label: 'Daughter', value: '1/2' },
      { label: 'Mother', value: '1/6' },
      { label: 'Father', value: '1/3' },
    ],
    scenario:
      'The same case as "Parents and one daughter", presented to emphasize how the daughter\'s Qur\'anic half combines with both parents\' shares to exactly exhaust the estate.',
    eligibleHeirs: [
      { label: 'Daughter', value: '1/2 - fixed share' },
      { label: 'Mother', value: '1/6 - fixed share' },
      { label: 'Father', value: '1/3 - fixed share plus residue' },
    ],
    blockedHeirs: [],
    calculationSteps: [
      "Assign the daughter's fixed 1/2.",
      "Assign the mother's fixed 1/6.",
      "Assign the father's fixed 1/6.",
      'Add the remaining 1/6 residue to the father, since no closer agnate exists: 1/6 + 1/6 = 1/3.',
      'Confirm the total: 1/2 + 1/6 + 1/3 = 1.',
    ],
    ruleExplanation:
      'This case is a useful check that fixed shares and residue always reconcile to exactly the whole estate when no adjustment (Awl or Radd) is needed.',
    relatedConcepts: ['Fixed shares', 'Residuary heirs (Asabah)'],
    exampleEstate: 3000000,
    answers: {
      deceasedGender: 'male',
      hasDescendants: true,
      sonsCount: 0,
      daughtersCount: 1,
      fatherAlive: true,
      motherAlive: true,
    },
  },
  {
    number: 5,
    slug: 'two-daughters-with-parents',
    title: 'Two or more daughters with parents',
    category: 'parents-siblings',
    heirs: [
      { label: 'Father', icon: 'UserRound' },
      { label: 'Mother', icon: 'UserRound' },
      { label: 'Daughters', icon: 'UsersRound' },
    ],
    summary: 'Two or more daughters share two-thirds together, and the parents take their fixed sixths.',
    keyShares: [
      { label: 'Daughters (2+)', value: '2/3' },
      { label: 'Mother', value: '1/6' },
      { label: 'Father', value: '1/6' },
    ],
    scenario: 'A person passes away leaving both parents and two (or more) daughters, with no sons.',
    eligibleHeirs: [
      { label: 'Daughters (2+)', value: "2/3 - shared equally, fixed share (no son present)" },
      { label: 'Mother', value: '1/6 - fixed share' },
      { label: 'Father', value: '1/6 - fixed share only, no residue remains' },
    ],
    blockedHeirs: [],
    calculationSteps: [
      'Two or more daughters, with no son, share a pooled 2/3.',
      "The mother takes her fixed 1/6.",
      "The father takes his fixed 1/6.",
      'Total: 2/3 + 1/6 + 1/6 = 1 - the estate is exactly exhausted, so the father receives no additional residue.',
    ],
    ruleExplanation:
      'When two or more daughters are present alongside both parents, the fixed shares happen to sum to exactly one whole estate, leaving no residue for the father to add to his 1/6.',
    relatedConcepts: ['Fixed shares'],
    exampleEstate: 3000000,
    answers: {
      deceasedGender: 'male',
      hasDescendants: true,
      sonsCount: 0,
      daughtersCount: 2,
      fatherAlive: true,
      motherAlive: true,
    },
  },
  {
    number: 6,
    slug: 'siblings-in-kalalah',
    title: 'Siblings in a Kalalah case',
    category: 'kalalah',
    heirs: [
      { label: 'Full brother', icon: 'UserRound' },
      { label: 'Full sister', icon: 'UserRound' },
    ],
    summary: 'With no descendants and no father figure, a full brother and sister share as residuary heirs.',
    keyShares: [
      { label: 'Full brother', value: '2/3' },
      { label: 'Full sister', value: '1/3' },
    ],
    scenario:
      'A person passes away leaving one full brother and one full sister, with no descendants, no father, and no paternal grandfather - a kalalah case.',
    eligibleHeirs: [
      { label: 'Full brother', value: '2/3 - residuary, 2 shares' },
      { label: 'Full sister', value: '1/3 - residuary, 1 share' },
    ],
    blockedHeirs: [],
    calculationSteps: [
      'No descendant and no father figure exist, so full siblings become the operative heirs.',
      'With no other fixed-share heir present, the full brother and sister take the entire estate as residuary, at a 2:1 ratio.',
      'Units: brother 2, sister 1 = 3 units. Each unit = 1/3.',
      'Brother: 2/3. Sister: 1/3.',
    ],
    ruleExplanation:
      'Full brothers are always residuary heirs in a kalalah case; full sisters join them at the standard 2:1 male-to-female ratio.',
    relatedConcepts: ['Kalalah', 'Residuary heirs (Asabah)'],
    exampleEstate: 1500000,
    answers: {
      deceasedGender: 'male',
      hasDescendants: false,
      fatherAlive: false,
      paternalGrandfatherAlive: false,
      motherAlive: false,
      fullBrothersCount: 1,
      fullSistersCount: 1,
    },
  },
  {
    number: 7,
    slug: 'sister-with-a-daughter',
    title: 'Sister with a daughter',
    category: 'special-rules',
    heirs: [
      { label: 'Daughter', icon: 'UserRound' },
      { label: 'Full sister', icon: 'UserRound' },
    ],
    summary: "A full sister becomes a residuary heir (asabah ma'a al-ghayr) alongside the deceased's daughter.",
    keyShares: [
      { label: 'Daughter', value: '1/2' },
      { label: 'Full sister', value: '1/2' },
    ],
    scenario:
      "A person passes away leaving one daughter and one full sister, with no father figure, sons, or full brother.",
    eligibleHeirs: [
      { label: 'Daughter', value: '1/2 - fixed share (no son present)' },
      { label: 'Full sister', value: "1/2 - residuary (asabah ma'a al-ghayr), takes the remainder" },
    ],
    blockedHeirs: [],
    calculationSteps: [
      'The daughter takes her fixed 1/2 (no son present).',
      "Because a female descendant is present and no full brother exists, the full sister converts from a fixed-share heir into a residuary heir (asabah ma'a al-ghayr).",
      'She takes the entire remainder: 1 - 1/2 = 1/2.',
    ],
    ruleExplanation:
      "This is asabah ma'a al-ghayr - \"residuary through another\": a full (or paternal half-) sister who would normally take a fixed share instead becomes residuary because a daughter or son's daughter is present, absorbing the remainder after the descendant's fixed share.",
    relatedConcepts: ["Asabah ma'a al-ghayr", 'Fixed shares', 'Residuary heirs (Asabah)'],
    exampleEstate: 2000000,
    answers: {
      deceasedGender: 'male',
      hasDescendants: true,
      sonsCount: 0,
      daughtersCount: 1,
      fatherAlive: false,
      paternalGrandfatherAlive: false,
      motherAlive: false,
      fullSistersCount: 1,
    },
  },
  {
    number: 8,
    slug: 'mother-and-full-sisters',
    title: 'Mother and full sisters',
    category: 'kalalah',
    heirs: [
      { label: 'Mother', icon: 'UserRound' },
      { label: 'Full sisters', icon: 'UsersRound' },
    ],
    summary: 'With no other heirs, the leftover residue is returned (Radd) to the mother and sisters.',
    keyShares: [
      { label: 'Mother', value: '1/5' },
      { label: 'Full sisters (2+)', value: '4/5' },
    ],
    scenario:
      'A person passes away leaving their mother and two full sisters, with no descendants, no father figure, and no spouse.',
    eligibleHeirs: [
      { label: 'Mother', value: '1/5 - fixed 1/6, increased by Radd' },
      { label: 'Full sisters (2+)', value: '4/5 - fixed 2/3, increased by Radd' },
    ],
    blockedHeirs: [],
    calculationSteps: [
      'Two or more siblings (the sisters) reduce the mother to her 1/6, even though she has no competing descendant.',
      'Two or more full sisters, with no full brother, share a fixed 2/3.',
      'Fixed total: 1/6 + 2/3 = 5/6. Remainder: 1/6.',
      'No residuary heir exists to claim the remainder, so it is returned (Radd) proportionally: mother and sisters were in a 1:4 ratio.',
      'Mother: 1/6 + (1/6 x 1/5) = 1/5. Sisters: 2/3 + (1/6 x 4/5) = 4/5.',
    ],
    ruleExplanation:
      'With no spouse present, Radd distributes the unclaimed residue across every fixed-share heir in proportion to their existing shares - here, the mother and the sisters.',
    relatedConcepts: ['Radd', 'Kalalah', 'Fixed shares'],
    exampleEstate: 1000000,
    answers: {
      deceasedGender: 'male',
      hasDescendants: false,
      fatherAlive: false,
      paternalGrandfatherAlive: false,
      motherAlive: true,
      fullSistersCount: 2,
    },
  },
  {
    number: 9,
    slug: 'awl-example',
    title: 'Awl (reduction) example',
    category: 'special-rules',
    heirs: [
      { label: 'Husband', icon: 'UserRound' },
      { label: 'Mother', icon: 'UserRound' },
      { label: 'Full sisters', icon: 'UsersRound' },
    ],
    summary: 'Fixed shares exceed the whole estate, so every share is proportionally reduced (Awl).',
    keyShares: [
      { label: 'Husband', value: '3/8' },
      { label: 'Mother', value: '1/8' },
      { label: 'Full sisters (2+)', value: '1/2' },
    ],
    scenario:
      'A woman passes away leaving her husband, her mother, and two full sisters, with no father figure and no descendants.',
    eligibleHeirs: [
      { label: 'Husband', value: '3/8 - reduced by Awl from 1/2' },
      { label: 'Mother', value: '1/8 - reduced by Awl from 1/6' },
      { label: 'Full sisters (2+)', value: '1/2 - reduced by Awl from 2/3' },
    ],
    blockedHeirs: [],
    calculationSteps: [
      'Husband (no descendant): 1/2. Mother (2+ siblings reduce her): 1/6. Full sisters (2+, no brother): 2/3.',
      'Common denominator 6: husband 3/6, mother 1/6, sisters 4/6 - total 8/6, which exceeds 1.',
      'Awl scales every share by 6/8: husband 3/6 x 6/8 = 3/8, mother 1/6 x 6/8 = 1/8, sisters 4/6 x 6/8 = 1/2.',
      'New total: 3/8 + 1/8 + 1/2 = 1 (now expressed over a denominator of 8 instead of 6).',
    ],
    ruleExplanation:
      "Awl applies when fixed shares alone exceed the whole estate. Every fixed-share heir, including the spouse, is scaled down by the same ratio so the total returns to exactly one.",
    relatedConcepts: ['Awl', 'Fixed shares'],
    exampleEstate: 1600000,
    answers: {
      deceasedGender: 'female',
      husbandAlive: true,
      hasDescendants: false,
      fatherAlive: false,
      paternalGrandfatherAlive: false,
      motherAlive: true,
      fullSistersCount: 2,
    },
  },
  {
    number: 10,
    slug: 'radd-example',
    title: 'Radd (remainder returned) example',
    category: 'special-rules',
    heirs: [
      { label: 'Wife', icon: 'UserRound' },
      { label: 'Daughter', icon: 'UserRound' },
    ],
    summary: 'After fixed shares, the remainder is returned to blood heirs - never to the spouse.',
    keyShares: [
      { label: 'Wife', value: '1/8' },
      { label: 'Daughter', value: '7/8' },
    ],
    scenario: 'A man passes away leaving his wife and one daughter, with no other heirs.',
    eligibleHeirs: [
      { label: 'Wife', value: '1/8 - fixed share, unchanged by Radd' },
      { label: 'Daughter', value: '7/8 - fixed 1/2, increased by the entire Radd surplus' },
    ],
    blockedHeirs: [],
    calculationSteps: [
      'The wife takes her fixed 1/8 (a descendant is present).',
      "The daughter takes her fixed 1/2 (no son present).",
      'Fixed total: 1/8 + 1/2 = 5/8. Remainder: 3/8.',
      'No residuary heir exists, so the remainder is returned (Radd) - but only to blood heirs, never to the spouse.',
      'The daughter is the only non-spouse fixed-share heir, so she receives the entire 3/8 surplus: 1/2 + 3/8 = 7/8.',
    ],
    ruleExplanation:
      "Radd returns unclaimed residue to fixed-share heirs when no residuary heir exists, but the spouse's share never increases through Radd - here the wife stays at exactly 1/8 while the daughter absorbs the rest.",
    relatedConcepts: ['Radd', 'Fixed shares'],
    exampleEstate: 800000,
    answers: {
      deceasedGender: 'male',
      wivesCount: 1,
      hasDescendants: true,
      sonsCount: 0,
      daughtersCount: 1,
    },
  },
];
