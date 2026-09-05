import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { PageHeroComponent } from '../../shared/components/page-hero/page-hero.component';
import { GlossaryTermCardComponent } from '../../shared/components/glossary-term-card/glossary-term-card.component';
import { GlossaryRepository } from '../../data/glossary/glossary.repository';
import { TranslationService } from '../../i18n/translation.service';

@Component({
  selector: 'app-glossary-page',
  standalone: true,
  imports: [PageHeroComponent, GlossaryTermCardComponent],
  templateUrl: './glossary-page.component.html',
  styleUrl: './glossary-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GlossaryPageComponent {
  protected readonly i18n = inject(TranslationService);
  private readonly glossary = inject(GlossaryRepository);
  protected readonly terms = this.glossary.terms;
}
