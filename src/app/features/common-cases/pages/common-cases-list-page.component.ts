import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { PageHeroComponent } from '../../../shared/components/page-hero/page-hero.component';
import { InfoBannerComponent } from '../../../shared/components/info-banner/info-banner.component';
import { CaseCardComponent } from '../../../shared/components/case-card/case-card.component';
import { IconFeatureCardComponent } from '../../../shared/components/icon-feature-card/icon-feature-card.component';
import { PrimaryButtonComponent } from '../../../shared/components/primary-button/primary-button.component';
import { AppIconComponent } from '../../../shared/icons/app-icon.component';
import { AppIconName } from '../../../shared/icons/icon-registry';
import { CommonCaseCategory } from '../../../data/common-cases/common-case.model';
import { CommonCaseRepository } from '../../../data/common-cases/common-case.repository';
import { LocaleUrlService } from '../../../i18n/locale-url.service';
import { TranslationService } from '../../../i18n/translation.service';

interface CategoryTab {
  id: CommonCaseCategory | 'all';
  labelKey: string;
  icon: AppIconName;
}

const TABS: CategoryTab[] = [
  { id: 'all', labelKey: 'commonCasesPage.tabs.all', icon: 'UsersRound' },
  { id: 'spouse-children', labelKey: 'commonCasesPage.tabs.spouse-children', icon: 'UsersRound' },
  { id: 'parents-siblings', labelKey: 'commonCasesPage.tabs.parents-siblings', icon: 'UsersRound' },
  { id: 'kalalah', labelKey: 'commonCasesPage.tabs.kalalah', icon: 'GitBranch' },
  { id: 'special-rules', labelKey: 'commonCasesPage.tabs.special-rules', icon: 'Scale' },
];

@Component({
  selector: 'app-common-cases-list-page',
  standalone: true,
  imports: [PageHeroComponent, InfoBannerComponent, CaseCardComponent, IconFeatureCardComponent, PrimaryButtonComponent, AppIconComponent],
  templateUrl: './common-cases-list-page.component.html',
  styleUrl: './common-cases-list-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommonCasesListPageComponent {
  private readonly caseRepository = inject(CommonCaseRepository);
  protected readonly i18n = inject(TranslationService);
  protected readonly localeUrl = inject(LocaleUrlService);
  protected readonly tabs = TABS;
  protected readonly activeTab = signal<CategoryTab['id']>('all');
  protected readonly allCases = this.caseRepository.cases;
  protected readonly outcomeCards = () => this.i18n.value<string[][]>('commonCasesPage.outcomesCards');

  protected readonly visibleCases = computed(() => {
    const tab = this.activeTab();
    return tab === 'all' ? this.allCases() : this.allCases().filter((c) => c.category === tab);
  });

  selectTab(id: CategoryTab['id']): void {
    this.activeTab.set(id);
  }
}
