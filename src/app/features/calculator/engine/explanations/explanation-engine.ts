import { Injectable } from '@angular/core';
import { inject } from '@angular/core';
import { ExplanationEntry } from '../../models/calculation-result.model';
import { BlockedHeirGroup, EligibleHeirShare } from '../../models/heir.model';
import { AppLocale } from '../../../../i18n/config/locale.types';
import { LocaleService } from '../../../../i18n/locale.service';
import { AR_EXPLANATIONS } from '../../../../i18n/explanations/ar.explanations';
import { EN_EXPLANATIONS } from '../../../../i18n/explanations/en.explanations';
import { FR_EXPLANATIONS } from '../../../../i18n/explanations/fr.explanations';
import { HI_EXPLANATIONS } from '../../../../i18n/explanations/hi.explanations';
import { UR_EXPLANATIONS } from '../../../../i18n/explanations/ur.explanations';
import { HeirLabelService } from '../../models/heir-labels';
import { EXPLANATION_DICTIONARY } from './explanation-dictionary';

export interface ResolvedReason {
  simple: string;
  detailed: string;
  sourceRefs: string[];
}

const EXPLANATIONS_BY_LOCALE = {
  en: EN_EXPLANATIONS,
  ur: UR_EXPLANATIONS,
  hi: HI_EXPLANATIONS,
  fr: FR_EXPLANATIONS,
  ar: AR_EXPLANATIONS,
} as Record<AppLocale, typeof EXPLANATION_DICTIONARY>;

export function resolveReason(reasonCode: string): ResolvedReason {
  const entry = EXPLANATION_DICTIONARY[reasonCode];
  if (!entry) {
    return { simple: reasonCode, detailed: reasonCode, sourceRefs: [] };
  }
  return entry;
}

@Injectable({ providedIn: 'root' })
export class ExplanationEngine {
  private readonly locale = inject(LocaleService);
  private readonly heirLabels = inject(HeirLabelService);

  resolve(reasonCode: string): ResolvedReason {
    return this.resolveLocalizedReason(reasonCode);
  }

  buildEligibleExplanations(shares: EligibleHeirShare[]): ExplanationEntry[] {
    return shares.map((share) => {
      const resolved = this.resolveLocalizedReason(share.reasonCode);
      return {
        relationship: this.heirLabels.label(share.relationship, share.count),
        simple: resolved.simple,
        detailed: resolved.detailed,
        sourceRefs: resolved.sourceRefs,
      };
    });
  }

  buildBlockedExplanations(blocked: BlockedHeirGroup[]): ExplanationEntry[] {
    return blocked.map((entry) => {
      const resolved = this.resolveLocalizedReason(entry.reasonCode);
      return {
        relationship: this.heirLabels.label(entry.relationship, 2),
        simple: resolved.simple,
        detailed: resolved.detailed,
        sourceRefs: resolved.sourceRefs,
      };
    });
  }

  private resolveLocalizedReason(reasonCode: string): ResolvedReason {
    return EXPLANATIONS_BY_LOCALE[this.locale.locale()][reasonCode] ?? resolveReason(reasonCode);
  }
}
