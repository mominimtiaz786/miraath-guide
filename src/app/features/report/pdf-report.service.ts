import { Injectable } from '@angular/core';
import { jsPDF } from 'jspdf';
import { ReportModel } from './report.model';

const GREEN: [number, number, number] = [23, 72, 63];
const GOLD: [number, number, number] = [195, 154, 82];
const CHARCOAL: [number, number, number] = [37, 43, 41];
const PAGE_WIDTH = 210;
const MARGIN = 18;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;
const ARABIC_SCRIPT_PATTERN = /[\u0600-\u06ff\u0750-\u077f\u08a0-\u08ff]/;
const DEVANAGARI_PATTERN = /[\u0900-\u097f]/;

type PdfFontKey = 'latin' | 'arabic' | 'devanagari';
type TextOptions = Parameters<jsPDF['text']>[3];

const PDF_FONTS: Record<Exclude<PdfFontKey, 'latin'>, { family: string; files: Record<'normal' | 'bold' | 'italic', { file: string; url: string }> }> = {
  arabic: {
    family: 'MirathArabic',
    files: {
      normal: { file: 'dejavu-sans.ttf', url: '/fonts/dejavu-sans.ttf' },
      bold: { file: 'dejavu-sans-bold.ttf', url: '/fonts/dejavu-sans-bold.ttf' },
      italic: { file: 'dejavu-sans.ttf', url: '/fonts/dejavu-sans.ttf' },
    },
  },
  devanagari: {
    family: 'MirathDevanagari',
    files: {
      normal: { file: 'lohit-devanagari.ttf', url: '/fonts/lohit-devanagari.ttf' },
      bold: { file: 'lohit-devanagari.ttf', url: '/fonts/lohit-devanagari.ttf' },
      italic: { file: 'lohit-devanagari.ttf', url: '/fonts/lohit-devanagari.ttf' },
    },
  },
};

/** Browser-only PDF report generator (spec section 2). Rendering only - no inheritance logic lives here. */
@Injectable({ providedIn: 'root' })
export class PdfReportService {
  private readonly fontData = new Map<string, Promise<string>>();

  async generate(report: ReportModel): Promise<jsPDF> {
    const doc = new jsPDF({ unit: 'mm', format: 'a4' });
    const font = await this.configureFonts(doc, report);
    let y = MARGIN;

    y = this.renderHeader(doc, report, font);
    y = this.renderFamilySummary(doc, report, font, y);
    y = this.renderHeirTable(doc, report, font, y, 'Eligible heirs', report.eligibleHeirs);
    y = this.renderBlockedTable(doc, report, font, y);
    y = this.renderDetailedSteps(doc, report, font, y);
    y = this.renderSources(doc, report, font, y);
    this.renderDisclaimerAndFooter(doc, report, font, y);

    return doc;
  }

  async download(report: ReportModel, filename = 'mirath-guide-report.pdf'): Promise<void> {
    const doc = await this.generate(report);
    doc.save(filename);
  }

  private async configureFonts(doc: jsPDF, report: ReportModel): Promise<PdfFontKey> {
    const font = this.pickFont(report);

    if (font === 'latin') {
      return font;
    }

    const config = PDF_FONTS[font];
    for (const style of ['normal', 'bold', 'italic'] as const) {
      const file = config.files[style];
      const fontData = await this.loadFont(file.file, file.url);
      doc.addFileToVFS(file.file, fontData);
      doc.addFont(file.file, config.family, style === 'bold' ? 'normal' : style, style === 'bold' ? 'bold' : 'normal', 'Identity-H');
    }
    doc.setFont(config.family, 'normal');
    return font;
  }

  private pickFont(report: ReportModel): PdfFontKey {
    if (report.locale === 'hi' || this.reportContains(report, DEVANAGARI_PATTERN)) {
      return 'devanagari';
    }

    if (report.locale === 'ur' || report.locale === 'ar' || this.reportContains(report, ARABIC_SCRIPT_PATTERN)) {
      return 'arabic';
    }

    return 'latin';
  }

  private reportContains(report: ReportModel, pattern: RegExp): boolean {
    return [
      report.generatedDate,
      report.methodology,
      ...report.familySummary,
      ...report.eligibleHeirs.flatMap((heir) => [
        heir.relationship,
        heir.fraction,
        heir.percentage,
        heir.amount ?? '',
        heir.shareType,
        heir.reason,
      ]),
      ...report.blockedHeirs.flatMap((heir) => [heir.relationship, heir.reason]),
      ...report.detailedSteps.flatMap((step) => [step.label, step.value]),
      ...report.adjustments,
      ...report.sourceReferences.flatMap((source) => [source.label, source.translation]),
      report.disclaimer,
    ].some((value) => pattern.test(value));
  }

  private loadFont(file: string, url: string): Promise<string> {
    if (!this.fontData.has(file)) {
      this.fontData.set(
        file,
        fetch(url)
          .then((response) => {
            if (!response.ok) {
              throw new Error(`Unable to load PDF font: ${response.status} ${response.statusText}`);
            }
            return response.arrayBuffer();
          })
          .then((buffer) => this.arrayBufferToBase64(buffer)),
      );
    }

    return this.fontData.get(file)!;
  }

  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    const chunkSize = 0x8000;
    let binary = '';

    for (let offset = 0; offset < bytes.length; offset += chunkSize) {
      const chunk = bytes.subarray(offset, offset + chunkSize);
      binary += String.fromCharCode(...chunk);
    }

    return btoa(binary);
  }

  private setFont(doc: jsPDF, font: PdfFontKey, style: 'normal' | 'bold' | 'italic'): void {
    doc.setFont(font === 'latin' ? 'helvetica' : PDF_FONTS[font].family, style);
  }

  private splitTextToSize(doc: jsPDF, text: string, width: number): string[] {
    return doc.splitTextToSize(text, width) as string[];
  }

  private text(doc: jsPDF, text: string, x: number, y: number, options?: TextOptions): void {
    doc.text(text, x, y, options);
  }

  private textLines(doc: jsPDF, lines: string[], x: number, y: number, options?: TextOptions): void {
    doc.text(lines, x, y, options);
  }

  private ensureSpace(doc: jsPDF, y: number, needed: number): number {
    if (y + needed > 285) {
      doc.addPage();
      return MARGIN;
    }
    return y;
  }

  private renderHeader(doc: jsPDF, report: ReportModel, font: PdfFontKey): number {
    doc.setFillColor(...GREEN);
    doc.rect(0, 0, PAGE_WIDTH, 28, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    this.setFont(doc, font, 'bold');
    this.text(doc, 'Mirath Guide', MARGIN, 15);
    doc.setFontSize(10);
    this.setFont(doc, font, 'normal');
    this.text(doc, 'Understand. Calculate. Share fairly.', MARGIN, 22);

    doc.setTextColor(...CHARCOAL);
    let cursor = 36;
    doc.setFontSize(11);
    this.text(doc, 'Inheritance Calculation Report', MARGIN, cursor);
    cursor += 6;
    doc.setFontSize(9);
    this.text(doc, `Generated: ${report.generatedDate}`, MARGIN, cursor);
    this.text(doc, `Methodology: ${report.methodology}`, PAGE_WIDTH - MARGIN, cursor, { align: 'right' });
    cursor += 8;
    return cursor;
  }

  private renderFamilySummary(doc: jsPDF, report: ReportModel, font: PdfFontKey, y: number): number {
    let cursor = this.ensureSpace(doc, y, 20);
    doc.setFontSize(12);
    this.setFont(doc, font, 'bold');
    doc.setTextColor(...GREEN);
    this.text(doc, 'Family Summary', MARGIN, cursor);
    cursor += 6;
    this.setFont(doc, font, 'normal');
    doc.setFontSize(9);
    doc.setTextColor(...CHARCOAL);
    for (const line of report.familySummary) {
      cursor = this.ensureSpace(doc, cursor, 6);
      this.text(doc, `- ${line}`, MARGIN, cursor);
      cursor += 5;
    }
    if (report.estateValue != null) {
      cursor = this.ensureSpace(doc, cursor, 6);
      this.text(doc, `- Distributable estate: PKR ${report.estateValue.toLocaleString()}`, MARGIN, cursor);
      cursor += 5;
    }
    return cursor + 4;
  }

  private renderHeirTable(
    doc: jsPDF,
    report: ReportModel,
    font: PdfFontKey,
    y: number,
    title: string,
    heirs: ReportModel['eligibleHeirs'],
  ): number {
    let cursor = this.ensureSpace(doc, y, 16);
    doc.setFontSize(12);
    this.setFont(doc, font, 'bold');
    doc.setTextColor(...GREEN);
    this.text(doc, title, MARGIN, cursor);
    cursor += 7;

    for (const heir of heirs) {
      cursor = this.ensureSpace(doc, cursor, 18);
      this.setFont(doc, font, 'bold');
      doc.setFontSize(10);
      doc.setTextColor(...CHARCOAL);
      const amountText = heir.amount ? ` - ${heir.amount}` : '';
      this.text(doc, `${heir.relationship}: ${heir.fraction} (${heir.percentage})${amountText}`, MARGIN, cursor);
      cursor += 5;
      this.setFont(doc, font, 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(80, 85, 82);
      const reasonLines = this.splitTextToSize(doc, `${heir.shareType} - ${heir.reason}`, CONTENT_WIDTH);
      this.textLines(doc, reasonLines, MARGIN, cursor);
      cursor += reasonLines.length * 4 + 3;
    }
    return cursor + 3;
  }

  private renderBlockedTable(doc: jsPDF, report: ReportModel, font: PdfFontKey, y: number): number {
    if (report.blockedHeirs.length === 0) {
      return y;
    }
    let cursor = this.ensureSpace(doc, y, 16);
    doc.setFontSize(12);
    this.setFont(doc, font, 'bold');
    doc.setTextColor(...GREEN);
    this.text(doc, 'Blocked heirs', MARGIN, cursor);
    cursor += 7;
    this.setFont(doc, font, 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(...CHARCOAL);
    for (const blocked of report.blockedHeirs) {
      cursor = this.ensureSpace(doc, cursor, 10);
      const lines = this.splitTextToSize(doc, `${blocked.relationship} - does not inherit: ${blocked.reason}`, CONTENT_WIDTH);
      this.textLines(doc, lines, MARGIN, cursor);
      cursor += lines.length * 4 + 2;
    }
    return cursor + 3;
  }

  private renderDetailedSteps(doc: jsPDF, report: ReportModel, font: PdfFontKey, y: number): number {
    let cursor = this.ensureSpace(doc, y, 16);
    doc.setFontSize(12);
    this.setFont(doc, font, 'bold');
    doc.setTextColor(...GREEN);
    this.text(doc, 'Detailed calculation', MARGIN, cursor);
    cursor += 7;
    doc.setFontSize(8.5);
    for (const step of report.detailedSteps) {
      cursor = this.ensureSpace(doc, cursor, 8);
      this.setFont(doc, font, 'bold');
      doc.setTextColor(...CHARCOAL);
      this.text(doc, `${step.label}:`, MARGIN, cursor);
      this.setFont(doc, font, 'normal');
      const lines = this.splitTextToSize(doc, step.value, CONTENT_WIDTH - 4);
      this.textLines(doc, lines, MARGIN, cursor + 4);
      cursor += 4 + lines.length * 4 + 2;
    }
    if (report.adjustments.length > 0) {
      cursor = this.ensureSpace(doc, cursor, 8);
      this.setFont(doc, font, 'bold');
      doc.setTextColor(...GOLD);
      this.text(doc, 'Adjustments applied:', MARGIN, cursor);
      cursor += 5;
      this.setFont(doc, font, 'normal');
      doc.setTextColor(...CHARCOAL);
      for (const adjustment of report.adjustments) {
        cursor = this.ensureSpace(doc, cursor, 8);
        const lines = this.splitTextToSize(doc, `- ${adjustment}`, CONTENT_WIDTH);
        this.textLines(doc, lines, MARGIN, cursor);
        cursor += lines.length * 4 + 2;
      }
    }
    return cursor + 3;
  }

  private renderSources(doc: jsPDF, report: ReportModel, font: PdfFontKey, y: number): number {
    let cursor = this.ensureSpace(doc, y, 16);
    doc.setFontSize(12);
    this.setFont(doc, font, 'bold');
    doc.setTextColor(...GREEN);
    this.text(doc, 'Sources and references', MARGIN, cursor);
    cursor += 7;
    doc.setFontSize(8.5);
    this.setFont(doc, font, 'normal');
    doc.setTextColor(...CHARCOAL);
    for (const source of report.sourceReferences) {
      cursor = this.ensureSpace(doc, cursor, 10);
      const lines = this.splitTextToSize(doc, `${source.label}: ${source.translation}`, CONTENT_WIDTH);
      this.textLines(doc, lines, MARGIN, cursor);
      cursor += lines.length * 4 + 2;
    }
    return cursor + 3;
  }

  private renderDisclaimerAndFooter(doc: jsPDF, report: ReportModel, font: PdfFontKey, y: number): void {
    let cursor = this.ensureSpace(doc, y, 30);
    doc.setDrawColor(...GOLD);
    doc.setLineWidth(0.5);
    doc.line(MARGIN, cursor, PAGE_WIDTH - MARGIN, cursor);
    cursor += 6;
    doc.setFontSize(8);
    this.setFont(doc, font, 'italic');
    doc.setTextColor(...CHARCOAL);
    const disclaimerLines = this.splitTextToSize(doc, report.disclaimer, CONTENT_WIDTH);
    this.textLines(doc, disclaimerLines, MARGIN, cursor);
    cursor += disclaimerLines.length * 4 + 6;

    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(7.5);
      this.setFont(doc, font, 'normal');
      doc.setTextColor(140, 140, 140);
      this.text(doc, 'Mirath Guide - reference-implementation verified, scholarly review pending.', MARGIN, 292);
      this.text(doc, `Page ${i} of ${pageCount}`, PAGE_WIDTH - MARGIN, 292, { align: 'right' });
    }
  }
}
