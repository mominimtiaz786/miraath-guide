import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WizardQuestionCardComponent } from './wizard-question-card.component';

describe('WizardQuestionCardComponent', () => {
  let fixture: ComponentFixture<WizardQuestionCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [WizardQuestionCardComponent] }).compileComponents();
    fixture = TestBed.createComponent(WizardQuestionCardComponent);
    fixture.componentRef.setInput('question', 'Is the father alive?');
    fixture.detectChanges();
  });

  it('disables the Continue button when canContinue is false', () => {
    fixture.componentRef.setInput('canContinue', false);
    fixture.detectChanges();
    const continueBtn: HTMLButtonElement = fixture.nativeElement.querySelector('.btn-primary');
    expect(continueBtn.disabled).toBeTrue();
  });

  it('enables the Continue button when canContinue is true', () => {
    fixture.componentRef.setInput('canContinue', true);
    fixture.detectChanges();
    const continueBtn: HTMLButtonElement = fixture.nativeElement.querySelector('.btn-primary');
    expect(continueBtn.disabled).toBeFalse();
  });

  it('emits continue when the Continue button is clicked', () => {
    fixture.componentRef.setInput('canContinue', true);
    fixture.detectChanges();
    let emitted = false;
    fixture.componentInstance.continue.subscribe(() => (emitted = true));

    fixture.nativeElement.querySelector('.btn-primary').click();
    expect(emitted).toBeTrue();
  });

  it('emits back when the Back button is clicked', () => {
    fixture.componentRef.setInput('showBack', true);
    fixture.detectChanges();
    let emitted = false;
    fixture.componentInstance.back.subscribe(() => (emitted = true));

    fixture.nativeElement.querySelector('.btn-secondary').click();
    expect(emitted).toBeTrue();
  });

  it('hides the Back button when showBack is false', () => {
    fixture.componentRef.setInput('showBack', false);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.btn-secondary')).toBeNull();
  });

  it('moves focus to the question heading when the question changes', (done) => {
    fixture.componentRef.setInput('question', 'A brand new question?');
    fixture.detectChanges();
    queueMicrotask(() => {
      const heading: HTMLElement = fixture.nativeElement.querySelector('h2');
      expect(document.activeElement).toBe(heading);
      done();
    });
  });
});
