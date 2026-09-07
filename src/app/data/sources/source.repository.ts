import { Injectable, computed, inject } from '@angular/core';
import { AppLocale } from '../../i18n/config/locale.types';
import { LocaleService } from '../../i18n/locale.service';
import { SOURCE_REFERENCES } from './sources.data';
import { UR_SOURCE_REFERENCES } from './sources.ur';
import { HI_SOURCE_REFERENCES } from './sources.hi';
import { FR_SOURCE_REFERENCES } from './sources.fr';
import { AR_SOURCE_REFERENCES } from './sources.ar';

const SOURCES_BY_LOCALE = {
  en: SOURCE_REFERENCES,
  ur: UR_SOURCE_REFERENCES,
  hi: HI_SOURCE_REFERENCES,
  fr: FR_SOURCE_REFERENCES,
  ar: AR_SOURCE_REFERENCES,
} satisfies Record<AppLocale, typeof SOURCE_REFERENCES>;

@Injectable({ providedIn: 'root' })
export class SourceRepository {
  private readonly locale = inject(LocaleService);
  readonly references = computed(() => SOURCES_BY_LOCALE[this.locale.locale()]);
  readonly all = computed(() => Object.values(this.references()));

  findById(id: string) {
    return this.references()[id] ?? null;
  }
}
