import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { Fraction } from '../../utils/fraction';

export interface ChartSegment {
  label: string;
  fraction: Fraction;
}

interface RenderedSegment extends ChartSegment {
  percentage: number;
  color: string;
  dashArray: string;
  dashOffset: number;
}

const PALETTE = [
  '#17483f',
  '#c39a52',
  'rgba(23, 72, 63, 0.55)',
  'rgba(195, 154, 82, 0.55)',
  'rgba(23, 72, 63, 0.3)',
  '#252b29',
];

const CIRCUMFERENCE = 2 * Math.PI * 60;

/**
 * Responsive donut chart for the results page. Never relies on color alone:
 * every segment gets a visible label and the accessible table fallback
 * below the SVG carries the same information as plain text (spec section 16, 26).
 */
@Component({
  selector: 'app-calculation-chart',
  standalone: true,
  templateUrl: './calculation-chart.component.html',
  styleUrl: './calculation-chart.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalculationChartComponent {
  readonly segments = input.required<ChartSegment[]>();

  protected readonly circumference = CIRCUMFERENCE;

  protected readonly rendered = computed<RenderedSegment[]>(() => {
    let cumulative = 0;
    return this.segments().map((segment, index) => {
      const percentage = segment.fraction.toPercentage(4);
      const length = (percentage / 100) * CIRCUMFERENCE;
      const dashArray = `${length} ${CIRCUMFERENCE - length}`;
      const dashOffset = -cumulative;
      cumulative += length;
      return {
        ...segment,
        percentage: segment.fraction.toPercentage(2),
        color: PALETTE[index % PALETTE.length],
        dashArray,
        dashOffset,
      };
    });
  });
}
