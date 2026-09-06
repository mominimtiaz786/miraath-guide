import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { CalculationResult } from '../../../features/calculator/models/calculation-result.model';
import { PdfReportService } from '../../../features/report/pdf-report.service';
import { ReportMapperService } from '../../../features/report/report-mapper.service';
import { TranslationService } from '../../../i18n/translation.service';
import { AppIconComponent } from '../../icons/app-icon.component';

@Component({
  selector: 'app-download-report-button',
  standalone: true,
  imports: [AppIconComponent],
  template: `
    <button type="button" class="btn btn-primary" [disabled]="isDownloading()" (click)="download()">
      <app-icon name="Download" [size]="18" color="var(--color-on-primary)" />
      {{ i18n.t('results.download') }}
    </button>
  `,
  styles: [':host { display: inline-flex; }'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DownloadReportButtonComponent {
  readonly result = input.required<CalculationResult>();

  private readonly reportMapper = inject(ReportMapperService);
  private readonly pdfService = inject(PdfReportService);
  protected readonly i18n = inject(TranslationService);
  protected readonly isDownloading = signal(false);

  async download(): Promise<void> {
    if (this.isDownloading()) {
      return;
    }

    this.isDownloading.set(true);
    try {
      const report = this.reportMapper.map(this.result());
      await this.pdfService.download(report);
    } finally {
      this.isDownloading.set(false);
    }
  }
}
