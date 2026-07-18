import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { ExplanationEntry } from '../../../features/calculator/models/calculation-result.model';
import { EligibleHeirShare, ShareType } from '../../../features/calculator/models/heir.model';
import { SourceReferenceComponent } from '../source-reference/source-reference.component';

const SHARE_TYPE_LABELS: Record<ShareType, string> = {
  fixed: 'Fixed share',
  residuary: 'Residuary (Asabah)',
  'fixed-plus-residue': 'Fixed share + residue',
  radd: 'Fixed share (Radd adjusted)',
};

@Component({
  selector: 'app-share-card',
  standalone: true,
  imports: [DecimalPipe, SourceReferenceComponent],
  templateUrl: './share-card.component.html',
  styleUrl: './share-card.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShareCardComponent {
  readonly share = input.required<EligibleHeirShare>();
  readonly explanation = input.required<ExplanationEntry>();
  readonly estateValue = input<number | null>(null);
  readonly detailed = input<boolean>(false);

  protected readonly shareTypeLabel = computed(() => SHARE_TYPE_LABELS[this.share().shareType]);
  protected readonly percentage = computed(() => this.share().poolShare.toPercentage(2));
  protected readonly moneyAmount = computed(() => {
    const estate = this.estateValue();
    return estate ? this.share().poolShare.toMoney(estate) : null;
  });
  protected readonly perPersonMoney = computed(() => {
    const amount = this.moneyAmount();
    return amount !== null && this.share().count > 0 ? amount / this.share().count : null;
  });
}
