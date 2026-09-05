import { CommonCase } from './common-cases/common-case.model';
import { GlossaryTerm } from './glossary/glossary-term.model';
import { Lesson } from './lessons/lesson.model';

type LessonText = Partial<Pick<Lesson, 'title' | 'summary' | 'metaTitle' | 'metaDescription' | 'difficulty' | 'relatedGlossaryTerms'>> & {
  sections?: Lesson['sections'];
};

type CaseText = Partial<
  Pick<
    CommonCase,
    | 'title'
    | 'summary'
    | 'scenario'
    | 'heirs'
    | 'keyShares'
    | 'eligibleHeirs'
    | 'blockedHeirs'
    | 'calculationSteps'
    | 'ruleExplanation'
    | 'relatedConcepts'
  >
>;

type GlossaryText = Partial<Pick<GlossaryTerm, 'term' | 'romanUrdu' | 'definition'>>;

export function localizeLessons(source: readonly Lesson[], overrides: Record<string, LessonText>): Lesson[] {
  return source.map((lesson) => ({
    ...lesson,
    ...overrides[lesson.id],
    sections: overrides[lesson.id]?.sections ?? lesson.sections,
  }));
}

export function localizeCommonCases(source: readonly CommonCase[], overrides: Record<string, CaseText>): CommonCase[] {
  return source.map((commonCase) => ({
    ...commonCase,
    ...overrides[commonCase.id],
  }));
}

export function localizeGlossary(source: readonly GlossaryTerm[], overrides: Record<string, GlossaryText>): GlossaryTerm[] {
  return source.map((term) => ({
    ...term,
    ...overrides[term.id],
  }));
}
