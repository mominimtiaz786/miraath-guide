import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { FamilyTreeMiniComponent } from '../../../shared/components/family-tree-mini/family-tree-mini.component';
import { PrimaryButtonComponent } from '../../../shared/components/primary-button/primary-button.component';
import { AppIconComponent } from '../../../shared/icons/app-icon.component';
import { COMMON_CASES } from '../../../data/common-cases/common-cases.data';

@Component({
  selector: 'app-common-case-detail-page',
  standalone: true,
  imports: [RouterLink, FamilyTreeMiniComponent, PrimaryButtonComponent, AppIconComponent, DecimalPipe],
  templateUrl: './common-case-detail-page.component.html',
  styleUrl: './common-case-detail-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommonCaseDetailPageComponent {
  private readonly route = inject(ActivatedRoute);

  private readonly slug = toSignal(this.route.paramMap.pipe(map((params) => params.get('slug'))), {
    initialValue: null,
  });

  protected readonly case = computed(() => COMMON_CASES.find((c) => c.slug === this.slug()) ?? null);
}
