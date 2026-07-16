import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonCase } from '../../../data/common-cases/common-case.model';
import { AppIconComponent } from '../../icons/app-icon.component';
import { FamilyTreeMiniComponent } from '../family-tree-mini/family-tree-mini.component';

@Component({
  selector: 'app-case-card',
  standalone: true,
  imports: [RouterLink, AppIconComponent, FamilyTreeMiniComponent],
  templateUrl: './case-card.component.html',
  styleUrl: './case-card.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CaseCardComponent {
  readonly case = input.required<CommonCase>();
}
