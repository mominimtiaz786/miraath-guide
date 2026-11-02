import { Attribution } from '../../app/features/inheritance-guide/lead-signup.contract';

/**
 * Storage boundary for optional resource signups. The HTTP layer validates a
 * request and hands a complete, server-trusted `ResourceSignupInput` to a
 * repository; the repository only decides how it is persisted. A future
 * Google Sheets adapter implements this same interface - nothing in the
 * Angular client or the HTTP layer needs to change.
 */
export interface ResourceSignupInput {
  /** Already normalized (trimmed, lowercased) and syntax-checked. */
  email: string;
  resourceId: string;
  /** Server-side allowlisted version, never taken from the request. */
  resourceVersion: string;
  source: string;
  locale: string;
  consent: {
    updates: true;
    /** Identifies the exact consent wording the visitor saw. */
    textVersion: string;
    /** UTC ISO-8601. */
    capturedAt: string;
  };
  attribution?: Attribution;
}

export interface LeadRepository {
  /**
   * Insert a signup, or refresh the existing record for the same
   * (normalized email, resourceId) pair. Resolves only after the change is
   * durably persisted; rejects with `LeadStorageError` otherwise.
   */
  upsertResourceSignup(input: ResourceSignupInput): Promise<void>;
}

export type LeadStorageErrorCode = 'corrupt' | 'io';

export class LeadStorageError extends Error {
  constructor(
    readonly code: LeadStorageErrorCode,
    message: string,
    options?: { cause?: unknown },
  ) {
    super(message, options);
    this.name = 'LeadStorageError';
  }
}
