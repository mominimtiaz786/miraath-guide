import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChoiceOption, YesNoChoiceComponent } from './yes-no-choice.component';

describe('YesNoChoiceComponent', () => {
  let fixture: ComponentFixture<YesNoChoiceComponent<boolean>>;

  const options: ChoiceOption<boolean>[] = [
    { value: true, label: 'Yes', icon: 'Check' },
    { value: false, label: 'No', icon: 'X' },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [YesNoChoiceComponent] }).compileComponents();
    fixture = TestBed.createComponent(YesNoChoiceComponent<boolean>);
    fixture.componentRef.setInput('options', options);
    fixture.detectChanges();
  });

  it('renders one choice card per option, with no third "not sure" option', () => {
    const cards = fixture.nativeElement.querySelectorAll('.choice-card');
    expect(cards.length).toBe(2);
  });

  it('emits the option value when a card is clicked', () => {
    const emitted: boolean[] = [];
    fixture.componentInstance.valueChange.subscribe((v) => emitted.push(v));

    const cards: HTMLButtonElement[] = fixture.nativeElement.querySelectorAll('.choice-card');
    cards[0].click();

    expect(emitted).toEqual([true]);
  });

  it('marks the currently-selected option with aria-checked', () => {
    fixture.componentRef.setInput('value', false);
    fixture.detectChanges();

    const cards: HTMLButtonElement[] = fixture.nativeElement.querySelectorAll('.choice-card');
    expect(cards[0].getAttribute('aria-checked')).toBe('false');
    expect(cards[1].getAttribute('aria-checked')).toBe('true');
  });
});
