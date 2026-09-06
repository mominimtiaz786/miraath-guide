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
npx ng build mirath-guide --configuration development  # unminified build, faster iteration
```

The workspace holds two Angular projects, so every `ng` command needs one named
explicitly (Angular removed `defaultProject` in v17):

- `mirath-guide` - the web build, with SSR, prerendering and SEO. The default for `npm start`/`npm run build`.
- `mirath-guide-app` - the static build packaged into the iOS/Android apps. See below.

## Production build

`npm run build` produces an optimized, lazy-route-split bundle in `dist/mirath-guide`. As of this
writing the initial bundle is ~423 kB raw / ~103 kB gzipped; every feature page (home, wizard,
common cases, learn, methodology, results, etc.) and the PDF/report machinery are separate lazy
chunks loaded on demand, so the PDF library (`jspdf`, with its optional `html2canvas` dependency)
never loads until someone actually opens `/calculator/results`.

## Mobile app (iOS / Android)

The same Angular codebase ships as a native app through [Capacitor](https://capacitorjs.com).
There is no Ionic UI layer: the app keeps its own design system, RTL typography and components
verbatim, and Capacitor supplies only the native runtime.

```bash
npm run build:app     # static build -> dist/mirath-guide-app/browser
npm run sync:app      # build, then copy into android/ and ios/
npm run android       # sync, then open Android Studio
npm run ios           # sync, then open Xcode (macOS only)
npm run start:app     # serve the app build in a browser, for layout work
npm run gen:assets    # regenerate launcher icons and splash screens
```

### Android build toolchain

AGP 8.7.2 / Gradle 8.11.1 need **JDK 17+** (Ubuntu 20.04 still ships 11) and an Android SDK with
API 35. Both live under your home directory - nothing is installed system-wide, nothing needs
`sudo`, and nothing is on your `PATH` until you source the env script, so it behaves like a
per-shell environment rather than a global install:

```bash
npm run apk               # Angular build -> cap sync -> gradle, in one step
npm run apk -- --install  # ...and push it to a connected phone or emulator
```

That drops `miraath-guide-debug.apk` in the repo root, ready to copy onto a phone (it is
debug-signed, so Android will ask you to allow installs from that source). The script sources the
toolchain itself, so it works from a plain shell. Run it after *any* change - Angular code,
`capacitor.config.ts`, a plugin, or the native projects; the `cap sync` step is what stops the web
bundle inside `android/` going stale. Incremental rebuilds take ~15s.

Only touched native Android code (`MainActivity`, `res/`)? `cd android && ./gradlew assembleDebug`
is enough. The equivalent long form of the above is:

```bash
source scripts/android-env.sh          # JAVA_HOME, ANDROID_HOME, PATH
npm run sync:app
cd android && ./gradlew assembleDebug  # -> app/build/outputs/apk/debug/app-debug.apk
```

| | Path | Notes |
|---|---|---|
| JDK | `~/.local/opt/jdk-21` | Eclipse Temurin 21 (LTS), checksum-verified against the Adoptium API |
| SDK | `~/Android/Sdk` | the standard location, so Android Studio picks it up unchanged |

Packages installed: `platform-tools`, `platforms;android-35`, `build-tools;35.0.0`. Setting this
up accepted the Android SDK licences non-interactively - `sdkmanager --licenses` will show you
what was agreed to.

iOS needs macOS, Xcode and CocoaPods, none of which exist on Linux.

### How the app build differs from the web build

| | `mirath-guide` (web) | `mirath-guide-app` (native) |
|---|---|---|
| Entry document | `src/index.html` | `src/index.app.html` |
| Rendering | SSR + prerender, `outputMode: server` | static, client-rendered |
| Environment | `environments/environment.ts` | `environment.app.ts` (swapped via `fileReplacements`) |
| Analytics | Google Analytics tag | none - a third-party request that fails offline and would pull the listing into store data disclosures |
| SEO | canonical, hreflang, Open Graph, JSON-LD | skipped (`environment.enableSeo`); a WebView has no crawler |
| `robots.txt` / `sitemap.xml` | shipped | excluded from assets |
| Viewport | standard | `viewport-fit=cover`, so `env(safe-area-inset-*)` reports real values |

### What changes at runtime on native

All of it funnels through `core/platform/`, and every branch is a no-op on the web.

- **`PlatformService`** - reads Capacitor's injected `window.Capacitor` global rather than
  importing `@capacitor/core`, so the web bundle contains no Capacitor code at all.
- **`NativeBridgeService`** - the only place plugins are loaded, always via dynamic `import()`
  behind an `isNative` check. The web build never downloads a plugin chunk.
- **`AppStorageService`** - a WebView's `sessionStorage` dies with the app process, which would
  throw away a half-finished wizard just for backgrounding the app. On native both scopes use
  `localStorage`, mirrored write-behind into Capacitor `Preferences` so state also survives the
  storage eviction iOS performs on unused apps. The API stays synchronous because
  `CalculatorStore` and `LocaleService` both read persisted state while building initial signals.
- **`NativeShellService`** - status bar theming, the splash hand-off after first paint, the
  Android hardware back button (unwind history, exit only from the root), and the redirect into
  the stored language on launch.
- **`ReportDeliveryService`** - `jsPDF.save()` is a browser download and silently does nothing in
  a WebView. On native the PDF is written to the app cache directory and handed to the OS share
  sheet instead (which is also the route to AirPrint / Android printing, so the Print button is
  hidden there). The Android `FileProvider` and its `cache-path` entry are what make the file URI
  shareable.
- **`LanguageGateComponent`** - on the web the URL answers "which language" (`/ur/learn` *is* the
  Urdu page). An app launch has no such signal, so a first-run picker asks once, pre-selected from
  the device language, and `LocalePreferenceService` persists the answer.

Safe areas are exposed as `--safe-area-*` tokens in `_tokens.css` and resolve to `0px` on the web.
Horizontal insets are applied once on `main#main-content`; the header, footer and the chrome-less
wizard handle their own vertical clearance.

**Android handles system bars natively, not in CSS.** Android 15 (targetSdk 35) forces every app
edge-to-edge and ignores both `StatusBar.setOverlaysWebView(false)` and `setBackgroundColor` - yet
its WebView still reports `env(safe-area-inset-*)` as `0px` (measured on device). The page
therefore has no way to reserve the strip itself, and the sticky header ends up under the clock.
`MainActivity` pads the content view from the real window insets instead, and paints that padding
brand green. iOS keeps the CSS route, where `env()` reports honestly.

### Two URL shapes, deliberately

`LocaleUrlService` exposes both, and they must not be confused:

- `localize()` - what the Router parses. A locale root is **`/ur`**, no trailing slash.
- `canonical()` - what crawlers see. A locale root is **`/ur/`**, matching the sitemap and every
  canonical tag already indexed.

Angular's `UrlSerializer` reads `/ur/` as a trailing *empty* segment, which matches no route and
silently lands on the 404 page - no error, no warning. Using the canonical form for navigation
broke the header logo, the language switcher and the app's first-run language picker in every
non-English locale. `locale-url.service.spec.ts` pins both shapes down.

### Icons and splash screens

`assets/*.svg` are the source art; `npm run gen:assets` rasterises them into every slot the two
native projects reference (iOS marketing icon and splash imageset, Android launcher + round +
adaptive-foreground mipmaps across five densities, and portrait/landscape splash drawables).
The mark is Lucide's `book-open-check` - the same glyph as the site header - in ivory with a gold
check on brand green. Edit the SVGs, never the generated PNGs.

This replaces `@capacitor/assets`, which pins a `sharp` version that has no prebuilt binary for
current Node and so cannot install.

### Still to do before submitting to the stores

- Signing: an Android upload keystore, and an Apple distribution certificate + provisioning profile.
- Store listings, screenshots, and a data-safety / privacy-nutrition declaration - the app
  collects nothing and makes no network requests, which makes that form short.
- Test on iOS. Nothing on that side has been compiled or run - it needs macOS, Xcode and
  CocoaPods. Android has been built and exercised on an Android 15 emulator: first-run language
  picker, locale persistence through Capacitor `Preferences`, RTL rendering, state restored from
  `localStorage` on cold start, PDF generation with the embedded Arabic font, the OS share sheet,
  and the hardware back button.

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
