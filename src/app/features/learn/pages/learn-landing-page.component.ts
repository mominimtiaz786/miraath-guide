import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PageHeroComponent } from '../../../shared/components/page-hero/page-hero.component';
import { IconFeatureCardComponent } from '../../../shared/components/icon-feature-card/icon-feature-card.component';
import { LessonCardComponent } from '../../../shared/components/lesson-card/lesson-card.component';
import { ProcessStepComponent } from '../../../shared/components/process-step/process-step.component';
import { QuranReferenceCardComponent } from '../../../shared/components/quran-reference-card/quran-reference-card.component';
import { PrimaryButtonComponent } from '../../../shared/components/primary-button/primary-button.component';
import { GlossaryTermCardComponent } from '../../../shared/components/glossary-term-card/glossary-term-card.component';
import { AppIconComponent } from '../../../shared/icons/app-icon.component';
import { Lesson, LessonCategory } from '../../../data/lessons/lesson.model';
import { LessonRepository } from '../../../data/lessons/lesson.repository';
import { GlossaryRepository } from '../../../data/glossary/glossary.repository';
import { LocaleUrlService } from '../../../i18n/locale-url.service';
import { TranslationService } from '../../../i18n/translation.service';

interface LessonFilter {
  id: LessonCategory | 'all';
  labelKey: string;
}

const FEATURED_LESSON_SLUGS = ['hajb', 'kalalah', 'awl'];

const FILTERS: LessonFilter[] = [
  { id: 'all', labelKey: 'learnPage.filters.all' },
  { id: 'foundations', labelKey: 'learnPage.filters.foundations' },
  { id: 'fixed-share-heirs', labelKey: 'learnPage.filters.fixed-share-heirs' },
  { id: 'residuary-heirs', labelKey: 'learnPage.filters.residuary-heirs' },
  { id: 'special-rules', labelKey: 'learnPage.filters.special-rules' },
  { id: 'worked-examples', labelKey: 'learnPage.filters.worked-examples' },
];

@Component({
  selector: 'app-learn-landing-page',
  standalone: true,
  imports: [
    RouterLink,
    PageHeroComponent,
    IconFeatureCardComponent,
    LessonCardComponent,
    ProcessStepComponent,
    QuranReferenceCardComponent,
    PrimaryButtonComponent,
    GlossaryTermCardComponent,
    AppIconComponent,
  ],
  templateUrl: './learn-landing-page.component.html',
  styleUrl: './learn-landing-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LearnLandingPageComponent {
  private readonly lessonRepository = inject(LessonRepository);
  private readonly glossaryRepository = inject(GlossaryRepository);
  protected readonly i18n = inject(TranslationService);
  protected readonly localeUrl = inject(LocaleUrlService);
  protected readonly filters = FILTERS;
  protected readonly activeFilter = signal<LessonFilter['id']>('all');
  protected readonly glossaryPreview = computed(() => this.glossaryRepository.terms().slice(2, 8));

  protected readonly featuredLessons = computed(() =>
    FEATURED_LESSON_SLUGS.map((slug) => this.lessonRepository.findBySlug(slug)).filter(
      (lesson): lesson is Lesson => lesson !== null,
    ),
  );

  protected readonly visibleLessons = computed(() => {
    const filter = this.activeFilter();
    const lessons = this.lessonRepository.lessons();
    return filter === 'all' ? lessons : lessons.filter((lesson) => lesson.category === filter);
  });

  selectFilter(id: LessonFilter['id']): void {
    this.activeFilter.set(id);
  }
}
