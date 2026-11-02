import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  afterNextRender,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { AnalyticsService } from '../../core/analytics/analytics.service';
import { SITE_NAME, SITE_URL } from '../../core/seo/seo.constants';
import { StructuredDataService } from '../../core/seo/structured-data.service';
import { getLocaleDefinition } from '../../i18n/config/locale.config';
import { LocaleUrlService } from '../../i18n/locale-url.service';
import { TranslationService } from '../../i18n/translation.service';
import { IconFeatureCardComponent } from '../../shared/components/icon-feature-card/icon-feature-card.component';
import { IslamicPatternComponent } from '../../shared/components/islamic-pattern/islamic-pattern.component';
import { ProcessStepComponent } from '../../shared/components/process-step/process-step.component';
import { SectionHeadingComponent } from '../../shared/components/section-heading/section-heading.component';
import { AppIconComponent } from '../../shared/icons/app-icon.component';
import { AppIconName } from '../../shared/icons/icon-registry';
import {
  ATTRIBUTION_KEYS,
  Attribution,
  EMAIL_MAX_LENGTH,
  LEAD_SIGNUP_RESOURCE_ID,
  LEAD_SIGNUP_SOURCE,
  isPlausibleEmail,
  normalizeEmail,
  sanitizeAttribution,
} from './lead-signup.contract';
import { LeadSignupService } from './lead-signup.service';

/** The English workbook. Served from `public/`, identical on every locale's page. */
export const STARTER_KIT_PDF_URL = '/downloads/family-inheritance-starter-kit.pdf';
const STARTER_KIT_FILENAME = 'Miraath-Guide-Family-Inheritance-Starter-Kit.pdf';
const STRUCTURED_DATA_ID = 'inheritance-guide';

type SignupStatus = 'idle' | 'submitting' | 'saved' | 'failed' | 'rate_limited';
type FieldError = 'emailRequired' | 'emailInvalid' | 'consentRequired' | null;

const INSIDE_ICONS: AppIconName[] = ['FileSearch', 'BookOpenCheck', 'House', 'ClipboardList', 'UsersRound', 'GraduationCap'];
const STEP_ICONS: AppIconName[] = ['Download', 'ClipboardList', 'Calculator'];

@Component({
  selector: 'app-inheritance-guide-page',
  standalone: true,
  imports: [
    RouterLink,
    AppIconComponent,
    IconFeatureCardComponent,
    IslamicPatternComponent,
    ProcessStepComponent,
    SectionHeadingComponent,
  ],
  templateUrl: './inheritance-guide-page.component.html',
  styleUrl: './inheritance-guide-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InheritanceGuidePageComponent implements OnDestroy {
  protected readonly i18n = inject(TranslationService);
  protected readonly localeUrl = inject(LocaleUrlService);
  private readonly structuredData = inject(StructuredDataService);
  private readonly analytics = inject(AnalyticsService);
  private readonly signupService = inject(LeadSignupService);

  protected readonly pdfUrl = STARTER_KIT_PDF_URL;
  protected readonly pdfFilename = STARTER_KIT_FILENAME;
  protected readonly emailMaxLength = EMAIL_MAX_LENGTH;
  protected readonly insideIcons = INSIDE_ICONS;
  protected readonly stepIcons = STEP_ICONS;

  protected readonly insideItems = () => this.i18n.value<string[][]>('inheritanceGuide.inside');
  protected readonly steps = () => this.i18n.value<string[][]>('inheritanceGuide.steps');
  protected readonly faqs = () => this.i18n.value<string[][]>('inheritanceGuide.faq');

  /** False in prerendered HTML so the form can't natively submit before hydration. */
  protected readonly interactive = signal(false);
  // The inputs own their values; signals only mirror them. Writing a value back
  // into a type="email" field while typing can move the caret in some browsers.
  protected readonly email = signal('');
  protected readonly consent = signal(false);
  protected readonly honeypot = signal('');
  protected readonly status = signal<SignupStatus>('idle');
  protected readonly emailError = signal<FieldError>(null);
  protected readonly consentError = signal<FieldError>(null);

  private readonly emailInput = viewChild<ElementRef<HTMLInputElement>>('emailInput');
  private readonly consentInput = viewChild<ElementRef<HTMLInputElement>>('consentInput');

  constructor() {
    const pageUrl = `${SITE_URL}${this.localeUrl.localize('/inheritance-guide')}`;
    this.structuredData.set(STRUCTURED_DATA_ID, {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: this.i18n.t('inheritanceGuide.heading'),
      url: pageUrl,
      description: this.i18n.t('inheritanceGuide.body'),
      inLanguage: getLocaleDefinition(this.i18n.locale()).htmlLang,
      isPartOf: { '@type': 'WebSite', name: SITE_NAME, url: SITE_URL },
      mainEntity: {
        '@type': 'DigitalDocument',
        name: 'Family Inheritance Starter Kit',
        url: `${SITE_URL}${STARTER_KIT_PDF_URL}`,
        encodingFormat: 'application/pdf',
        inLanguage: 'en',
        version: '1.0',
        datePublished: '2026-11-02',
        isAccessibleForFree: true,
        educationalUse: 'Family inheritance preparation workbook',
        publisher: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
      },
    });

    afterNextRender(() => {
      this.interactive.set(true);
      this.analytics.event('inheritance_guide_view', { locale: this.i18n.locale() });
    });
  }

  ngOnDestroy(): void {
    this.structuredData.remove(STRUCTURED_DATA_ID);
  }

  protected trackPdf(placement: 'hero' | 'final', action: 'download' | 'view'): void {
    // A click is only a click - it doesn't prove the file finished downloading.
    this.analytics.event('inheritance_guide_pdf_click', { placement, action, locale: this.i18n.locale() });
  }

  protected trackCalculator(): void {
    this.analytics.event('inheritance_guide_calculator_click', { locale: this.i18n.locale() });
  }

  protected onEmailInput(value: string): void {
    this.email.set(value);
    if (this.emailError()) {
      this.emailError.set(this.validateEmail(value));
    }
  }

  protected onConsentChange(checked: boolean): void {
    this.consent.set(checked);
    if (checked) {
      this.consentError.set(null);
    }
  }

  protected async submit(event: Event): Promise<void> {
    event.preventDefault();
    if (this.status() === 'submitting') {
      return;
    }

    const emailError = this.validateEmail(this.email());
    const consentError: FieldError = this.consent() ? null : 'consentRequired';
    this.emailError.set(emailError);
    this.consentError.set(consentError);
    if (emailError) {
      this.emailInput()?.nativeElement.focus();
      return;
    }
    if (consentError) {
      this.consentInput()?.nativeElement.focus();
      return;
    }

    this.status.set('submitting');
    const outcome = await this.signupService.submit({
      email: normalizeEmail(this.email()),
      consent: true,
      resourceId: LEAD_SIGNUP_RESOURCE_ID,
      source: LEAD_SIGNUP_SOURCE,
      locale: this.i18n.locale(),
      attribution: this.readAttribution(),
      website: this.honeypot(),
    });

    switch (outcome) {
      case 'saved':
        // The form is removed on success, so there is no field to reset.
        this.status.set('saved');
        this.analytics.event('inheritance_guide_signup_saved', { locale: this.i18n.locale() });
        break;
      case 'invalid_email':
        this.status.set('idle');
        this.emailError.set('emailInvalid');
        this.emailInput()?.nativeElement.focus();
        break;
      case 'consent_required':
        this.status.set('idle');
        this.consentError.set('consentRequired');
        this.consentInput()?.nativeElement.focus();
        break;
      case 'rate_limited':
        this.status.set('rate_limited');
        break;
      default:
        this.status.set('failed');
    }
  }

  private validateEmail(raw: string): FieldError {
    const value = raw.trim();
    if (!value) {
      return 'emailRequired';
    }
    return isPlausibleEmail(normalizeEmail(value)) ? null : 'emailInvalid';
  }

  /** UTM parameters from the landing URL only - never the full URL or referrer. */
  private readAttribution(): Attribution | undefined {
    const params = new URLSearchParams(window.location.search);
    const raw: Record<string, string> = {};
    for (const key of ATTRIBUTION_KEYS) {
      const value = params.get(key);
      if (value) {
        raw[key] = value;
      }
    }
    return sanitizeAttribution(raw);
  }
}
