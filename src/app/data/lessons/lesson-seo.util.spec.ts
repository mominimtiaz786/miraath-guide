import { LESSONS } from './lessons.data';
import { getLessonSeoData } from './lesson-seo.util';

describe('getLessonSeoData', () => {
  it('uses lesson-specific title, description, and canonical metadata for a valid lesson', () => {
    const lesson = LESSONS[0];
    const data = getLessonSeoData(lesson, lesson.slug);

    expect(data.title).toBe(`${lesson.title} | Miraath Guide`);
    expect(data.description).toBe(lesson.metaDescription ?? lesson.summary);
    expect(data.canonicalPath).toBe(`/learn/${lesson.slug}`);
    expect(data.robots).toBeUndefined();
  });

  it('falls back to noindex metadata for an invalid lesson', () => {
    const data = getLessonSeoData(null, 'a-lesson-that-does-not-exist');

    expect(data.title).toBe('Lesson Not Found | Miraath Guide');
    expect(data.description).toContain("couldn't be found");
    expect(data.canonicalPath).toBe('/learn/a-lesson-that-does-not-exist');
    expect(data.robots).toBe('noindex, follow');
  });
});
