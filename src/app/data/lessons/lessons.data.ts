import { Lesson } from './lesson.model';

export const LESSONS: Lesson[] = [
  {
    number: 1,
    slug: 'foundations-of-inheritance',
    title: 'Foundations of Inheritance',
    category: 'foundations',
    icon: 'BookOpen',
    difficulty: 'Beginner',
    readingMinutes: 6,
    summary: 'Introduction to Faraid, its sources, principles, and key terminology.',
    relatedGlossaryTerms: ['Faraid', 'Mirath', 'Ashab al-Furud', 'Asabah'],
    sections: [
      {
        heading: 'What is Faraid?',
        body: "Faraid is the Islamic science of inheritance: a fixed system for distributing a deceased person's estate among their surviving relatives, established primarily in the Qur'an (chiefly 4:11, 4:12, and 4:176) and elaborated by the Sunnah and classical scholarship.",
      },
      {
        heading: 'Why the shares are fixed',
        body: 'Unlike a will, which a person can freely direct up to one-third of their estate toward, the Faraid shares themselves are not left to personal preference. This protects vulnerable heirs - such as women and minors - from being excluded, and treats inheritance as a right rather than a gift.',
      },
      {
        heading: 'Two broad categories of heirs',
        body: "Heirs fall into two broad groups: Ashab al-Furud, who receive a fixed fraction of the estate (1/2, 1/4, 1/8, 2/3, 1/3, or 1/6), and Asabah, who receive whatever residue remains after fixed shares are paid. Some heirs, like the father, can occupy both roles depending on who else survives.",
      },
    ],
  },
  {
    number: 2,
    slug: 'estate-before-distribution',
    title: 'Estate Before Distribution',
    category: 'foundations',
    icon: 'FileSpreadsheet',
    difficulty: 'Core Topic',
    readingMinutes: 5,
    summary: 'Identify estate components, debts, wasiyyah, and expenses before distribution.',
    relatedGlossaryTerms: ['Mirath', 'Wasiyyah'],
    sections: [
      {
        heading: 'Four things come before Faraid',
        body: 'Before any Faraid share is calculated, four things must be settled from the gross estate, in order: (1) funeral and burial expenses, (2) outstanding debts, (3) a valid bequest (wasiyyah) of up to one-third of what remains, and (4) the separation of any jointly-owned assets that were never fully the deceased\'s to begin with.',
      },
      {
        heading: 'What "distributable estate" means',
        body: 'Only after those four steps is the "distributable estate" arrived at - the number that Faraid shares are actually fractions of. Mirath Guide asks for this net distributable estate directly and does not calculate estate deductions itself in this MVP.',
      },
      {
        heading: 'Why this matters',
        body: 'A common source of error in real cases is applying Faraid fractions to the gross estate instead of the net distributable estate. Getting this step right matters as much as getting the fractions right.',
      },
    ],
  },
  {
    number: 3,
    slug: 'spouses-in-faraid',
    title: 'Spouses in Faraid',
    category: 'fixed-share-heirs',
    icon: 'UsersRound',
    difficulty: 'Core Topic',
    readingMinutes: 5,
    summary: 'Shares of husbands and wives, with and without children.',
    relatedGlossaryTerms: ['Ashab al-Furud'],
    sections: [
      {
        heading: "The husband's share",
        body: "A husband takes 1/2 of his wife's estate if she leaves no descendant (child or son's descendant), and 1/4 if she does.",
      },
      {
        heading: "The wife or wives' share",
        body: "A wife takes 1/4 of her husband's estate if he leaves no descendant, and 1/8 if he does. If a man leaves more than one wife (up to four), this fraction is a single pool, divided equally among them - it is not multiplied per wife.",
      },
      {
        heading: 'Spouses are never blocked',
        body: 'Unlike most other heirs, a spouse\'s share is never reduced to zero by another relative\'s presence - it only moves between the two Qur\'anic fractions above. A spouse can, however, be affected by Awl (proportional reduction), though never increased by Radd.',
      },
    ],
  },
  {
    number: 4,
    slug: 'parents-and-grandparents',
    title: 'Parents and Grandparents',
    category: 'fixed-share-heirs',
    icon: 'UsersRound',
    difficulty: 'Core Topic',
    readingMinutes: 7,
    summary: 'Shares and rules for parents and ascendants in inheritance.',
    relatedGlossaryTerms: ['Ashab al-Furud', 'Asabah', 'Umariyyatayn'],
    sections: [
      {
        heading: "The mother's share",
        body: 'A mother takes 1/6 if the deceased leaves a descendant, or two or more siblings of any kind (even siblings who are themselves blocked from inheriting by a father figure still count toward this rule). Otherwise she takes 1/3 - except in the special Umariyyatayn case.',
      },
      {
        heading: "The father's share",
        body: "A father takes 1/6 only if a male descendant (son or son's son) survives; 1/6 plus any residue if only a female descendant survives; and the residue alone, as the nearest agnate, if no descendant survives at all.",
      },
      {
        heading: 'The paternal grandfather',
        body: 'When the father has passed away, the paternal grandfather steps into an identical role to the father in every share rule above, with one exception: the special Umariyyatayn calculation for the mother does not apply when the father figure is a grandfather.',
      },
      {
        heading: 'Grandmothers',
        body: "When the mother has passed away, an eligible grandmother (or two) takes the mother's 1/6 as a shared pool, established through hadith rather than a direct Qur'anic verse.",
      },
    ],
  },
  {
    number: 5,
    slug: 'children-and-grandchildren',
    title: 'Children and Grandchildren',
    category: 'fixed-share-heirs',
    icon: 'UsersRound',
    difficulty: 'Core Topic',
    readingMinutes: 7,
    summary: "Shares of sons, daughters, and their children in different cases.",
    relatedGlossaryTerms: ['Ashab al-Furud', 'Asabah'],
    sections: [
      {
        heading: 'Daughters, with and without a son',
        body: "A single daughter, with no son, takes a fixed 1/2. Two or more daughters, with no son, share a fixed 2/3. But the moment even one son is present, daughters lose their fixed share entirely and become residuary alongside him, at a 2:1 male-to-female ratio.",
      },
      {
        heading: "Son's children",
        body: "A son's son and son's daughter step into the daughter's shoes only when there is no daughter and no son. If exactly one daughter is present (and no son's son), a son's daughter (or several) takes 1/6, completing the 2/3 pool for daughters as a class. If two or more daughters are already present, a son's daughter is blocked entirely - unless a son's son is present, in which case they become residuary together.",
      },
      {
        heading: 'A son always blocks his own descendants',
        body: "A living son blocks his own children (the deceased's grandchildren through him) from inheriting entirely - inheritance passes only to the nearer generation when it exists.",
      },
    ],
  },
  {
    number: 6,
    slug: 'full-and-half-siblings',
    title: 'Full and Half Siblings',
    category: 'fixed-share-heirs',
    icon: 'UsersRound',
    difficulty: 'Intermediate',
    readingMinutes: 8,
    summary: 'Rules for siblings, uterine siblings, and their inheritance rights.',
    relatedGlossaryTerms: ['Kalalah', 'Hajb', "Asabah ma'a al-ghayr"],
    sections: [
      {
        heading: 'Three kinds of siblings',
        body: 'Faraid distinguishes full siblings (same two parents), paternal half-siblings (same father, different mother), and maternal siblings (same mother, different father) - each with its own share rules.',
      },
      {
        heading: 'When siblings can inherit at all',
        body: 'No sibling of any kind inherits while a father, paternal grandfather, or any male descendant of the deceased is alive - this is the kalalah condition.',
      },
      {
        heading: 'Full sisters',
        body: "A single full sister (kalalah, no full brother) takes 1/2; two or more share 2/3. If a full brother is present, sisters instead become residuary alongside him at 2:1. If a female descendant is present instead, full sisters convert to residuary heirs through her (asabah ma'a al-ghayr).",
      },
      {
        heading: 'Paternal half-siblings',
        body: 'Paternal half-sisters follow the full sisters\' pattern, but only when no full sister or full brother stands ahead of them - a single full sister already present entitles a paternal half-sister to a completing 1/6, while two or more full sisters block her entirely.',
      },
      {
        heading: 'Maternal siblings',
        body: 'Maternal siblings are unique: a single maternal sibling takes 1/6, two or more share a pooled 1/3 - split equally between males and females. The usual 2:1 ratio never applies to maternal siblings.',
      },
    ],
  },
  {
    number: 7,
    slug: 'hajb',
    title: 'Hajb (Blocking)',
    category: 'residuary-heirs',
    icon: 'Shield',
    difficulty: 'Core Topic',
    readingMinutes: 6,
    summary: 'Understand the types of blocking rules and how heirs can be excluded.',
    relatedGlossaryTerms: ['Hajb'],
    sections: [
      {
        heading: 'Two kinds of blocking',
        body: "Hajb comes in two forms: hajb bi al-wasf (blocking by description, such as differing religion or homicide - outside this MVP's scope) and hajb bi al-shakhs (blocking by the presence of a nearer person), which is what the calculator models.",
      },
      {
        heading: 'Complete vs partial blocking',
        body: "Complete blocking excludes an heir entirely - a living father blocks the paternal grandfather completely. Partial blocking reduces a share without eliminating it - the mother's 1/3 reduces to 1/6 when a descendant or two-or-more siblings are present, but she is never fully excluded.",
      },
      {
        heading: 'The most important blocking rule in this MVP',
        body: 'The Hanafi position gives the father-figure (father, or the paternal grandfather in his absence) power to block every sibling - full, paternal half-, and maternal - along with everything below them in the residuary chain.',
      },
    ],
  },
  {
    number: 8,
    slug: 'kalalah',
    title: 'Kalalah',
    category: 'residuary-heirs',
    icon: 'GitBranch',
    difficulty: 'Intermediate',
    readingMinutes: 6,
    summary: 'What is kalalah and how inheritance is resolved in its cases.',
    relatedGlossaryTerms: ['Kalalah'],
    sections: [
      {
        heading: 'Defining kalalah',
        body: "A person dies as a kalalah when they leave no descendant (child or son's descendant) and no father or paternal grandfather. Qur'an 4:12 and 4:176 both address inheritance specifically in this condition.",
      },
      {
        heading: 'Why it matters',
        body: 'Kalalah is the gateway condition for every sibling category - full, paternal half-, and maternal - to inherit at all. Outside kalalah, no sibling of any kind receives a share.',
      },
      {
        heading: 'A worked kalalah case',
        body: 'A husband, one maternal sibling, and one full brother: the husband takes 1/2 (no descendant), the maternal sibling takes 1/6, and the full brother takes the residue, 1/3 - together summing to exactly the whole estate.',
      },
    ],
  },
  {
    number: 9,
    slug: 'awl',
    title: 'Awl',
    category: 'special-rules',
    icon: 'Scale',
    difficulty: 'Advanced',
    readingMinutes: 6,
    summary: 'When total shares exceed the estate and how Awl adjusts the fractions.',
    relatedGlossaryTerms: ['Awl'],
    sections: [
      {
        heading: 'When Awl is needed',
        body: "Because each fixed share is calculated independently against the whole estate, it is possible for several fixed-share heirs' fractions to add up to more than one whole estate - most often when a spouse, both parents (or mother and siblings), and a daughter or sisters are combined.",
      },
      {
        heading: 'How the adjustment works',
        body: 'Awl scales every fixed share down by the same ratio so that the total returns to exactly one whole estate. Every fixed-share heir is reduced proportionally, including the spouse - Awl is the one adjustment where the spouse\'s share can decrease.',
      },
      {
        heading: 'Reading an Awl result',
        body: 'Classical texts describe Awl as inflating the shared denominator - for example "from 6 to 8" - because every share is re-expressed over a larger common denominator so the numerators still add up exactly.',
      },
    ],
  },
  {
    number: 10,
    slug: 'radd',
    title: 'Radd',
    category: 'special-rules',
    icon: 'ChartPie',
    difficulty: 'Advanced',
    readingMinutes: 6,
    summary: 'When there is a remainder and how it is returned to eligible heirs.',
    relatedGlossaryTerms: ['Radd'],
    sections: [
      {
        heading: 'When Radd applies',
        body: 'If fixed shares add up to less than the whole estate, and no residuary heir exists to claim the difference, that surplus does not simply disappear - it is returned (Radd) to the fixed-share heirs.',
      },
      {
        heading: 'The spouse is excluded',
        body: "Radd is distributed proportionally among the fixed-share heirs in the case, but never to the spouse - a husband or wife's share is fixed at its Qur'anic fraction and cannot grow through Radd, even if they are the only other heir present.",
      },
      {
        heading: 'When there is no one to receive Radd',
        body: 'If the spouse is the only heir at all, the surplus is not distributed under this MVP - classically it would pass to distant kindred (dhawil al-arham) or the public treasury (Bayt al-Mal), both outside this MVP\'s scope.',
      },
    ],
  },
  {
    number: 11,
    slug: 'worked-examples',
    title: 'Worked Examples',
    category: 'worked-examples',
    icon: 'ClipboardList',
    difficulty: 'Case-Based',
    readingMinutes: 10,
    summary: 'Step-by-step solved cases to strengthen understanding and build confidence.',
    relatedGlossaryTerms: ['Awl', 'Radd', 'Umariyyatayn', "Asabah ma'a al-ghayr"],
    sections: [
      {
        heading: 'Example: wife, two sons, one daughter, father, mother',
        body: 'Wife 1/8, mother 1/6, father 1/6 (all fixed, since descendants are present). The remaining 13/24 is split 2:1:1 between the two sons and the daughter - each son receives 13/60 and the daughter 13/120.',
      },
      {
        heading: 'Example: Minbariyya (an Awl case)',
        body: 'Wife, two daughters, father, and mother: fixed shares (1/8, 2/3, 1/6, 1/6) add up to more than the whole estate, so Awl scales every share down proportionally, expressed over a denominator of 27 instead of 24.',
      },
      {
        heading: 'Practice with the calculator',
        body: 'The best way to internalize these rules is to try your own family structures in the guided calculator and read the detailed calculation view for each result.',
      },
    ],
  },
];
