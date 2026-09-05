import { AppIconName } from '../../shared/icons/icon-registry';

export type LessonCategory =
  | 'foundations'
  | 'fixed-share-heirs'
  | 'residuary-heirs'
  | 'special-rules'
  | 'worked-examples';

export type LessonDifficulty = string;

export interface LessonSection {
  heading: string;
  body: string;
}

export interface Lesson {
  id: string;
  number: number;
  slug: string;
  title: string;
  category: LessonCategory;
  icon: AppIconName;
  summary: string;
  metaTitle?: string;
  metaDescription?: string;
  difficulty: LessonDifficulty;
  readingMinutes: number;
  sections: LessonSection[];
  relatedGlossaryTerms: string[];
}
