import { localizeLessons } from '../content-localization.util';
import { LESSONS } from './lessons.data';

export const FR_LESSONS = localizeLessons(LESSONS, {
  'foundations-of-inheritance': {
    title: "Fondements de l'héritage",
    difficulty: 'Débutant',
    summary: 'Introduction aux Faraid, à leurs sources, principes et termes clés.',
    metaTitle: "Fondements de l'héritage | Miraath Guide",
    metaDescription: "Apprenez les bases de l'héritage islamique, les parts fixes et la structure générale du droit successoral.",
    relatedGlossaryTerms: ['Faraid', 'Mirath', 'Ashab al-Furud', 'Asabah'],
    sections: [
      { heading: 'Que sont les Faraid ?', body: "Les Faraid sont la science islamique de l'héritage : un système fixé pour répartir la succession d'une personne décédée entre ses proches survivants, principalement établi dans le Coran (4:11, 4:12, 4:176), la Sunnah et la scholarship classique." },
      { heading: 'Pourquoi les parts sont fixées', body: "Contrairement à une wasiyyah limitée, les parts de Faraid ne sont pas laissées à la préférence personnelle. Elles protègent les héritiers vulnérables et traitent l'héritage comme un droit." },
      { heading: "Deux grandes catégories d'héritiers", body: 'Les Ashab al-Furud reçoivent une fraction fixe; les Asabah reçoivent le reliquat après les parts fixes. Certains héritiers, comme le père, peuvent occuper les deux rôles.' },
    ],
  },
  'estate-before-distribution': {
    title: 'La succession avant distribution',
    difficulty: 'Sujet central',
    summary: 'Identifier les biens, dettes, wasiyyah et dépenses avant le partage.',
    sections: [
      { heading: 'Quatre choses avant les Faraid', body: 'Avant tout calcul, il faut régler les frais funéraires, les dettes, une wasiyyah valide et séparer les biens détenus conjointement.' },
      { heading: 'Succession distribuable', body: 'Après ces étapes, le montant net restant est la succession distribuable sur laquelle les fractions de Faraid sont appliquées.' },
      { heading: 'Pourquoi cela compte', body: 'Une erreur courante consiste à appliquer les fractions au patrimoine brut au lieu du montant net distribuable.' },
    ],
  },
  'spouses-in-faraid': {
    title: 'Les époux dans les Faraid',
    difficulty: 'Sujet central',
    summary: 'Parts du mari et de la ou des épouses, avec ou sans enfants.',
    sections: [
      { heading: 'La part du mari', body: 'Le mari reçoit 1/2 si son épouse ne laisse aucun descendant, et 1/4 si elle en laisse.' },
      { heading: "La part de l'épouse ou des épouses", body: "L'épouse reçoit 1/4 si le mari ne laisse aucun descendant, et 1/8 s'il en laisse. Plusieurs épouses partagent ensemble ce seul pool." },
      { heading: 'Le conjoint n’est jamais totalement exclu', body: "La part du conjoint ne tombe pas à zéro par la présence d'un autre parent; elle change seulement entre les fractions coraniques, sauf réduction par Awl." },
    ],
  },
  'parents-and-grandparents': {
    title: 'Parents et grands-parents',
    difficulty: 'Sujet central',
    summary: 'Règles concernant les parents et ascendants.',
    sections: [
      { heading: 'La part de la mère', body: 'La mère reçoit 1/6 en présence de descendants ou de deux frères/soeurs ou plus; sinon 1/3, sauf dans le cas Umariyyatayn.' },
      { heading: 'La part du père', body: 'Le père reçoit 1/6 avec un descendant masculin, 1/6 plus le reliquat avec seulement une descendante féminine, ou tout le reliquat sans descendant.' },
      { heading: 'Le grand-père paternel', body: 'Lorsque le père est décédé, le grand-père paternel prend souvent sa place, sauf pour le calcul spécial Umariyyatayn.' },
      { heading: 'Les grand-mères', body: 'Si la mère est décédée, une ou deux grand-mères admissibles partagent le 1/6 attribué par les hadiths.' },
    ],
  },
  'children-and-grandchildren': {
    title: 'Enfants et petits-enfants',
    difficulty: 'Sujet central',
    summary: 'Parts des fils, filles et enfants des fils.',
    sections: [
      { heading: 'Les filles avec ou sans fils', body: 'Une seule fille sans fils reçoit 1/2. Deux filles ou plus reçoivent 2/3. Avec un fils, les filles deviennent Asabah avec un ratio 2:1.' },
      { heading: 'Les enfants du fils', body: "Le fils du fils et la fille du fils interviennent en l'absence de fils; la fille du fils peut compléter le pool des filles dans certaines situations." },
      { heading: 'Un fils bloque ses propres descendants', body: 'Un fils vivant bloque les petits-enfants passant par lui, car la génération la plus proche est présente.' },
    ],
  },
  'full-and-half-siblings': {
    title: 'Frères et soeurs germains et demi-frères',
    difficulty: 'Intermédiaire',
    summary: 'Règles relatives aux frères et soeurs de différentes catégories.',
    sections: [
      { heading: 'Trois types de frères et soeurs', body: 'Les Faraid distinguent germains, consanguins et utérins, chacun avec des règles propres.' },
      { heading: 'Quand ils peuvent hériter', body: 'Aucun frère ou soeur n’hérite en présence du père, du grand-père paternel ou d’un descendant masculin; c’est la condition de Kalalah.' },
      { heading: 'Les soeurs germaines', body: 'En Kalalah, une soeur germaine reçoit 1/2, deux ou plus 2/3, ou devient Asabah avec un frère au ratio 2:1.' },
      { heading: 'Les demi-soeurs paternelles', body: 'Elles suivent le modèle des soeurs germaines seulement lorsque celles-ci ne les précèdent pas.' },
      { heading: 'Les frères et soeurs utérins', body: 'Un seul reçoit 1/6; deux ou plus partagent 1/3 à égalité, sans ratio 2:1.' },
    ],
  },
  hajb: {
    title: 'Hajb (exclusion)',
    difficulty: 'Sujet central',
    summary: 'Comprendre comment des héritiers peuvent être exclus ou réduits.',
    sections: [
      { heading: 'Deux formes de Hajb', body: 'Le Hajb peut venir d’une qualité juridique ou de la présence d’une personne plus proche; ce calculateur modélise ce second cas.' },
      { heading: 'Exclusion complète ou partielle', body: 'L’exclusion complète annule la part; l’exclusion partielle réduit une part, comme celle de la mère de 1/3 à 1/6.' },
      { heading: 'Règle hanafite importante', body: 'Dans la méthode hanafite, le père ou grand-père bloque toutes les catégories de frères et soeurs.' },
    ],
  },
  kalalah: {
    title: 'Kalalah',
    difficulty: 'Intermédiaire',
    summary: 'Définition de Kalalah et résolution de ses cas.',
    sections: [
      { heading: 'Définir Kalalah', body: 'Une personne meurt en Kalalah lorsqu’elle ne laisse ni descendant ni père ou grand-père paternel.' },
      { heading: 'Pourquoi c’est important', body: 'Kalalah est la condition d’accès à l’héritage pour toutes les catégories de frères et soeurs.' },
      { heading: 'Un cas travaillé', body: 'Mari, un frère/soeur utérin et un frère germain : le mari prend 1/2, l’utérin 1/6 et le frère germain le reliquat 1/3.' },
    ],
  },
  awl: {
    title: 'Awl',
    difficulty: 'Avancé',
    summary: 'Quand les parts dépassent la succession et comment Awl ajuste les fractions.',
    sections: [
      { heading: 'Quand Awl est nécessaire', body: 'Plusieurs parts fixes calculées séparément peuvent dépasser une succession entière.' },
      { heading: 'Comment l’ajustement fonctionne', body: 'Awl réduit proportionnellement toutes les parts fixes pour revenir exactement à une succession.' },
      { heading: 'Lire un résultat Awl', body: 'Les textes classiques décrivent souvent Awl comme une augmentation du dénominateur commun.' },
    ],
  },
  radd: {
    title: 'Radd',
    difficulty: 'Avancé',
    summary: 'Quand un reliquat est retourné aux héritiers admissibles.',
    sections: [
      { heading: 'Quand Radd s’applique', body: 'Si les parts fixes sont inférieures à la succession et qu’aucun Asabah ne reçoit le reliquat, le surplus revient aux héritiers fixes admissibles.' },
      { heading: 'Le conjoint est exclu', body: 'Le Radd est proportionnel, mais la part du conjoint n’augmente pas par Radd.' },
      { heading: 'Quand personne ne reçoit Radd', body: 'Si le conjoint est le seul héritier, ce MVP ne distribue pas le surplus; les Dhawil al-Arham et Bayt al-Mal dépassent son périmètre.' },
    ],
  },
  'worked-examples': {
    title: 'Exemples résolus',
    difficulty: 'Par cas',
    summary: 'Cas résolus étape par étape pour renforcer la compréhension.',
    sections: [
      { heading: 'Exemple : épouse, deux fils, une fille, père, mère', body: 'Épouse 1/8, mère 1/6, père 1/6; le reliquat 13/24 est partagé entre deux fils et une fille au ratio 2:1.' },
      { heading: 'Exemple : Minbariyya (Awl)', body: 'Épouse, deux filles, père et mère : les parts fixes dépassent le tout, donc Awl les exprime sur 27 au lieu de 24.' },
      { heading: 'Pratiquer avec le calculateur', body: 'Essayez vos propres structures familiales et lisez la vue détaillée du résultat.' },
    ],
  },
});
