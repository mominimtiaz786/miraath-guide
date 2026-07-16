import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { PrimaryButtonComponent } from './primary-button.component';

describe('PrimaryButtonComponent', () => {
  let fixture: ComponentFixture<PrimaryButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrimaryButtonComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(PrimaryButtonComponent);
  });

  it('uses the button text color for the arrow icon when shown', () => {
    fixture.componentRef.setInput('showArrow', true);
    fixture.detectChanges();

    const icon = fixture.nativeElement.querySelector('app-icon');

    expect(icon).toBeTruthy();
    expect(icon.style.color).toBe('var(--color-on-primary)');
  });
});
