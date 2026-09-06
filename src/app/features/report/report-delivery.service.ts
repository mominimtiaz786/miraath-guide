import { Injectable, inject } from '@angular/core';
import { jsPDF } from 'jspdf';
import { NativeBridgeService } from '../../core/platform/native-bridge.service';
import { PlatformService } from '../../core/platform/platform.service';
import { PdfReportService } from './pdf-report.service';
import { ReportModel } from './report.model';

export type ReportDeliveryOutcome = 'downloaded' | 'shared' | 'dismissed' | 'failed';

/**
 * Gets a generated report into the user's hands, whichever runtime we are in.
 *
 * On the web `jsPDF.save()` is fine - it triggers an ordinary browser
 * download. Inside a WebView that same call silently does nothing: there is
 * no download manager behind it and no error is raised, so the button would
 * simply appear broken. Native therefore takes a different route entirely -
 * write the bytes into the app's cache directory, then hand the resulting
 * file URI to the OS share sheet, which is also what lets the user save it
 * to Files/Drive, mail it, or print it via AirPrint.
 */
@Injectable({ providedIn: 'root' })
export class ReportDeliveryService {
  private readonly pdf = inject(PdfReportService);
  private readonly platform = inject(PlatformService);
  private readonly bridge = inject(NativeBridgeService);

  async deliver(report: ReportModel, title: string): Promise<ReportDeliveryOutcome> {
    // Async because non-Latin reports fetch and embed a script-specific TTF
    // before anything is drawn (see PdfReportService.configureFonts).
    const doc = await this.pdf.generate(report);
    const filename = `mirath-guide-report-${this.timestamp()}.pdf`;

    if (!this.platform.isNative) {
      doc.save(filename);
      return 'downloaded';
    }
    return this.shareNatively(doc, filename, title);
  }

  private async shareNatively(doc: jsPDF, filename: string, title: string): Promise<ReportDeliveryOutcome> {
    const [filesystem, share] = await Promise.all([this.bridge.filesystem(), this.bridge.share()]);
    if (!filesystem || !share) {
      return 'failed';
    }

    try {
      const { Filesystem, Directory } = filesystem.plugin;
      // Cache, not Documents: the file is a transient hand-off to the share
      // sheet, and the OS is free to reclaim it afterwards.
      await Filesystem.writeFile({
        path: filename,
        data: this.toBase64(doc),
        directory: Directory.Cache,
        recursive: true,
      });
      const { uri } = await Filesystem.getUri({ path: filename, directory: Directory.Cache });
      await share.plugin.share({ title, url: uri, dialogTitle: title });
      return 'shared';
    } catch (error) {
      // The share sheet rejects with an error when the user simply backs out
      // of it, which is not a failure worth surfacing as one.
      return this.isDismissal(error) ? 'dismissed' : 'failed';
    }
  }

  /**
   * jsPDF hands back `data:application/pdf;filename=...;base64,<payload>`.
   * Capacitor's Filesystem wants the bare payload.
   */
  private toBase64(doc: jsPDF): string {
    const dataUri = doc.output('datauristring');
    const marker = 'base64,';
    const index = dataUri.indexOf(marker);
    return index >= 0 ? dataUri.slice(index + marker.length) : dataUri;
  }

  private isDismissal(error: unknown): boolean {
    const message = error instanceof Error ? error.message : String(error ?? '');
    return /cancel|abort|dismiss/i.test(message);
  }

  private timestamp(): string {
    return new Date().toISOString().slice(0, 10);
  }
}
