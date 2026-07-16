import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Lesson } from '../../../data/lessons/lesson.model';
import { AppIconComponent } from '../../icons/app-icon.component';

@Component({
  selector: 'app-lesson-card',
  standalone: true,
  imports: [RouterLink, AppIconComponent],
  templateUrl: './lesson-card.component.html',
  styleUrl: './lesson-card.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LessonCardComponent {
  readonly lesson = input.required<Lesson>();
}
