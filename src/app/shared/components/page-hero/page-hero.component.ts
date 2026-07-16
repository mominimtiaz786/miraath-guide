import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { IslamicPatternComponent } from '../islamic-pattern/islamic-pattern.component';

@Component({
  selector: 'app-page-hero',
  standalone: true,
  imports: [IslamicPatternComponent],
  templateUrl: './page-hero.component.html',
  styleUrl: './page-hero.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageHeroComponent {
  readonly eyebrow = input<string | null>(null);
  readonly heading = input.required<string>();
  readonly body = input<string | null>(null);
}
