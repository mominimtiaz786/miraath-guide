import { Injectable } from '@angular/core';
import { CalculatorAnswers } from '../models/calculator-answers.model';
import { DerivedFacts } from '../models/derived-facts.model';
import { deriveFacts } from './derive-facts';

@Injectable({ providedIn: 'root' })
export class DerivedFactsService {
  derive(answers: CalculatorAnswers): DerivedFacts {
    return deriveFacts(answers);
  }
}
