import { Injectable, computed, inject, signal } from '@angular/core';
import { CalculationEngineService } from '../engine/calculation-engine.service';
import { deriveFacts } from '../engine/derive-facts';
import { CalculatorAnswers, createEmptyAnswers } from '../models/calculator-answers.model';
import { CalculationResult } from '../models/calculation-result.model';
import { WizardStepId } from '../models/wizard-step.model';
import { QuestionRouterService } from '../routing/question-router.service';

const SESSION_STORAGE_KEY = 'mirath-guide.wizard-answers';

/**
 * Application-level calculator state (spec section 24). All mutation goes
 * through explicit methods; components only ever see readonly signals.
 */
@Injectable({ providedIn: 'root' })
export class CalculatorStore {
  private readonly router = inject(QuestionRouterService);
  private readonly engine = inject(CalculationEngineService);

  private readonly initialState = this.readPersistedState();
  private readonly answers_ = signal<CalculatorAnswers>(this.initialState.answers);
  private readonly currentStepId_ = signal<WizardStepId>(this.initialState.stepId);
  private readonly result_ = signal<CalculationResult | null>(null);
  private readonly calculationErrors_ = signal<string[]>([]);

  readonly answers = this.answers_.asReadonly();
  readonly currentStepId = this.currentStepId_.asReadonly();
  readonly result = this.result_.asReadonly();
  readonly calculationErrors = this.calculationErrors_.asReadonly();

  readonly derivedFacts = computed(() => deriveFacts(this.answers_()));
  readonly currentSection = computed(() => this.router.getSection(this.currentStepId_()));
  readonly visibleSteps = computed(() => this.router.getVisibleSteps(this.answers_()));
  readonly canGoNext = computed(() => this.router.isAnswered(this.currentStepId_(), this.answers_()));
  readonly isLastStep = computed(() => this.router.isLastStep(this.currentStepId_(), this.answers_()));
  readonly progressPercent = computed(() => this.router.getOverallProgress(this.currentStepId_(), this.answers_()));
  readonly sectionProgress = computed(() =>
    this.router.getStepNumberInSection(this.currentStepId_(), this.answers_()),
  );

  setAnswer<K extends keyof CalculatorAnswers>(key: K, value: CalculatorAnswers[K]): void {
    this.answers_.update((current) => {
      const next: CalculatorAnswers = { ...current, [key]: value };
      if (key === 'hasDescendants' && value === false) {
        next.sonsCount = 0;
        next.daughtersCount = 0;
        next.paternalGrandsonsCount = 0;
        next.paternalGranddaughtersCount = 0;
      }
      if (key === 'sonsCount' && (value as number) > 0) {
        next.paternalGrandsonsCount = 0;
        next.paternalGranddaughtersCount = 0;
      }
      if (key === 'fatherAlive' && value === true) {
        next.paternalGrandfatherAlive = null;
      }
      if (key === 'motherAlive' && value === true) {
        next.grandmothersCount = null;
      }
      return next;
    });
    this.persist();
  }

  goNext(): 'continue' | 'review' {
    const current = this.currentStepId_();
    const answers = this.answers_();
    const next = this.router.getNextStep(current, answers);
    if (next === null) {
      return 'review';
    }
    this.currentStepId_.set(next);
    this.persist();
    return 'continue';
  }

  goBack(): boolean {
    const current = this.currentStepId_();
    const answers = this.answers_();
    const previous = this.router.getPreviousStep(current, answers);
    if (previous === null) {
      return false;
    }
    this.currentStepId_.set(previous);
    this.persist();
    return true;
  }

  goToStep(stepId: WizardStepId): void {
    this.currentStepId_.set(stepId);
  }

  calculate(): CalculationResult {
    const result = this.engine.calculate(this.answers_());
    this.result_.set(result);
    this.calculationErrors_.set(result.validationWarnings);
    return result;
  }

  resetCalculation(): void {
    const empty = createEmptyAnswers();
    this.answers_.set(empty);
    this.currentStepId_.set(this.router.getFirstStep(empty));
    this.result_.set(null);
    this.calculationErrors_.set([]);
    try {
      sessionStorage.removeItem(SESSION_STORAGE_KEY);
    } catch {
      // sessionStorage may be unavailable - in-memory state is already cleared.
    }
  }

  /** Preloads the wizard with a common case's answers (spec section 24 example). */
  loadScenario(scenarioAnswers: Partial<CalculatorAnswers>): void {
    const merged: CalculatorAnswers = { ...createEmptyAnswers(), ...scenarioAnswers };
    this.answers_.set(merged);
    this.currentStepId_.set(this.router.getFirstStep(merged));
    this.result_.set(null);
    this.persist();
  }

  private persist(): void {
    try {
      sessionStorage.setItem(
        SESSION_STORAGE_KEY,
        JSON.stringify({ answers: this.answers_(), stepId: this.currentStepId_() }),
      );
    } catch {
      // sessionStorage may be unavailable (private browsing) - progress simply won't survive a reload.
    }
  }

  private readPersistedState(): { answers: CalculatorAnswers; stepId: WizardStepId } {
    try {
      const raw = sessionStorage.getItem(SESSION_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as { answers: CalculatorAnswers; stepId: WizardStepId };
        const answers = { ...createEmptyAnswers(), ...parsed.answers };
        const visible = this.router.getVisibleSteps(answers);
        const stepId = visible.includes(parsed.stepId) ? parsed.stepId : this.router.getFirstStep(answers);
        return { answers, stepId };
      }
    } catch {
      // Corrupt or unavailable storage - fall back to a fresh calculation.
    }
    const answers = createEmptyAnswers();
    return { answers, stepId: this.router.getFirstStep(answers) };
  }
}
