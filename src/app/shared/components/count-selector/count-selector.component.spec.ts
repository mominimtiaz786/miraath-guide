import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CountSelectorComponent } from './count-selector.component';

describe('CountSelectorComponent', () => {
  let fixture: ComponentFixture<CountSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [CountSelectorComponent] }).compileComponents();
    fixture = TestBed.createComponent(CountSelectorComponent);
  });

  function setInputs(value: number, min = 0, max = 4): void {
    fixture.componentRef.setInput('value', value);
    fixture.componentRef.setInput('min', min);
    fixture.componentRef.setInput('max', max);
    fixture.detectChanges();
  }

  it('renders the current value', () => {
    setInputs(2);
    const valueEl: HTMLElement = fixture.nativeElement.querySelector('.value');
    expect(valueEl.textContent?.trim()).toBe('2');
  });

  it('emits value + 1 when the increment button is clicked', () => {
    setInputs(1);
    const emitted: number[] = [];
    fixture.componentInstance.valueChange.subscribe((v) => emitted.push(v));

    const buttons: HTMLButtonElement[] = fixture.nativeElement.querySelectorAll('.step-btn');
    buttons[1].click();

    expect(emitted).toEqual([2]);
  });

  it('emits value - 1 when the decrement button is clicked', () => {
    setInputs(2);
    const emitted: number[] = [];
    fixture.componentInstance.valueChange.subscribe((v) => emitted.push(v));

    const buttons: HTMLButtonElement[] = fixture.nativeElement.querySelectorAll('.step-btn');
    buttons[0].click();

    expect(emitted).toEqual([1]);
  });

  it('disables the decrement button at the minimum', () => {
    setInputs(0, 0, 4);
    const buttons: HTMLButtonElement[] = fixture.nativeElement.querySelectorAll('.step-btn');
    expect(buttons[0].disabled).toBeTrue();
  });

  it('disables the increment button at the maximum', () => {
    setInputs(4, 0, 4);
    const buttons: HTMLButtonElement[] = fixture.nativeElement.querySelectorAll('.step-btn');
    expect(buttons[1].disabled).toBeTrue();
  });
});
