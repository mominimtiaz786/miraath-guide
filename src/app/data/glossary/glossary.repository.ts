import { Injectable, computed, inject } from '@angular/core';
import { AppLocale } from '../../i18n/config/locale.types';
import { DEFAULT_LOCALE } from '../../i18n/config/locale.config';
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

const TERM_ALIASES = new Map<string, string>([
  ['fixed shares', 'ashab-al-furud'],
  ['fixed share', 'ashab-al-furud'],
  ['parts fixes', 'ashab-al-furud'],
  ['part fixe', 'ashab-al-furud'],
  ['الفروض', 'ashab-al-furud'],
  ['مقرر حصے', 'ashab-al-furud'],
  ['residuary heirs', 'asabah'],
  ['residuary heir', 'asabah'],
  ['residuary heirs asabah', 'asabah'],
  ['residue', 'asabah'],
  ['عصبہ', 'asabah'],
  ['العصبة', 'asabah'],
  ['asabah maa al ghayr', 'asabah-maa-al-ghayr'],
  ['asabah maa ghayr', 'asabah-maa-al-ghayr'],
  ['asabah ma a al ghayr', 'asabah-maa-al-ghayr'],
  ['عصبہ مع الغیر', 'asabah-maa-al-ghayr'],
  ['العصبة مع الغير', 'asabah-maa-al-ghayr'],
]);

@Injectable({ providedIn: 'root' })
export class GlossaryRepository {
  private readonly locale = inject(LocaleService);
  readonly terms = computed(() => GLOSSARY_BY_LOCALE[this.locale.locale()]);

  labelFor(value: string): string {
    const directId = this.findDirectTermId(value);
    if (directId) {
      return this.localizedTerm(directId) ?? value;
    }

    const aliasId = TERM_ALIASES.get(this.normalize(value));
    if (aliasId && this.locale.locale() !== DEFAULT_LOCALE) {
      return this.localizedTerm(aliasId) ?? value;
    }

    return value;
  }

  private findDirectTermId(value: string): string | null {
    const normalized = this.normalize(value);
    const term = [...GLOSSARY_TERMS, ...this.terms()].find((candidate) =>
      [candidate.term, candidate.romanUrdu].some((label) => label && this.normalize(label) === normalized),
    );
    return term?.id ?? null;
  }

  private localizedTerm(id: string): string | null {
    return this.terms().find((term) => term.id === id)?.term ?? null;
  }

  private normalize(value: string): string {
    return value
      .toLocaleLowerCase()
      .replace(/[()'’ʻ`-]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }
}
