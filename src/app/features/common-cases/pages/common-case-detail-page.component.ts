import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { FamilyTreeMiniComponent } from '../../../shared/components/family-tree-mini/family-tree-mini.component';
import { PrimaryButtonComponent } from '../../../shared/components/primary-button/primary-button.component';
import { AppIconComponent } from '../../../shared/icons/app-icon.component';
import { SeoService } from '../../../core/seo/seo.service';
import { CommonCaseRepository } from '../../../data/common-cases/common-case.repository';
import { GlossaryRepository } from '../../../data/glossary/glossary.repository';
import { LocaleUrlService } from '../../../i18n/locale-url.service';
import { TranslationService } from '../../../i18n/translation.service';

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
  private readonly seo = inject(SeoService);
  private readonly commonCases = inject(CommonCaseRepository);
  private readonly glossary = inject(GlossaryRepository);
  protected readonly i18n = inject(TranslationService);
  protected readonly localeUrl = inject(LocaleUrlService);

  private readonly slug = toSignal(this.route.paramMap.pipe(map((params) => params.get('slug'))), {
    initialValue: null,
  });

  protected readonly case = computed(() => this.commonCases.findBySlug(this.slug()));
  protected readonly relatedConcepts = computed(() => this.case()?.relatedConcepts.map((concept) => this.glossary.labelFor(concept)) ?? []);

  constructor() {
    effect(() => {
      const current = this.case();
      const title = current ? `${current.title} | Miraath Guide` : this.i18n.t('commonCasesPage.notFound');
      const description = current
        ? current.summary
        : this.i18n.t('commonCasesPage.notFound');
      this.seo.update({
        title,
        description,
        canonicalPath: `/common-cases/${this.slug() ?? ''}`,
        robots: current ? undefined : 'noindex, follow',
      });
    });
  }
}
