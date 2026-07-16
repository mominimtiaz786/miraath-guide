import { Injectable, inject } from '@angular/core';
import { CalculationEngineService } from '../engine/calculation-engine.service';
import { deriveFacts } from '../engine/derive-facts';
import { CalculatorAnswers } from '../models/calculator-answers.model';
import { WizardSection, WizardStepId } from '../models/wizard-step.model';
import { RouterContext, WIZARD_STEPS } from './wizard-steps.config';

/**
 * Determines which wizard question comes next, previous, or is currently
 * relevant, based purely on the answers given so far. Never calculates
 * inheritance shares itself (that is the CalculationEngineService's job) -
 * it only decides which questions are worth asking.
 */
@Injectable({ providedIn: 'root' })
export class QuestionRouterService {
  private readonly engine = inject(CalculationEngineService);

  private buildContext(answers: CalculatorAnswers): RouterContext {
    const facts = deriveFacts(answers);
    const chainOpen = this.isChainOpen(answers, facts);
    return { answers, facts, chainOpen };
  }

  /**
   * Spec 13B.8 sentinel: add a hypothetical lowest-tier heir (half cousin)
   * and see if they would receive a positive share. If so, residue exists
   * and the extended-family chain questions are worth asking.
   */
  private isChainOpen(answers: CalculatorAnswers, facts: ReturnType<typeof deriveFacts>): boolean {
    if (facts.fatherFigure || facts.maleDescendant) {
      return false;
    }
    if (answers.fullBrothersCount > 0 || answers.paternalHalfBrothersCount > 0) {
      return false;
    }
    if (answers.fullSistersCount > 0 && facts.femaleDescendant) {
      return false;
    }
    const sentinelAnswers: CalculatorAnswers = { ...answers, halfCousinsCount: 1 };
    const result = this.engine.calculate(sentinelAnswers);
    // The orchestrator already filters out zero shares, so finding the
    // sentinel here means it received a genuinely positive share.
    return result.finalShares.some((s) => s.relationship === 'halfCousin');
  }

  getVisibleSteps(answers: CalculatorAnswers): WizardStepId[] {
    const ctx = this.buildContext(answers);
    return WIZARD_STEPS.filter((step) => step.isVisible(ctx)).map((step) => step.id);
  }

  getSection(stepId: WizardStepId): WizardSection {
    return WIZARD_STEPS.find((step) => step.id === stepId)?.section ?? 'review';
  }

  isAnswered(stepId: WizardStepId, answers: CalculatorAnswers): boolean {
    const step = WIZARD_STEPS.find((s) => s.id === stepId);
    return step ? step.isAnswered(answers) : true;
  }

  getFirstStep(answers: CalculatorAnswers): WizardStepId {
    return this.getVisibleSteps(answers)[0];
  }

  getNextStep(currentId: WizardStepId, answers: CalculatorAnswers): WizardStepId | null {
    const visible = this.getVisibleSteps(answers);
    const index = visible.indexOf(currentId);
    if (index === -1 || index === visible.length - 1) {
      return null;
    }
    return visible[index + 1];
  }

  getPreviousStep(currentId: WizardStepId, answers: CalculatorAnswers): WizardStepId | null {
    const visible = this.getVisibleSteps(answers);
    const index = visible.indexOf(currentId);
    if (index <= 0) {
      return null;
    }
    return visible[index - 1];
  }

  isLastStep(currentId: WizardStepId, answers: CalculatorAnswers): boolean {
    const visible = this.getVisibleSteps(answers);
    return visible.indexOf(currentId) === visible.length - 1;
  }

  getStepNumberInSection(stepId: WizardStepId, answers: CalculatorAnswers): { index: number; total: number } {
    const ctx = this.buildContext(answers);
    const section = this.getSection(stepId);
    const stepsInSection = WIZARD_STEPS.filter((step) => step.section === section && step.isVisible(ctx));
    const index = stepsInSection.findIndex((step) => step.id === stepId);
    return { index: index + 1, total: stepsInSection.length };
  }

  getOverallProgress(stepId: WizardStepId, answers: CalculatorAnswers): number {
    const visible = this.getVisibleSteps(answers);
    const index = visible.indexOf(stepId);
    if (visible.length === 0 || index === -1) {
      return 0;
    }
    return Math.round(((index + 1) / (visible.length + 1)) * 100);
  }
}
