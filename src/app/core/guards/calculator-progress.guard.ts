import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CalculatorStore } from '../../features/calculator/state/calculator-store.service';

/**
 * Review and Results only make sense once the wizard has at least started -
 * this sends a directly-linked or refreshed visitor back to the calculator
 * intro instead of showing an empty, all-zero calculation.
 */
export const calculatorProgressGuard: CanActivateFn = () => {
  const store = inject(CalculatorStore);
  const router = inject(Router);

  if (store.answers().deceasedGender != null) {
    return true;
  }

  return router.parseUrl('/calculator');
};
