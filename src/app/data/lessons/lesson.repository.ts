import { Injectable, computed, inject } from '@angular/core';
import { AppLocale } from '../../i18n/config/locale.types';
import { LocaleService } from '../../i18n/locale.service';
import { LESSONS } from './lessons.data';
import { UR_LESSONS } from './lessons.ur';
import { HI_LESSONS } from './lessons.hi';
import { FR_LESSONS } from './lessons.fr';
import { AR_LESSONS } from './lessons.ar';

const LESSONS_BY_LOCALE = {
  en: LESSONS,
  ur: UR_LESSONS,
  hi: HI_LESSONS,
  fr: FR_LESSONS,
  ar: AR_LESSONS,
} satisfies Record<AppLocale, typeof LESSONS>;

@Injectable({ providedIn: 'root' })
export class LessonRepository {
  private readonly locale = inject(LocaleService);
  readonly lessons = computed(() => LESSONS_BY_LOCALE[this.locale.locale()]);

  findBySlug(slug: string | null) {
    return this.lessons().find((lesson) => lesson.slug === slug) ?? null;
  }
}
