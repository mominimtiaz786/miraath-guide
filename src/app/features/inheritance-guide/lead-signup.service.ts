import { Injectable, InjectionToken, inject } from '@angular/core';
import { LeadSignupRequest, LeadSignupResponse } from './lead-signup.contract';

/**
 * Where the signup is POSTed. Same-origin by default; a deployment that
 * hosts the API elsewhere should proxy this path rather than change
 * component code.
 */
export const LEAD_SIGNUP_ENDPOINT = new InjectionToken<string>('LEAD_SIGNUP_ENDPOINT', {
  providedIn: 'root',
  factory: () => '/api/leads',
});

const REQUEST_TIMEOUT_MS = 15_000;

export type LeadSignupOutcome = 'saved' | 'invalid_email' | 'consent_required' | 'rate_limited' | 'failed';

@Injectable({ providedIn: 'root' })
export class LeadSignupService {
  private readonly endpoint = inject(LEAD_SIGNUP_ENDPOINT);

  async submit(request: LeadSignupRequest): Promise<LeadSignupOutcome> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
    try {
      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        credentials: 'same-origin',
        cache: 'no-store',
        body: JSON.stringify(request),
        signal: controller.signal,
      });
      // A static host without the API answers with an HTML 404 page, which
      // is handled the same as any other unavailable/failed response.
      const body = (await response.json().catch(() => null)) as LeadSignupResponse | null;
      if (response.ok && body?.ok === true) {
        return 'saved';
      }
      if (body && body.ok === false) {
        if (body.error === 'invalid_email' || body.error === 'consent_required' || body.error === 'rate_limited') {
          return body.error;
        }
      }
      return response.status === 429 ? 'rate_limited' : 'failed';
    } catch {
      return 'failed';
    } finally {
      clearTimeout(timer);
    }
  }
}
