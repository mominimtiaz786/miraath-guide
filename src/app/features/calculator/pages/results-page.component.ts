import { UpperCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { PlatformService } from '../../../core/platform/platform.service';
import { ShareCardComponent } from '../../../shared/components/share-card/share-card.component';
import { BlockedHeirCardComponent } from '../../../shared/components/blocked-heir-card/blocked-heir-card.component';
import { CalculationChartComponent, ChartSegment } from '../../../shared/components/calculation-chart/calculation-chart.component';
import { PrimaryButtonComponent } from '../../../shared/components/primary-button/primary-button.component';
import { SecondaryButtonComponent } from '../../../shared/components/secondary-button/secondary-button.component';
import { DownloadReportButtonComponent } from '../../../shared/components/download-report-button/download-report-button.component';
import { InfoBannerComponent } from '../../../shared/components/info-banner/info-banner.component';
import { AppIconComponent } from '../../../shared/icons/app-icon.component';
import { CalculatorStore } from '../state/calculator-store.service';
import { ExplanationEngine } from '../engine/explanations/explanation-engine';
import { HeirLabelService } from '../models/heir-labels';
import { LocaleUrlService } from '../../../i18n/locale-url.service';
import { TranslationService } from '../../../i18n/translation.service';

type ResultTab = 'simple' | 'detailed';

@Component({
  selector: 'app-results-page',
  standalone: true,
  imports: [
    UpperCasePipe,
    ShareCardComponent,
    BlockedHeirCardComponent,
    CalculationChartComponent,
    PrimaryButtonComponent,
    SecondaryButtonComponent,
    DownloadReportButtonComponent,
    InfoBannerComponent,
    AppIconComponent,
    RouterLink,
  ],
  templateUrl: './results-page.component.html',
  styleUrl: './results-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResultsPageComponent {
  protected readonly store = inject(CalculatorStore);
  private readonly explanationEngine = inject(ExplanationEngine);
  private readonly router = inject(Router);
  protected readonly i18n = inject(TranslationService);
  protected readonly localeUrl = inject(LocaleUrlService);
  private readonly heirLabels = inject(HeirLabelService);
  private readonly platform = inject(PlatformService);

  /**
   * `window.print()` has no counterpart in a WebView - there is no print
   * dialog to open and the call is a no-op. Native users reach the same
   * outcome through the share sheet (AirPrint / Android print service), so
   * the button is hidden rather than left there doing nothing.
   */
  protected readonly canPrint = this.platform.isBrowser && !this.platform.isNative;

  protected readonly activeTab = signal<ResultTab>('simple');

  /**
   * Guarantees a result exists before the template reads one. The wizard's
   * normal path arrives here with a result already stored (the review page
   * calls `calculate()` before navigating), but a reload, a restored session,
   * or a native cold start into saved progress does not.
   *
   * Resolved in a field initializer rather than inside the computed below,
   * because `calculate()` writes signals and Angular rejects a signal write
   * inside a reactive computation (NG0600) - which used to blank this page
   * whenever it was opened directly.
   */
  private readonly ensuredResult = this.store.result() ?? this.store.calculate();

  protected readonly result = computed(() => this.store.result() ?? this.ensuredResult);

  protected readonly eligibleExplanations = computed(() => this.explanationEngine.buildEligibleExplanations(this.result().eligibleHeirs));
  protected readonly blockedExplanations = computed(() => this.explanationEngine.buildBlockedExplanations(this.result().blockedHeirs));

  protected readonly chartSegments = computed<ChartSegment[]>(() =>
    this.result().finalShares.map((share) => ({
      label: this.heirLabels.label(share.relationship, share.count),
      fraction: share.poolShare,
    })),
  );

  protected readonly uniqueBlockedByRelationship = computed(() => {
    const seen = new Set<string>();
    return this.result().blockedHeirs.filter((b) => {
      if (seen.has(b.relationship)) return false;
      seen.add(b.relationship);
      return true;
    });
  });

  setTab(tab: ResultTab): void {
    this.activeTab.set(tab);
  }

  print(): void {
    if (this.canPrint) {
      window.print();
    }
  }

  startAnother(): void {
    this.store.resetCalculation();
    this.router.navigateByUrl(this.localeUrl.localize('/calculator'));
  }

  editDetails(): void {
    this.router.navigateByUrl(this.localeUrl.localize('/calculator/review'));
  }
}
