import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { PageHeroComponent } from '../../../shared/components/page-hero/page-hero.component';
import { InfoBannerComponent } from '../../../shared/components/info-banner/info-banner.component';
import { CaseCardComponent } from '../../../shared/components/case-card/case-card.component';
import { IconFeatureCardComponent } from '../../../shared/components/icon-feature-card/icon-feature-card.component';
import { PrimaryButtonComponent } from '../../../shared/components/primary-button/primary-button.component';
import { AppIconComponent } from '../../../shared/icons/app-icon.component';
import { AppIconName } from '../../../shared/icons/icon-registry';
import { COMMON_CASES } from '../../../data/common-cases/common-cases.data';
import { CommonCaseCategory } from '../../../data/common-cases/common-case.model';

interface CategoryTab {
  id: CommonCaseCategory | 'all';
  label: string;
  icon: AppIconName;
}

const TABS: CategoryTab[] = [
  { id: 'all', label: 'All Cases', icon: 'UsersRound' },
  { id: 'spouse-children', label: 'Spouse & Children', icon: 'UsersRound' },
  { id: 'parents-siblings', label: 'Parents & Siblings', icon: 'UsersRound' },
  { id: 'kalalah', label: 'Kalalah Cases', icon: 'GitBranch' },
  { id: 'special-rules', label: 'Special Rules', icon: 'Scale' },
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
  protected readonly tabs = TABS;
  protected readonly activeTab = signal<CategoryTab['id']>('all');
  protected readonly allCases = COMMON_CASES;

  protected readonly visibleCases = computed(() => {
    const tab = this.activeTab();
    return tab === 'all' ? this.allCases : this.allCases.filter((c) => c.category === tab);
  });

  selectTab(id: CategoryTab['id']): void {
    this.activeTab.set(id);
  }
}
