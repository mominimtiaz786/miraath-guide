import { Injectable, computed, inject } from '@angular/core';
import { AppLocale } from '../../i18n/config/locale.types';
import { LocaleService } from '../../i18n/locale.service';
import { COMMON_CASES } from './common-cases.data';
import { UR_COMMON_CASES } from './common-cases.ur';
import { HI_COMMON_CASES } from './common-cases.hi';
import { FR_COMMON_CASES } from './common-cases.fr';
import { AR_COMMON_CASES } from './common-cases.ar';

const CASES_BY_LOCALE = {
  en: COMMON_CASES,
  ur: UR_COMMON_CASES,
  hi: HI_COMMON_CASES,
  fr: FR_COMMON_CASES,
  ar: AR_COMMON_CASES,
} satisfies Record<AppLocale, typeof COMMON_CASES>;

@Injectable({ providedIn: 'root' })
export class CommonCaseRepository {
  private readonly locale = inject(LocaleService);
  readonly cases = computed(() => CASES_BY_LOCALE[this.locale.locale()]);

  findBySlug(slug: string | null) {
    return this.cases().find((commonCase) => commonCase.slug === slug) ?? null;
  }
}
