import { Injectable } from '@angular/core';
import { ExplanationEntry } from '../../models/calculation-result.model';
import { BlockedHeirGroup, EligibleHeirShare } from '../../models/heir.model';
import { heirLabel } from '../../models/heir-labels';
import { EXPLANATION_DICTIONARY } from './explanation-dictionary';

export interface ResolvedReason {
  simple: string;
  detailed: string;
  sourceRefs: string[];
}

export function resolveReason(reasonCode: string): ResolvedReason {
  const entry = EXPLANATION_DICTIONARY[reasonCode];
  if (!entry) {
    return { simple: reasonCode, detailed: reasonCode, sourceRefs: [] };
  }
  return entry;
}

@Injectable({ providedIn: 'root' })
export class ExplanationEngine {
  buildEligibleExplanations(shares: EligibleHeirShare[]): ExplanationEntry[] {
    return shares.map((share) => {
      const resolved = resolveReason(share.reasonCode);
      return {
        relationship: heirLabel(share.relationship, share.count),
        simple: resolved.simple,
        detailed: resolved.detailed,
        sourceRefs: resolved.sourceRefs,
      };
    });
  }

  buildBlockedExplanations(blocked: BlockedHeirGroup[]): ExplanationEntry[] {
    return blocked.map((entry) => {
      const resolved = resolveReason(entry.reasonCode);
      return {
        relationship: heirLabel(entry.relationship, 2),
        simple: resolved.simple,
        detailed: resolved.detailed,
        sourceRefs: resolved.sourceRefs,
      };
    });
  }
}
