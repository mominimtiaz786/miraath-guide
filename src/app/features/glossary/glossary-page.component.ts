import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PageHeroComponent } from '../../shared/components/page-hero/page-hero.component';
import { GlossaryTermCardComponent } from '../../shared/components/glossary-term-card/glossary-term-card.component';
import { GLOSSARY_TERMS } from '../../data/glossary/glossary.data';

@Component({
  selector: 'app-glossary-page',
  standalone: true,
  imports: [PageHeroComponent, GlossaryTermCardComponent],
  templateUrl: './glossary-page.component.html',
  styleUrl: './glossary-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GlossaryPageComponent {
  protected readonly terms = GLOSSARY_TERMS;
}
