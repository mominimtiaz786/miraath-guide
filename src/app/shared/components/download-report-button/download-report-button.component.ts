import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { CalculationResult } from '../../../features/calculator/models/calculation-result.model';
import { PdfReportService } from '../../../features/report/pdf-report.service';
import { ReportMapperService } from '../../../features/report/report-mapper.service';
import { AppIconComponent } from '../../icons/app-icon.component';

@Component({
  selector: 'app-download-report-button',
  standalone: true,
  imports: [AppIconComponent],
  template: `
    <button type="button" class="btn btn-primary" (click)="download()">
      <app-icon name="Download" [size]="18" />
      Download PDF Report
    </button>
  `,
  styles: [':host { display: inline-flex; }'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DownloadReportButtonComponent {
  readonly result = input.required<CalculationResult>();

  private readonly reportMapper = inject(ReportMapperService);
  private readonly pdfService = inject(PdfReportService);

  download(): void {
    const report = this.reportMapper.map(this.result());
    this.pdfService.download(report);
  }
}
