import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { PlatformService } from '../../../core/platform/platform.service';
import { CalculationResult } from '../../../features/calculator/models/calculation-result.model';
import { ReportDeliveryService } from '../../../features/report/report-delivery.service';
import { ReportMapperService } from '../../../features/report/report-mapper.service';
import { TranslationService } from '../../../i18n/translation.service';
import { AppIconComponent } from '../../icons/app-icon.component';
import { AppIconName } from '../../icons/icon-registry';

@Component({
  selector: 'app-download-report-button',
  standalone: true,
  imports: [AppIconComponent],
  template: `
    <button type="button" class="btn btn-primary" [disabled]="busy()" (click)="deliver()">
      <app-icon [name]="icon()" [size]="18" color="var(--color-on-primary)" />
      {{ label() }}
    </button>
    @if (failed()) {
      <p class="delivery-error" role="alert">{{ i18n.t('results.shareFailed') }}</p>
    }
  `,
  styles: [
    `
      :host {
        display: inline-flex;
        flex-direction: column;
        gap: var(--space-2);
      }
      .delivery-error {
        font-size: var(--fs-helper);
        color: var(--color-text-secondary);
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DownloadReportButtonComponent {
  readonly result = input.required<CalculationResult>();

  private readonly reportMapper = inject(ReportMapperService);
  private readonly delivery = inject(ReportDeliveryService);
  private readonly platform = inject(PlatformService);
  protected readonly i18n = inject(TranslationService);

  protected readonly busy = signal(false);
  protected readonly failed = signal(false);

  /**
   * A WebView has no download manager, so on native the same report is
   * handed to the OS share sheet instead - the label and icon have to say so.
   */
  protected readonly label = computed(() =>
    this.platform.isNative ? this.i18n.t('results.share') : this.i18n.t('results.download'),
  );
  protected readonly icon = computed<AppIconName>(() => (this.platform.isNative ? 'Share2' : 'Download'));

  async deliver(): Promise<void> {
    if (this.busy()) {
      return;
    }
    this.busy.set(true);
    this.failed.set(false);
    try {
      const report = this.reportMapper.map(this.result());
      const outcome = await this.delivery.deliver(report, this.i18n.t('results.shareTitle'));
      this.failed.set(outcome === 'failed');
    } finally {
      this.busy.set(false);
    }
  }
}
