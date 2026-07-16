import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { AppIconComponent } from '../../icons/app-icon.component';
import { AppIconName } from '../../icons/icon-registry';

export interface FamilyTreeMiniHeir {
  label: string;
  icon?: AppIconName;
}

/**
 * A small, accessible family-tree diagram: the deceased on top, connected
 * down to the heirs relevant to a given case. Always paired with a text
 * summary so the diagram is never the only way to understand the case
 * (spec sections 9 and 26 - printable/accessible fallback for visual trees).
 */
@Component({
  selector: 'app-family-tree-mini',
  standalone: true,
  imports: [AppIconComponent],
  templateUrl: './family-tree-mini.component.html',
  styleUrl: './family-tree-mini.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FamilyTreeMiniComponent {
  readonly heirs = input.required<FamilyTreeMiniHeir[]>();
  readonly rootLabel = input<string>('Deceased');

  protected readonly ariaLabel = computed(() => {
    const labels = this.heirs()
      .map((h) => h.label)
      .join(', ');
    return `Family tree: deceased connected to ${this.heirs().length} heir group(s): ${labels}`;
  });
}
