import { Injectable } from '@angular/core';
import { jsPDF } from 'jspdf';
import { ReportModel } from './report.model';

const GREEN: [number, number, number] = [23, 72, 63];
const GOLD: [number, number, number] = [195, 154, 82];
const CHARCOAL: [number, number, number] = [37, 43, 41];
const PAGE_WIDTH = 210;
const MARGIN = 18;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;

/** Browser-only PDF report generator (spec section 2). Rendering only - no inheritance logic lives here. */
@Injectable({ providedIn: 'root' })
export class PdfReportService {
  generate(report: ReportModel): jsPDF {
    const doc = new jsPDF({ unit: 'mm', format: 'a4' });
    let y = MARGIN;

    y = this.renderHeader(doc, report);
    y = this.renderFamilySummary(doc, report, y);
    y = this.renderHeirTable(doc, report, y, 'Eligible heirs', report.eligibleHeirs);
    y = this.renderBlockedTable(doc, report, y);
    y = this.renderDetailedSteps(doc, report, y);
    y = this.renderSources(doc, report, y);
    this.renderDisclaimerAndFooter(doc, report, y);

    return doc;
  }

  download(report: ReportModel, filename = 'mirath-guide-report.pdf'): void {
    this.generate(report).save(filename);
  }

  private ensureSpace(doc: jsPDF, y: number, needed: number): number {
    if (y + needed > 285) {
      doc.addPage();
      return MARGIN;
    }
    return y;
  }

  private renderHeader(doc: jsPDF, report: ReportModel): number {
    doc.setFillColor(...GREEN);
    doc.rect(0, 0, PAGE_WIDTH, 28, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('Mirath Guide', MARGIN, 15);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Understand. Calculate. Share fairly.', MARGIN, 22);

    doc.setTextColor(...CHARCOAL);
    let cursor = 36;
    doc.setFontSize(11);
    doc.text(`Inheritance Calculation Report`, MARGIN, cursor);
    cursor += 6;
    doc.setFontSize(9);
    doc.text(`Generated: ${report.generatedDate}`, MARGIN, cursor);
    doc.text(`Methodology: ${report.methodology}`, PAGE_WIDTH - MARGIN, cursor, { align: 'right' });
    cursor += 8;
    return cursor;
  }

  private renderFamilySummary(doc: jsPDF, report: ReportModel, y: number): number {
    let cursor = this.ensureSpace(doc, y, 20);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...GREEN);
    doc.text('Family Summary', MARGIN, cursor);
    cursor += 6;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(...CHARCOAL);
    for (const line of report.familySummary) {
      cursor = this.ensureSpace(doc, cursor, 6);
      doc.text(`- ${line}`, MARGIN, cursor);
      cursor += 5;
    }
    if (report.estateValue != null) {
      cursor = this.ensureSpace(doc, cursor, 6);
      doc.text(`- Distributable estate: PKR ${report.estateValue.toLocaleString()}`, MARGIN, cursor);
      cursor += 5;
    }
    return cursor + 4;
  }

  private renderHeirTable(
    doc: jsPDF,
    report: ReportModel,
    y: number,
    title: string,
    heirs: ReportModel['eligibleHeirs'],
  ): number {
    let cursor = this.ensureSpace(doc, y, 16);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...GREEN);
    doc.text(title, MARGIN, cursor);
    cursor += 7;

    for (const heir of heirs) {
      cursor = this.ensureSpace(doc, cursor, 18);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(...CHARCOAL);
      const amountText = heir.amount ? ` - ${heir.amount}` : '';
      doc.text(`${heir.relationship}: ${heir.fraction} (${heir.percentage})${amountText}`, MARGIN, cursor);
      cursor += 5;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(80, 85, 82);
      const reasonLines = doc.splitTextToSize(`${heir.shareType} - ${heir.reason}`, CONTENT_WIDTH);
      doc.text(reasonLines, MARGIN, cursor);
      cursor += reasonLines.length * 4 + 3;
    }
    return cursor + 3;
  }

  private renderBlockedTable(doc: jsPDF, report: ReportModel, y: number): number {
    if (report.blockedHeirs.length === 0) {
      return y;
    }
    let cursor = this.ensureSpace(doc, y, 16);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...GREEN);
    doc.text('Blocked heirs', MARGIN, cursor);
    cursor += 7;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(...CHARCOAL);
    for (const blocked of report.blockedHeirs) {
      cursor = this.ensureSpace(doc, cursor, 10);
      const lines = doc.splitTextToSize(`${blocked.relationship} - does not inherit: ${blocked.reason}`, CONTENT_WIDTH);
      doc.text(lines, MARGIN, cursor);
      cursor += lines.length * 4 + 2;
    }
    return cursor + 3;
  }

  private renderDetailedSteps(doc: jsPDF, report: ReportModel, y: number): number {
    let cursor = this.ensureSpace(doc, y, 16);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...GREEN);
    doc.text('Detailed calculation', MARGIN, cursor);
    cursor += 7;
    doc.setFontSize(8.5);
    for (const step of report.detailedSteps) {
      cursor = this.ensureSpace(doc, cursor, 8);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...CHARCOAL);
      doc.text(`${step.label}:`, MARGIN, cursor);
      doc.setFont('helvetica', 'normal');
      const lines = doc.splitTextToSize(step.value, CONTENT_WIDTH - 4);
      doc.text(lines, MARGIN, cursor + 4);
      cursor += 4 + lines.length * 4 + 2;
    }
    if (report.adjustments.length > 0) {
      cursor = this.ensureSpace(doc, cursor, 8);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...GOLD);
      doc.text('Adjustments applied:', MARGIN, cursor);
      cursor += 5;
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...CHARCOAL);
      for (const adjustment of report.adjustments) {
        cursor = this.ensureSpace(doc, cursor, 8);
        const lines = doc.splitTextToSize(`- ${adjustment}`, CONTENT_WIDTH);
        doc.text(lines, MARGIN, cursor);
        cursor += lines.length * 4 + 2;
      }
    }
    return cursor + 3;
  }

  private renderSources(doc: jsPDF, report: ReportModel, y: number): number {
    let cursor = this.ensureSpace(doc, y, 16);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...GREEN);
    doc.text('Sources and references', MARGIN, cursor);
    cursor += 7;
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...CHARCOAL);
    for (const source of report.sourceReferences) {
      cursor = this.ensureSpace(doc, cursor, 10);
      const lines = doc.splitTextToSize(`${source.label}: ${source.translation}`, CONTENT_WIDTH);
      doc.text(lines, MARGIN, cursor);
      cursor += lines.length * 4 + 2;
    }
    return cursor + 3;
  }

  private renderDisclaimerAndFooter(doc: jsPDF, report: ReportModel, y: number): void {
    let cursor = this.ensureSpace(doc, y, 30);
    doc.setDrawColor(...GOLD);
    doc.setLineWidth(0.5);
    doc.line(MARGIN, cursor, PAGE_WIDTH - MARGIN, cursor);
    cursor += 6;
    doc.setFontSize(8);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(...CHARCOAL);
    const disclaimerLines = doc.splitTextToSize(report.disclaimer, CONTENT_WIDTH);
    doc.text(disclaimerLines, MARGIN, cursor);
    cursor += disclaimerLines.length * 4 + 6;

    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(7.5);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(140, 140, 140);
      doc.text('Mirath Guide - reference-implementation verified, scholarly review pending.', MARGIN, 292);
      doc.text(`Page ${i} of ${pageCount}`, PAGE_WIDTH - MARGIN, 292, { align: 'right' });
    }
  }
}
