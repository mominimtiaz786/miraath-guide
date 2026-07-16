import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PageHeroComponent } from '../../../shared/components/page-hero/page-hero.component';
import { IconFeatureCardComponent } from '../../../shared/components/icon-feature-card/icon-feature-card.component';
import { LessonCardComponent } from '../../../shared/components/lesson-card/lesson-card.component';
import { ProcessStepComponent } from '../../../shared/components/process-step/process-step.component';
import { QuranReferenceCardComponent } from '../../../shared/components/quran-reference-card/quran-reference-card.component';
import { PrimaryButtonComponent } from '../../../shared/components/primary-button/primary-button.component';
import { GlossaryTermCardComponent } from '../../../shared/components/glossary-term-card/glossary-term-card.component';
import { AppIconComponent } from '../../../shared/icons/app-icon.component';
import { LESSONS } from '../../../data/lessons/lessons.data';
import { LessonCategory } from '../../../data/lessons/lesson.model';
import { GLOSSARY_TERMS } from '../../../data/glossary/glossary.data';

interface LessonFilter {
  id: LessonCategory | 'all';
  label: string;
}

const FILTERS: LessonFilter[] = [
  { id: 'all', label: 'All Lessons' },
  { id: 'foundations', label: 'Foundations' },
  { id: 'fixed-share-heirs', label: 'Fixed-Share Heirs' },
  { id: 'residuary-heirs', label: 'Residuary Heirs & Blocking' },
  { id: 'special-rules', label: 'Special Rules' },
  { id: 'worked-examples', label: 'Worked Examples' },
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
  protected readonly filters = FILTERS;
  protected readonly activeFilter = signal<LessonFilter['id']>('all');
  protected readonly glossaryPreview = GLOSSARY_TERMS.slice(2, 8);

  protected readonly visibleLessons = computed(() => {
    const filter = this.activeFilter();
    return filter === 'all' ? LESSONS : LESSONS.filter((lesson) => lesson.category === filter);
  });

  selectFilter(id: LessonFilter['id']): void {
    this.activeFilter.set(id);
  }
}
