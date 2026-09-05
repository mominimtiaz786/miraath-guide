import { Injectable, computed, inject } from '@angular/core';
import { AppLocale } from '../../i18n/config/locale.types';
import { LocaleService } from '../../i18n/locale.service';
import { GLOSSARY_TERMS } from './glossary.data';
import { UR_GLOSSARY_TERMS } from './glossary.ur';
import { HI_GLOSSARY_TERMS } from './glossary.hi';
import { FR_GLOSSARY_TERMS } from './glossary.fr';
import { AR_GLOSSARY_TERMS } from './glossary.ar';

const GLOSSARY_BY_LOCALE = {
  en: GLOSSARY_TERMS,
  ur: UR_GLOSSARY_TERMS,
  hi: HI_GLOSSARY_TERMS,
  fr: FR_GLOSSARY_TERMS,
  ar: AR_GLOSSARY_TERMS,
} satisfies Record<AppLocale, typeof GLOSSARY_TERMS>;

@Injectable({ providedIn: 'root' })
export class GlossaryRepository {
  private readonly locale = inject(LocaleService);
  readonly terms = computed(() => GLOSSARY_BY_LOCALE[this.locale.locale()]);
}
