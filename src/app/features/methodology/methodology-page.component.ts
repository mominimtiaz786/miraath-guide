import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PageHeroComponent } from '../../shared/components/page-hero/page-hero.component';
import { SectionHeadingComponent } from '../../shared/components/section-heading/section-heading.component';
import { ProcessStepComponent } from '../../shared/components/process-step/process-step.component';
import { IconFeatureCardComponent } from '../../shared/components/icon-feature-card/icon-feature-card.component';
import { PrimaryButtonComponent } from '../../shared/components/primary-button/primary-button.component';
import { AppIconComponent } from '../../shared/icons/app-icon.component';
import { SOURCE_REFERENCES } from '../../data/sources/sources.data';

@Component({
  selector: 'app-methodology-page',
  standalone: true,
  imports: [
    PageHeroComponent,
    SectionHeadingComponent,
    ProcessStepComponent,
    IconFeatureCardComponent,
    PrimaryButtonComponent,
    AppIconComponent,
  ],
  templateUrl: './methodology-page.component.html',
  styleUrl: './methodology-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MethodologyPageComponent {
  protected readonly sources = Object.values(SOURCE_REFERENCES);
}
