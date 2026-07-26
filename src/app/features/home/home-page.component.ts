import { ChangeDetectionStrategy, Component, OnDestroy, inject } from '@angular/core';
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
import { COMMON_CASES } from '../../data/common-cases/common-cases.data';
import { LESSONS } from '../../data/lessons/lessons.data';

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

  constructor() {
    this.structuredData.set('website', {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'Miraath Guide',
      url: 'https://miraath-guide.islamictools.app/',
      description: 'An educational Islamic inheritance calculator based on the principles of Ilm al-Faraid.',
    });
    this.structuredData.set('app', {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'Miraath Guide',
      url: 'https://miraath-guide.islamictools.app/',
      applicationCategory: 'EducationalApplication',
      operatingSystem: 'Any',
      description:
        'An educational Islamic inheritance calculator that helps users understand inheritance shares under the principles of Ilm al-Faraid.',
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
  protected readonly previewChart = [
    { label: 'Wife (1/8)', fraction: Fraction.of(1, 8) },
    { label: 'Son (7/12)', fraction: Fraction.of(7, 12) },
    { label: 'Daughter (7/24)', fraction: Fraction.of(7, 24) },
  ];

  protected readonly scenarioCases = [
    COMMON_CASES.find((c) => c.slug === 'wife-son-daughter')!,
    COMMON_CASES.find((c) => c.slug === 'wife-and-both-parents')!,
    COMMON_CASES.find((c) => c.slug === 'two-daughters-with-parents')!,
    COMMON_CASES.find((c) => c.slug === 'siblings-in-kalalah')!,
  ];

  protected readonly featuredLessons = LESSONS.slice(0, 4);
}
