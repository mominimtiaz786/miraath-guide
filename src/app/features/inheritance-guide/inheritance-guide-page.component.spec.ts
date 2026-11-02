import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { InheritanceGuidePageComponent, STARTER_KIT_PDF_URL } from './inheritance-guide-page.component';
import { LeadSignupOutcome, LeadSignupService } from './lead-signup.service';

describe('InheritanceGuidePageComponent', () => {
  let fixture: ComponentFixture<InheritanceGuidePageComponent>;
  let element: HTMLElement;
  let submit: jasmine.Spy<(request: unknown) => Promise<LeadSignupOutcome>>;

  beforeEach(async () => {
    submit = jasmine.createSpy('submit').and.resolveTo('saved');
    await TestBed.configureTestingModule({
      imports: [InheritanceGuidePageComponent],
      providers: [provideRouter([]), { provide: LeadSignupService, useValue: { submit } }],
    }).compileComponents();
    fixture = TestBed.createComponent(InheritanceGuidePageComponent);
    element = fixture.nativeElement;
    fixture.detectChanges();
  });

  const typeEmail = (value: string) => {
    const input = element.querySelector<HTMLInputElement>('#signup-email')!;
    input.value = value;
    input.dispatchEvent(new Event('input'));
  };
  const tickConsent = () => {
    const box = element.querySelector<HTMLInputElement>('#signup-consent')!;
    box.checked = true;
    box.dispatchEvent(new Event('change'));
  };
  const submitForm = async () => {
    element.querySelector('form')!.dispatchEvent(new Event('submit', { cancelable: true }));
    await fixture.whenStable();
    fixture.detectChanges();
  };

  it('links every download action to the same unlocalized PDF, never through the router', () => {
    const links = Array.from(element.querySelectorAll<HTMLAnchorElement>('a[href*="/downloads/"]'));
    expect(links.length).toBe(4);
    links.forEach((link) => expect(link.getAttribute('href')).toBe(STARTER_KIT_PDF_URL));
    expect(element.querySelectorAll('a[download]').length).toBe(2);
  });

  it('requires a valid email and consent before submitting', async () => {
    await submitForm();
    expect(element.querySelector('#signup-email-error')?.textContent).toContain('Enter your email address');

    typeEmail('reader@example');
    await submitForm();
    expect(element.querySelector('#signup-email-error')?.textContent).toContain('valid email');

    typeEmail('reader@example.com');
    await submitForm();
    expect(element.querySelector('#signup-consent-error')).not.toBeNull();
    expect(submit).not.toHaveBeenCalled();
  });

  it('sends a normalized email with consent and confirms in the live region', async () => {
    typeEmail('  Reader+Kit@Example.COM ');
    tickConsent();
    await submitForm();

    expect(submit).toHaveBeenCalledOnceWith(
      jasmine.objectContaining({
        email: 'reader+kit@example.com',
        consent: true,
        resourceId: 'family-inheritance-starter-kit',
        source: 'inheritance-guide',
        locale: 'en',
      }),
    );
    expect(element.querySelector('[role="status"]')?.textContent).toContain('Your interest has been saved');
    expect(element.querySelector('form')).toBeNull();
  });

  it('reports a failed save honestly and keeps the form for a retry', async () => {
    submit.and.resolveTo('failed');
    typeEmail('reader@example.com');
    tickConsent();
    await submitForm();

    expect(element.querySelector('[role="status"]')?.textContent).toContain("couldn't save your email");
    expect(element.querySelector('form')).not.toBeNull();
    expect(element.querySelector('a[href="/downloads/family-inheritance-starter-kit.pdf"]')).not.toBeNull();
  });
});
