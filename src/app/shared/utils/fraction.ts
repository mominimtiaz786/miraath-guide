/**
 * Exact rational arithmetic for inheritance shares.
 * Inheritance fractions must never be computed with floating point -
 * this class keeps every share as a normalized numerator/denominator pair
 * until the final display step.
 */
export class Fraction {
  readonly numerator: number;
  readonly denominator: number;

  private constructor(numerator: number, denominator: number) {
    if (denominator === 0) {
      throw new Error('Fraction denominator cannot be zero.');
    }
    const sign = denominator < 0 ? -1 : 1;
    const n = sign * numerator;
    const d = sign * denominator;
    const divisor = Fraction.gcd(Math.abs(n), Math.abs(d)) || 1;
    this.numerator = n / divisor;
    this.denominator = d / divisor;
  }

  static of(numerator: number, denominator = 1): Fraction {
    return new Fraction(numerator, denominator);
  }

  static zero(): Fraction {
    return new Fraction(0, 1);
  }

  static one(): Fraction {
    return new Fraction(1, 1);
  }

  private static gcd(a: number, b: number): number {
    let x = a;
    let y = b;
    while (y !== 0) {
      [x, y] = [y, x % y];
    }
    return x;
  }

  add(other: Fraction): Fraction {
    return new Fraction(
      this.numerator * other.denominator + other.numerator * this.denominator,
      this.denominator * other.denominator,
    );
  }

  subtract(other: Fraction): Fraction {
    return new Fraction(
      this.numerator * other.denominator - other.numerator * this.denominator,
      this.denominator * other.denominator,
    );
  }

  multiply(other: Fraction): Fraction {
    return new Fraction(this.numerator * other.numerator, this.denominator * other.denominator);
  }

  divide(other: Fraction): Fraction {
    if (other.numerator === 0) {
      throw new Error('Cannot divide a Fraction by zero.');
    }
    return new Fraction(this.numerator * other.denominator, this.denominator * other.numerator);
  }

  equals(other: Fraction): boolean {
    return this.numerator === other.numerator && this.denominator === other.denominator;
  }

  greaterThan(other: Fraction): boolean {
    return this.numerator * other.denominator > other.numerator * this.denominator;
  }

  lessThan(other: Fraction): boolean {
    return this.numerator * other.denominator < other.numerator * this.denominator;
  }

  isZero(): boolean {
    return this.numerator === 0;
  }

  toPercentage(decimalPlaces = 2): number {
    const raw = (this.numerator / this.denominator) * 100;
    const factor = Math.pow(10, decimalPlaces);
    return Math.round(raw * factor) / factor;
  }

  toDecimal(): number {
    return this.numerator / this.denominator;
  }

  /** Multiplies the fraction by a monetary total and rounds to 2 decimal places. */
  toMoney(total: number): number {
    return Math.round(this.toDecimal() * total * 100) / 100;
  }

  toDisplayString(): string {
    if (this.numerator === 0) {
      return '0';
    }
    if (this.denominator === 1) {
      return `${this.numerator}`;
    }
    return `${this.numerator}/${this.denominator}`;
  }

  /** Common denominator across a set of fractions, for detailed-calculation display. */
  static commonDenominator(fractions: Fraction[]): number {
    if (fractions.length === 0) {
      return 1;
    }
    const lcm = (a: number, b: number): number => (a * b) / (Fraction.gcd(a, b) || 1);
    return fractions.reduce((acc, f) => lcm(acc, f.denominator), 1);
  }

  static sum(fractions: Fraction[]): Fraction {
    return fractions.reduce((acc, f) => acc.add(f), Fraction.zero());
  }
}
