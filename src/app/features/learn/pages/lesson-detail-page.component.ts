import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { AppIconComponent } from '../../../shared/icons/app-icon.component';
import { PrimaryButtonComponent } from '../../../shared/components/primary-button/primary-button.component';
import { LESSONS } from '../../../data/lessons/lessons.data';

@Component({
  selector: 'app-lesson-detail-page',
  standalone: true,
  imports: [RouterLink, AppIconComponent, PrimaryButtonComponent],
  templateUrl: './lesson-detail-page.component.html',
  styleUrl: './lesson-detail-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LessonDetailPageComponent {
  private readonly route = inject(ActivatedRoute);

  private readonly slug = toSignal(this.route.paramMap.pipe(map((params) => params.get('slug'))), {
    initialValue: null,
  });

  protected readonly lesson = computed(() => LESSONS.find((l) => l.slug === this.slug()) ?? null);

  protected readonly nextLesson = computed(() => {
    const current = this.lesson();
    if (!current) {
      return null;
    }
    return LESSONS.find((l) => l.number === current.number + 1) ?? null;
  });
}
