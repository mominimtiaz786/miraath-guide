# Mirath Guide

A calm, scholarly, content-led Angular application that guides someone through calculating an
Islamic inheritance (Faraid) distribution according to the Hanafi school - one relevant question
at a time - and explains every share it produces.

> **Scholarly verification warning.** The rule engine in this repository is
> **reference-implementation verified, scholarly review pending**. It has been built directly
> from the normative rules in this README/spec and cross-checked against 20 golden fixtures
> (`GF-01`..`GF-20`, see `golden-fixtures.data.ts`) that match classical worked examples. It has
> **not** yet been signed off by named scholars. Do not present it, or any fork of it, as
> scholar-approved until that review has actually happened. See `/disclaimer` in the running app.

## What this is

- A fully client-side (no backend, no login, no analytics) guided calculator for who inherits,
  who is blocked, and exactly what fraction/percentage/amount each heir receives, with reasons
  and source references for every line.
- A small library of common-case examples and Faraid lessons, in the same visual system.
- A PDF/print-ready report generator, built entirely in the browser.

It deliberately does **not** implement: authentication, accounts, a backend, multiple madhhabs,
an AI chatbot, saved profiles, legal document generation, or public content submission.

## Setup

Requires Node 18.19+/20.11+/22+ and npm. (Built and tested against Node 20.20, Angular CLI 19.)

```bash
npm install
```

## Development commands

```bash
npm start            # ng serve - http://localhost:4200
npm test              # ng test - Karma + Jasmine, headless Chrome by default in CI
npx ng test --watch=false --browsers=ChromeHeadless   # single run, CI-style
npx ng lint            # @angular-eslint
npm run build           # production build -> dist/mirath-guide
npx ng build --configuration development  # unminified build, faster iteration
```

## Production build

`npm run build` produces an optimized, lazy-route-split bundle in `dist/mirath-guide`. As of this
writing the initial bundle is ~423 kB raw / ~103 kB gzipped; every feature page (home, wizard,
common cases, learn, methodology, results, etc.) and the PDF/report machinery are separate lazy
chunks loaded on demand, so the PDF library (`jspdf`, with its optional `html2canvas` dependency)
never loads until someone actually opens `/calculator/results`.

## Architecture overview

```
src/app/
  core/            # layout (header/footer), services (locale), guards, models shared app-wide
  shared/          # design-system components, icon system, generic utils (Fraction)
  features/
    home/
    calculator/
      pages/       # intro, wizard, review, results pages
      state/       # CalculatorStore (signals)
      routing/     # QuestionRouterService + wizard-steps.config.ts
      engine/      # the calculation engine (see below) + wizard question copy
      models/      # CalculatorAnswers, DerivedFacts, Heir/Share types, WizardStep types
    common-cases/
    learn/
    methodology/ / about/ / glossary/ / misc/ (privacy, disclaimer, 404)
    report/        # ReportMapperService + PdfReportService (jsPDF)
  data/            # static content: common-cases, lessons, glossary, sources
```

Every page component is standalone, `OnPush`, and lazy-loaded from `app.routes.ts`. Shared
presentational components live under `shared/components/*` (one folder per component) and never
import calculator business logic directly - they take plain inputs (`EligibleHeirShare`,
`ExplanationEntry`, etc.) and emit outputs.

## The rule engine

The engine is a small pipeline of pure functions, orchestrated by
`features/calculator/engine/calculation-engine.service.ts`, matching the order in spec section 22:

1. **`derive-facts.ts`** - `deriveFacts(answers)` computes `fatherFigure`, `maleDescendant`,
   `femaleDescendant`, `anyDescendant`, `totalSiblings`, `hasSpouseShare`. Nothing else in the
   engine re-derives these; they are computed once and threaded through.
2. **`fixed-share-engine.ts`** - `computeFixedShares(answers, facts)` assigns every Qur'anic fixed
   share (spouse, mother/father, grandmother, daughters/son's-daughters, full/half sisters,
   maternal siblings), including the Umariyyatayn special case.
3. **`asabah-engine.ts`** - `computeResiduaryChain(answers, facts, residue)` walks the 13
   residuary tiers in strict order (sons -> son's sons -> father/grandfather -> full brothers ->
   asabah ma'a al-ghayr -> paternal half-brothers -> nephews -> uncles -> cousins) and returns
   whichever single tier claims the residue.
4. **`adjustment-engine.ts`** - `applyAwl` (fixed shares exceed 1, scale everyone down) and
   `applyRadd` (residue left unclaimed, return it to non-spouse fixed-share heirs).
5. **`blocking-engine.ts`** - two functions: `computeRoutingBlockedCategories` (relatives never
   even asked about because a routing rule made them moot - "the father blocks all siblings") and
   `computeSpecificBlockedCases` (a count *was* collected but ended up with zero share - "two
   daughters block the son's daughter").
6. **`explanations/explanation-dictionary.ts` + `explanation-engine.ts`** - every `reasonCode`
   produced by the engines above resolves to a `{ simple, detailed, sourceRefs }` entry here. This
   is the one place English copy for a rule lives, which is what makes it a real localization seam
   (see below) rather than scattered template strings.

`CalculationEngineService.calculate(answers)` runs all of the above and returns a single
`CalculationResult`: `eligibleHeirs`, `blockedHeirs`, `adjustments`, `detailedSteps`,
`unassignedRemainder(+Note)`, and the resolved `explanations`.

All arithmetic uses `shared/utils/fraction.ts` (`Fraction`) - exact rational numbers with GCD
normalization, `toPercentage`/`toMoney` only at the display boundary. There is no floating-point
share arithmetic anywhere in the engine.

### Golden fixtures

`features/calculator/engine/golden-fixtures.data.ts` holds 20 fixtures (`GF-01`..`GF-20`) copied
from the normative spec, each an `ApprovedCaseFixture` (answers + expected final shares + expected
blocked heirs + expected adjustment). `calculation-engine.golden-fixtures.spec.ts` runs every one
through `CalculationEngineService` and asserts exact numerator/denominator matches. **Any change
to the engine must keep all 20 green.**

### The wizard, separately from the engine

`QuestionRouterService` decides which question comes next - it never calculates a share. It works
by filtering a static, ordered list (`wizard-steps.config.ts`) of `{ id, section, isVisible,
isAnswered }` against the current answers + derived facts, recomputed on every change (so editing
an earlier answer correctly reshapes what comes later). The one subtlety is the extended-family
"chain" (nephews/uncles/cousins): whether it's worth asking about at all is answered by a
sentinel trick (spec 13B.8) - `isChainOpen()` in `question-router.service.ts` adds a hypothetical
`halfCousinsCount: 1` to a *copy* of the current answers and asks the real engine whether that
sentinel would receive a positive share. If yes, there's genuine residue to distribute and the
chain questions are relevant; if no, they're skipped entirely.

`CalculatorStore` (Angular signals) is the only thing components talk to for wizard state:
`answers`, `currentStepId`, `result` are readonly signals; mutation only happens through
`setAnswer`, `goNext`/`goBack`, `calculate`, `resetCalculation`, `loadScenario`. It persists
in-progress answers to `sessionStorage` (never `localStorage`) so a reload doesn't lose progress,
and clears that storage on `resetCalculation()`.

## How to add a new wizard question

1. Add the field to `CalculatorAnswers` in `models/calculator-answers.model.ts` (and its default
   in `createEmptyAnswers()`).
2. Add a `WizardStepId` literal in `models/wizard-step.model.ts` - **use the exact same name as
   the `CalculatorAnswers` field** (the wizard page binds to answers generically by step id, so a
   mismatch here breaks the binding).
3. Add a `WizardStepDefinition` (section + `isVisible` + `isAnswered`) to `WIZARD_STEPS` in
   `routing/wizard-steps.config.ts`, in the position it should appear.
4. Add its copy (`question`, optional `helper`/`whyWeAsk`, and `kind: 'choice' | 'count' |
   'estate'`) to `WIZARD_QUESTION_CONTENT` in `engine/questions/wizard-question-content.ts`.
5. If it's a `'choice'` question with non-yes/no options, extend the branching in
   `wizard-page.component.html` the way `deceasedGender` is handled.

## How to add a new inheritance rule

Rules live in exactly one of the five engine files under `engine/` depending on what kind of rule
it is (fixed share -> `fixed-share-engine.ts`, residuary tier -> `asabah-engine.ts`, Awl/Radd ->
`adjustment-engine.ts`, blocking -> `blocking-engine.ts`). Give the new branch a `reasonCode`
string, add its `{ simple, detailed, sourceRefs }` to `EXPLANATION_DICTIONARY`, and **add a new
golden fixture** for it in `golden-fixtures.data.ts` with hand-verified expected fractions before
you trust the implementation. Never edit training-knowledge assumptions into the engine that
contradict section 13B of the original spec - that section is the single source of truth.

## How to add a common case

Add an entry to `COMMON_CASES` in `data/common-cases/common-cases.data.ts`: pick a unique `slug`
and the next `number`, a `heirs` array for the mini family tree, `keyShares` for the card, and the
detail-page fields (`scenario`, `eligibleHeirs`, `blockedHeirs`, `calculationSteps`,
`ruleExplanation`, `relatedConcepts`, `exampleEstate`, and `answers` so "Try this scenario in the
calculator" can preload the wizard via `CalculatorStore.loadScenario()`). **Compute the figures
from the engine/spec rules yourself** - do not copy numbers from a mockup or prior art without
checking them; several placeholder mockup numbers in this project's own source spec turned out to
be arithmetically wrong (e.g. an early "Umariyyatayn" mockup card) and were corrected against the
real rule set.

## How to add a lesson

Add an entry to `LESSONS` in `data/lessons/lessons.data.ts`: `slug`, `category` (must be one of
the `LessonCategory` union), an icon from `shared/icons/icon-registry.ts`, and one or more
`sections` (`heading` + `body`). The landing page's category filter and the lesson detail page
both read this array directly - no other wiring is needed.

## How to add a source reference

Add an entry to `SOURCE_REFERENCES` in `data/sources/sources.data.ts` keyed by a short id (e.g.
`'quran-4-11'`). Reference it from an engine reason code's `sourceRefs: ['your-id']` in
`explanation-dictionary.ts`, or from any `<app-source-reference>` / `<app-quran-reference-card>`
usage directly.

## PDF generation overview

`ReportMapperService.map(result)` converts a `CalculationResult` into a plain `ReportModel` (no
jsPDF types leak into it - it is just strings and numbers), then `PdfReportService` renders that
model with `jsPDF` (`generate`/`download`). `DownloadReportButtonComponent` is the only UI surface
that wires the two together. Keeping the mapping and the rendering as two separate services means
the report content can be unit-tested (or reused for a future non-PDF export) without touching
jsPDF at all. The print stylesheet (`styles/_print.css`) hides chrome (`.no-print`) for browser
Print as a lighter-weight alternative to the PDF.

## Localization approach

The UI is structured for English/Urdu today, not fully translated:

- `LocaleService` holds the current `AppLocale` (`'en' | 'ur'`), persisted per session, and flips
  `<html lang>`/`dir` between `ltr`/`rtl`.
- Fonts are already locale-aware: `--font-latin` (Inter), `--font-urdu` (Noto Sans Arabic),
  `--font-quranic` (Noto Naskh Arabic for Qur'anic quotations specifically), all self-hosted via
  `@fontsource/*` - no runtime requests to Google Fonts or any other third party.
- Every engine explanation string is centralized in one dictionary
  (`explanation-dictionary.ts`) precisely so a future Urdu pass has one place to translate from,
  instead of hunting through templates.
- **Known limitation:** actual Urdu translations of the UI copy and explanation dictionary are
  not included in this MVP - only the structural plumbing (locale signal, RTL, font stack) is.
  Populating `ur` copy is the natural next step and does not require touching any component.

## Known MVP limitations

- Grandmother eligibility is a user-confirmed count (0-2), not a full per-line blocking model.
- Paternal half-sisters do not act as asabah ma'a al-ghayr alongside daughters (a rare case where
  full sisters are absent) - see the note in `fixed-share-engine.ts`.
- Distant kindred (dhawil al-arham) are not distributed; an unclaimed surplus with no fixed-share
  heir to return it to is reported as `unassignedRemainderNote`, not divided further.
- Estate deductions (funeral costs, debts, wasiyyah) are not calculated - the wizard asks for the
  net distributable estate directly.
- Hanafi only; no other madhhab positions are modelled or mixed in.
- Urdu UI copy is structural only (see Localization above).

## Testing

`npm test` runs Jasmine/Karma. Coverage includes: `Fraction` arithmetic, `deriveFacts`, all 20
golden fixtures (fixed shares, asabah ordering, Awl, Radd, Umariyyatayn, blocking), the question
router's conditional skipping (father blocks grandfather, male descendant blocks siblings, mother
share sibling-count rule, chain gating), the `CalculatorStore` (answer resets, navigation,
calculate, reset, loadScenario), and component-level tests for the count selector, yes/no choice,
wizard question card (disabled Continue, focus movement), and share card rendering.
