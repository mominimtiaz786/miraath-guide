import { Injectable, inject } from '@angular/core';
import { SourceRepository } from '../../data/sources/source.repository';
import { CalculationResult } from '../calculator/models/calculation-result.model';
import { CalculationEngineService } from '../calculator/engine/calculation-engine.service';
import { ExplanationEngine } from '../calculator/engine/explanations/explanation-engine';
import { HeirLabelService } from '../calculator/models/heir-labels';
import { LocaleService } from '../../i18n/locale.service';
import { TranslationService } from '../../i18n/translation.service';
import { ReportModel } from './report.model';

const DISCLAIMER =
  'Mirath Guide is an educational calculation aid based on the implemented Hanafi methodology. Complex cases, disputed facts, local law, estate ownership, debts, bequests, missing persons, unborn heirs, and other special circumstances should be reviewed by a qualified scholar and relevant legal professional. This is not a fatwa and does not constitute legal advice.';

/** Converts a CalculationResult into a PDF-ready report model, keeping rendering separate from inheritance logic (spec section 21.J). */
@Injectable({ providedIn: 'root' })
export class ReportMapperService {
  private readonly calculationEngine = inject(CalculationEngineService);
  private readonly explanationEngine = inject(ExplanationEngine);
  private readonly heirLabels = inject(HeirLabelService);
  private readonly sourceRepository = inject(SourceRepository);
  private readonly localeService = inject(LocaleService);
  private readonly i18n = inject(TranslationService);

  map(result: CalculationResult): ReportModel {
    const locale = this.localeService.definition();
    const localizedResult = this.calculationEngine.calculate(result.answers);
    const eligibleExplanations = this.explanationEngine.buildEligibleExplanations(localizedResult.eligibleHeirs);
    const blockedExplanations = this.explanationEngine.buildBlockedExplanations(localizedResult.blockedHeirs);

    const familySummary: string[] = [
      `Deceased: ${localizedResult.answers.deceasedGender === 'male' ? 'Male' : 'Female'}`,
    ];
    if (localizedResult.answers.deceasedGender === 'female') {
      familySummary.push(`Husband alive: ${localizedResult.answers.husbandAlive ? 'Yes' : 'No'}`);
    } else {
      familySummary.push(`Wives surviving: ${localizedResult.answers.wivesCount ?? 0}`);
    }
    familySummary.push(`Father alive: ${localizedResult.answers.fatherAlive ? 'Yes' : 'No'}`);
    familySummary.push(`Mother alive: ${localizedResult.answers.motherAlive ? 'Yes' : 'No'}`);
    familySummary.push(`Sons: ${localizedResult.answers.sonsCount}, Daughters: ${localizedResult.answers.daughtersCount}`);

    const eligibleHeirs = localizedResult.eligibleHeirs.map((share, index) => {
      const explanation = eligibleExplanations[index];
      return {
        relationship: this.heirLabels.label(share.relationship, share.count),
        fraction: share.poolShare.toDisplayString(),
        percentage: `${share.poolShare.toPercentage(2)}%`,
        amount: localizedResult.estateValue != null ? `PKR ${share.poolShare.toMoney(localizedResult.estateValue).toLocaleString()}` : null,
        shareType: this.i18n.t(`shareTypes.${share.shareType}`),
        reason: explanation?.simple ?? '',
      };
    });

    const blockedHeirs = localizedResult.blockedHeirs.map((blocked, index) => ({
      relationship: this.heirLabels.label(blocked.relationship, 2),
      reason: blockedExplanations[index]?.simple ?? '',
    }));

    const sourceIds = new Set<string>();
    localizedResult.explanations.forEach((entry) => entry.sourceRefs.forEach((id) => sourceIds.add(id)));

    return {
      locale: locale.code,
      direction: locale.direction,
      generatedDate: new Date().toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' }),
      methodology: 'Hanafi',
      familySummary,
      estateValue: localizedResult.estateValue,
      eligibleHeirs,
      blockedHeirs,
      detailedSteps: localizedResult.detailedSteps,
      adjustments: localizedResult.adjustments.map((a) => a.description),
      sourceReferences: Array.from(sourceIds).map((id) => ({
        label: this.sourceRepository.findById(id)?.label ?? id,
        translation: this.sourceRepository.findById(id)?.translation ?? '',
      })),
      disclaimer: DISCLAIMER,
    };
  }
}
