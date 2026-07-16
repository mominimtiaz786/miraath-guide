import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PageHeroComponent } from '../../shared/components/page-hero/page-hero.component';
import { InfoBannerComponent } from '../../shared/components/info-banner/info-banner.component';

@Component({
  selector: 'app-about-page',
  standalone: true,
  imports: [PageHeroComponent, InfoBannerComponent, RouterLink],
  templateUrl: './about-page.component.html',
  styleUrl: '../misc/misc-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutPageComponent {}
