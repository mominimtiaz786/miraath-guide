import { Fraction } from './fraction';

describe('Fraction', () => {
  it('normalizes on construction using gcd', () => {
    const f = Fraction.of(2, 4);
    expect(f.numerator).toBe(1);
    expect(f.denominator).toBe(2);
  });

  it('normalizes a negative denominator into the numerator', () => {
    const f = Fraction.of(1, -2);
    expect(f.numerator).toBe(-1);
    expect(f.denominator).toBe(2);
  });

  it('adds fractions with different denominators', () => {
    const result = Fraction.of(1, 6).add(Fraction.of(1, 3));
    expect(result.equals(Fraction.of(1, 2))).toBeTrue();
  });

  it('subtracts fractions', () => {
    const result = Fraction.of(1, 2).subtract(Fraction.of(1, 6));
    expect(result.equals(Fraction.of(1, 3))).toBeTrue();
  });

  it('multiplies fractions', () => {
    const result = Fraction.of(2, 3).multiply(Fraction.of(3, 4));
    expect(result.equals(Fraction.of(1, 2))).toBeTrue();
  });

  it('divides fractions', () => {
    const result = Fraction.of(1, 2).divide(Fraction.of(1, 4));
    expect(result.equals(Fraction.of(2, 1))).toBeTrue();
  });

  it('throws when dividing by zero', () => {
    expect(() => Fraction.of(1, 2).divide(Fraction.zero())).toThrowError();
  });

  it('compares fractions with greaterThan/lessThan', () => {
    expect(Fraction.of(2, 3).greaterThan(Fraction.of(1, 2))).toBeTrue();
    expect(Fraction.of(1, 3).lessThan(Fraction.of(1, 2))).toBeTrue();
  });

  it('converts to percentage with rounding', () => {
    expect(Fraction.of(1, 3).toPercentage(2)).toBeCloseTo(33.33, 2);
    expect(Fraction.of(1, 6).toPercentage(2)).toBeCloseTo(16.67, 2);
  });

  it('converts to money rounded to two decimal places', () => {
    expect(Fraction.of(1, 3).toMoney(100)).toBeCloseTo(33.33, 2);
  });

  it('produces a readable display string', () => {
    expect(Fraction.of(1, 2).toDisplayString()).toBe('1/2');
    expect(Fraction.zero().toDisplayString()).toBe('0');
    expect(Fraction.of(4, 2).toDisplayString()).toBe('2');
  });

  it('computes a common denominator across several fractions', () => {
    const denom = Fraction.commonDenominator([Fraction.of(1, 6), Fraction.of(1, 3), Fraction.of(1, 8)]);
    expect(denom).toBe(24);
  });

  it('sums a list of fractions', () => {
    const total = Fraction.sum([Fraction.of(1, 6), Fraction.of(1, 3), Fraction.of(1, 2)]);
    expect(total.equals(Fraction.one())).toBeTrue();
  });
});
