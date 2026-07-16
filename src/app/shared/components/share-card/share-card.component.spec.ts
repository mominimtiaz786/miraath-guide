import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Fraction } from '../../utils/fraction';
import { EligibleHeirShare } from '../../../features/calculator/models/heir.model';
import { ExplanationEntry } from '../../../features/calculator/models/calculation-result.model';
import { ShareCardComponent } from './share-card.component';

describe('ShareCardComponent', () => {
  let fixture: ComponentFixture<ShareCardComponent>;

  const share: EligibleHeirShare = {
    relationship: 'mother',
    count: 1,
    poolShare: Fraction.of(1, 6),
    perPersonShare: Fraction.of(1, 6),
    shareType: 'fixed',
    reasonCode: 'mother.reduced',
    sourceRefs: ['quran-4-11'],
  };

  const explanation: ExplanationEntry = {
    relationship: 'Mother',
    simple: 'The mother receives one-sixth because the deceased left descendants.',
    detailed: 'Detailed reasoning here.',
    sourceRefs: ['quran-4-11'],
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [ShareCardComponent] }).compileComponents();
    fixture = TestBed.createComponent(ShareCardComponent);
    fixture.componentRef.setInput('share', share);
    fixture.componentRef.setInput('explanation', explanation);
  });

  it('renders the relationship, fraction, and percentage', () => {
    fixture.detectChanges();
    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('Mother');
    expect(text).toContain('1/6');
    expect(text).toContain('16.67%');
  });

  it('shows the simple reason by default and the detailed reason when detailed=true', () => {
    fixture.detectChanges();
    let text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain(explanation.simple);

    fixture.componentRef.setInput('detailed', true);
    fixture.detectChanges();
    text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain(explanation.detailed);
  });

  it('shows a PKR amount only when an estate value is provided', () => {
    fixture.detectChanges();
    expect((fixture.nativeElement as HTMLElement).textContent).not.toContain('PKR');

    fixture.componentRef.setInput('estateValue', 600000);
    fixture.detectChanges();
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('PKR');
  });
});
