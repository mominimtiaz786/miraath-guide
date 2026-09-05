import { ChangeDetectionStrategy, Component, OnDestroy, computed, inject } from '@angular/core';
import { StructuredDataService } from '../../core/seo/structured-data.service';
import { SectionHeadingComponent } from '../../shared/components/section-heading/section-heading.component';
import { IconFeatureCardComponent } from '../../shared/components/icon-feature-card/icon-feature-card.component';
import { ProcessStepComponent } from '../../shared/components/process-step/process-step.component';
import { QuranReferenceCardComponent } from '../../shared/components/quran-reference-card/quran-reference-card.component';
import { PrimaryButtonComponent } from '../../shared/components/primary-button/primary-button.component';
import { SecondaryButtonComponent } from '../../shared/components/secondary-button/secondary-button.component';
import { FamilyTreeMiniComponent } from '../../shared/components/family-tree-mini/family-tree-mini.component';
import { CalculationChartComponent } from '../../shared/components/calculation-chart/calculation-chart.component';
import { IslamicPatternComponent } from '../../shared/components/islamic-pattern/islamic-pattern.component';
import { LessonCardComponent } from '../../shared/components/lesson-card/lesson-card.component';
import { AppIconComponent } from '../../shared/icons/app-icon.component';
import { RouterLink } from '@angular/router';
import { Fraction } from '../../shared/utils/fraction';
import { CommonCaseRepository } from '../../data/common-cases/common-case.repository';
import { LessonRepository } from '../../data/lessons/lesson.repository';
import { LocaleUrlService } from '../../i18n/locale-url.service';
import { TranslationService } from '../../i18n/translation.service';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    RouterLink,
    SectionHeadingComponent,
    IconFeatureCardComponent,
    ProcessStepComponent,
    QuranReferenceCardComponent,
    PrimaryButtonComponent,
    SecondaryButtonComponent,
    FamilyTreeMiniComponent,
    CalculationChartComponent,
    IslamicPatternComponent,
    LessonCardComponent,
    AppIconComponent,
  ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePageComponent implements OnDestroy {
  private readonly structuredData = inject(StructuredDataService);
  private readonly commonCases = inject(CommonCaseRepository);
  private readonly lessons = inject(LessonRepository);
  protected readonly i18n = inject(TranslationService);
  protected readonly localeUrl = inject(LocaleUrlService);

  constructor() {
    this.structuredData.set('website', {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'Miraath Guide',
      url: `https://miraath-guide.islamictools.app${this.localeUrl.localize('/')}`,
      description: this.i18n.t('home.body'),
    });
    this.structuredData.set('app', {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'Miraath Guide',
      url: `https://miraath-guide.islamictools.app${this.localeUrl.localize('/')}`,
      applicationCategory: 'EducationalApplication',
      operatingSystem: 'Any',
      description: this.i18n.t('home.body'),
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
    });
  }

  ngOnDestroy(): void {
    this.structuredData.remove('website');
    this.structuredData.remove('app');
  }

  // Matches the "Wife, one son and one daughter" common case exactly (1/8 + 7/12 + 7/24 = 1).
  protected readonly previewChart = computed(() => [
    { label: this.i18n.t('heir.wife.singular') + ' (1/8)', fraction: Fraction.of(1, 8) },
    { label: this.i18n.t('heir.son.singular') + ' (7/12)', fraction: Fraction.of(7, 12) },
    { label: this.i18n.t('heir.daughter.singular') + ' (7/24)', fraction: Fraction.of(7, 24) },
  ]);

  protected readonly scenarioCases = () =>
    ['wife-son-daughter', 'wife-and-both-parents', 'two-daughters-with-parents', 'siblings-in-kalalah']
      .map((slug) => this.commonCases.findBySlug(slug))
      .filter((commonCase) => commonCase !== null);

  protected readonly featuredLessons = () => this.lessons.lessons().slice(0, 4);
  protected readonly homeChips = () => this.i18n.value<string[]>('home.chips');
  protected readonly homeFeatures = () => this.i18n.value<string[][]>('home.features');
  protected readonly homeSteps = () => this.i18n.value<string[][]>('home.steps');
  protected readonly homeConcepts = () => this.i18n.value<string[][]>('home.concepts');
  protected readonly trustItems = () => this.i18n.value<string[][]>('home.trustItems');
}
