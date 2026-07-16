import { UpperCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ShareCardComponent } from '../../../shared/components/share-card/share-card.component';
import { BlockedHeirCardComponent } from '../../../shared/components/blocked-heir-card/blocked-heir-card.component';
import { CalculationChartComponent, ChartSegment } from '../../../shared/components/calculation-chart/calculation-chart.component';
import { PrimaryButtonComponent } from '../../../shared/components/primary-button/primary-button.component';
import { SecondaryButtonComponent } from '../../../shared/components/secondary-button/secondary-button.component';
import { DownloadReportButtonComponent } from '../../../shared/components/download-report-button/download-report-button.component';
import { AppIconComponent } from '../../../shared/icons/app-icon.component';
import { CalculatorStore } from '../state/calculator-store.service';
import { ExplanationEngine } from '../engine/explanations/explanation-engine';
import { heirLabel } from '../models/heir-labels';

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
    AppIconComponent,
  ],
  templateUrl: './results-page.component.html',
  styleUrl: './results-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResultsPageComponent {
  protected readonly store = inject(CalculatorStore);
  private readonly explanationEngine = inject(ExplanationEngine);
  private readonly router = inject(Router);

  protected readonly activeTab = signal<ResultTab>('simple');

  protected readonly result = computed(() => this.store.result() ?? this.store.calculate());

  protected readonly eligibleExplanations = computed(() => this.explanationEngine.buildEligibleExplanations(this.result().eligibleHeirs));
  protected readonly blockedExplanations = computed(() => this.explanationEngine.buildBlockedExplanations(this.result().blockedHeirs));

  protected readonly chartSegments = computed<ChartSegment[]>(() =>
    this.result().finalShares.map((share) => ({
      label: heirLabel(share.relationship, share.count),
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
    window.print();
  }

  startAnother(): void {
    this.store.resetCalculation();
    this.router.navigateByUrl('/calculator');
  }

  editDetails(): void {
    this.router.navigateByUrl('/calculator/review');
  }
}
