import { ChangeDetectionStrategy, Component, computed, effect, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { AppIconComponent } from '../../../shared/icons/app-icon.component';
import { PrimaryButtonComponent } from '../../../shared/components/primary-button/primary-button.component';
import { SeoService } from '../../../core/seo/seo.service';
import { getLessonSeoData } from '../../../data/lessons/lesson-seo.util';
import { LessonRepository } from '../../../data/lessons/lesson.repository';
import { GlossaryRepository } from '../../../data/glossary/glossary.repository';
import { LocaleUrlService } from '../../../i18n/locale-url.service';
import { TranslationService } from '../../../i18n/translation.service';

@Component({
  selector: 'app-lesson-detail-page',
  standalone: true,
  imports: [RouterLink, AppIconComponent, PrimaryButtonComponent],
  templateUrl: './lesson-detail-page.component.html',
  styleUrl: './lesson-detail-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LessonDetailPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly seo = inject(SeoService);
  private readonly lessons = inject(LessonRepository);
  private readonly glossary = inject(GlossaryRepository);
  protected readonly i18n = inject(TranslationService);
  protected readonly localeUrl = inject(LocaleUrlService);

  private readonly slug = toSignal(this.route.paramMap.pipe(map((params) => params.get('slug'))), {
    initialValue: null,
  });

  protected readonly lesson = computed(() => this.lessons.findBySlug(this.slug()));
  protected readonly relatedTerms = computed(() => this.lesson()?.relatedGlossaryTerms.map((term) => this.glossary.labelFor(term)) ?? []);

  protected readonly nextLesson = computed(() => {
    const current = this.lesson();
    if (!current) {
      return null;
    }
    return this.lessons.lessons().find((l) => l.number === current.number + 1) ?? null;
  });

  constructor() {
    effect(() => {
      const current = this.lesson();
      this.seo.update({
        ...getLessonSeoData(current, this.slug()),
        canonicalPath: `/learn/${this.slug() ?? ''}`,
      });
    });
  }
}
