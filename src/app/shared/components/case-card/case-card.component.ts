import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonCase } from '../../../data/common-cases/common-case.model';
import { LocaleUrlService } from '../../../i18n/locale-url.service';
import { TranslationService } from '../../../i18n/translation.service';
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
  protected readonly i18n = inject(TranslationService);
  protected readonly localeUrl = inject(LocaleUrlService);
}
