import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { LocaleUrlService } from './locale-url.service';

/**
 * These two methods produce deliberately different strings for the same page,
 * and conflating them is a silent failure: a locale root with a trailing slash
 * parses as a trailing empty segment, matches no route, and drops the user on
 * the 404 page instead of the home page. That broke the header logo, the
 * language switcher and the mobile app's first-run language picker in every
 * non-English locale, with nothing thrown to notice.
 */
describe('LocaleUrlService', () => {
  let service: LocaleUrlService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    service = TestBed.inject(LocaleUrlService);
  });

  describe('localize - the form the Router has to parse', () => {
    it('gives a locale root no trailing slash', () => {
      expect(service.localize('/', 'ur')).toBe('/ur');
      expect(service.localize('/', 'ar')).toBe('/ar');
    });

    it('leaves the default locale unprefixed', () => {
      expect(service.localize('/', 'en')).toBe('/');
      expect(service.localize('/learn', 'en')).toBe('/learn');
    });

    it('prefixes deeper paths without adding a slash', () => {
      expect(service.localize('/learn', 'ur')).toBe('/ur/learn');
      expect(service.localize('/calculator/wizard', 'fr')).toBe('/fr/calculator/wizard');
    });

    it('re-localizes a path that already carries a locale', () => {
      expect(service.localize('/ur/learn', 'ar')).toBe('/ar/learn');
      expect(service.localize('/ur/learn', 'en')).toBe('/learn');
      expect(service.localize('/ur', 'hi')).toBe('/hi');
    });

    it('preserves query and hash', () => {
      expect(service.localize('/learn?a=1#top', 'ur')).toBe('/ur/learn?a=1#top');
      expect(service.localize('/?a=1', 'ur')).toBe('/ur?a=1');
    });
  });

  describe('canonical - the form already published to crawlers', () => {
    it('keeps the trailing slash on a locale root, as the sitemap advertises', () => {
      expect(service.canonical('/', 'ur')).toBe('/ur/');
      expect(service.canonical('/', 'ar')).toBe('/ar/');
    });

    it('matches localize everywhere else', () => {
      expect(service.canonical('/', 'en')).toBe('/');
      expect(service.canonical('/learn', 'ur')).toBe('/ur/learn');
      expect(service.canonical('/learn', 'en')).toBe('/learn');
    });
  });

  describe('stripLocale', () => {
    it('round-trips with localize', () => {
      for (const locale of ['ur', 'ar', 'hi', 'fr'] as const) {
        expect(service.stripLocale(service.localize('/', locale))).toBe('/');
        expect(service.stripLocale(service.localize('/learn', locale))).toBe('/learn');
      }
    });
  });
});
