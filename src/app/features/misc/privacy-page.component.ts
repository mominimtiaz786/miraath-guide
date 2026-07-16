import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PageHeroComponent } from '../../shared/components/page-hero/page-hero.component';
import { IconFeatureCardComponent } from '../../shared/components/icon-feature-card/icon-feature-card.component';

@Component({
  selector: 'app-privacy-page',
  standalone: true,
  imports: [PageHeroComponent, IconFeatureCardComponent, RouterLink],
  templateUrl: './privacy-page.component.html',
  styleUrl: './misc-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrivacyPageComponent {}
