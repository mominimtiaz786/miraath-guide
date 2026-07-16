import { AppIconName } from '../../shared/icons/icon-registry';

export type LessonCategory =
  | 'foundations'
  | 'fixed-share-heirs'
  | 'residuary-heirs'
  | 'special-rules'
  | 'worked-examples';

export type LessonDifficulty = 'Beginner' | 'Core Topic' | 'Intermediate' | 'Advanced' | 'Case-Based';

export interface LessonSection {
  heading: string;
  body: string;
}

export interface Lesson {
  number: number;
  slug: string;
  title: string;
  category: LessonCategory;
  icon: AppIconName;
  summary: string;
  difficulty: LessonDifficulty;
  readingMinutes: number;
  sections: LessonSection[];
  relatedGlossaryTerms: string[];
}
