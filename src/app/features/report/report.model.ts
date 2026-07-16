export interface ReportHeirLine {
  relationship: string;
  fraction: string;
  percentage: string;
  amount: string | null;
  shareType: string;
  reason: string;
}

export interface ReportBlockedLine {
  relationship: string;
  reason: string;
}

export interface ReportModel {
  generatedDate: string;
  methodology: string;
  familySummary: string[];
  estateValue: number | null;
  eligibleHeirs: ReportHeirLine[];
  blockedHeirs: ReportBlockedLine[];
  detailedSteps: { label: string; value: string }[];
  adjustments: string[];
  sourceReferences: { label: string; translation: string }[];
  disclaimer: string;
}
