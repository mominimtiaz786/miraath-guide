import { SeoData } from '../../core/seo/seo-data.model';
import { Lesson } from './lesson.model';

export function getLessonSeoData(lesson: Lesson | null, slug: string | null): SeoData {
  if (lesson) {
    const title = lesson.metaTitle ?? `${lesson.title} | Miraath Guide`;
    const description = lesson.metaDescription ?? lesson.summary;

    return {
      title,
      description,
      canonicalPath: `/learn/${slug ?? lesson.slug}`,
      ogTitle: title,
      ogDescription: description,
      ogType: 'article',
      ogImage: '/favicon.png',
      twitterDescription: description,
    };
  }

  const invalidSlug = slug ?? '';
  return {
    title: 'Lesson Not Found | Miraath Guide',
    description: "This lesson couldn't be found. Browse other Faraid lessons on Miraath Guide.",
    canonicalPath: `/learn/${invalidSlug}`,
    robots: 'noindex, follow',
  };
}
