/**
 * HTTP contract for the optional resource-updates signup on /inheritance-guide.
 *
 * This file is shared by the Angular client and the Node API in
 * `src/server/leads/`, so it must stay framework-free (no Angular or Node
 * imports). The browser only ever knows this contract - never how or where
 * the server stores a signup.
 */

export const LEAD_SIGNUP_RESOURCE_ID = 'family-inheritance-starter-kit';
export const LEAD_SIGNUP_SOURCE = 'inheritance-guide';

export const EMAIL_MAX_LENGTH = 254;
const EMAIL_LOCAL_MAX_LENGTH = 64;

/** Campaign parameters the server is willing to keep; everything else is dropped. */
export const ATTRIBUTION_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'] as const;
export type AttributionKey = (typeof ATTRIBUTION_KEYS)[number];
export type Attribution = Partial<Record<AttributionKey, string>>;
export const ATTRIBUTION_VALUE_MAX_LENGTH = 100;

export interface LeadSignupRequest {
  email: string;
  /** Must be literally `true`; the checkbox is the visitor's affirmative consent. */
  consent: boolean;
  resourceId: string;
  source: string;
  locale: string;
  attribution?: Attribution;
  /** Honeypot. Real visitors never see or fill this field. */
  website?: string;
}

export type LeadSignupErrorCode =
  | 'invalid_request'
  | 'invalid_email'
  | 'consent_required'
  | 'unsupported_resource'
  | 'invalid_locale'
  | 'forbidden_origin'
  | 'method_not_allowed'
  | 'payload_too_large'
  | 'unsupported_media_type'
  | 'rate_limited'
  | 'storage_error'
  | 'unavailable'
  | 'not_found';

export type LeadSignupResponse = { ok: true } | { ok: false; error: LeadSignupErrorCode };

/** Trim and lowercase. Plus-addressing and dots are deliberately preserved. */
export function normalizeEmail(raw: string): string {
  return raw.trim().toLowerCase();
}

const LOCAL_PART = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*$/i;
const DOMAIN = /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/i;

/**
 * A pragmatic syntax check (not full RFC 5322): one `@`, a dot-atom local
 * part and a DNS-style domain with a TLD. Expects an already-trimmed value.
 */
export function isPlausibleEmail(email: string): boolean {
  if (email.length === 0 || email.length > EMAIL_MAX_LENGTH) {
    return false;
  }
  const at = email.lastIndexOf('@');
  if (at <= 0 || at !== email.indexOf('@')) {
    return false;
  }
  const local = email.slice(0, at);
  const domain = email.slice(at + 1);
  return local.length <= EMAIL_LOCAL_MAX_LENGTH && LOCAL_PART.test(local) && domain.length <= 253 && DOMAIN.test(domain);
}

const ATTRIBUTION_VALUE = /^[\p{L}\p{N} _.~+-]+$/u;

/** Keeps only known UTM keys with short, plain values. Returns undefined when nothing survives. */
export function sanitizeAttribution(input: unknown): Attribution | undefined {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    return undefined;
  }
  const source = input as Record<string, unknown>;
  const result: Attribution = {};
  for (const key of ATTRIBUTION_KEYS) {
    const value = source[key];
    if (typeof value !== 'string') {
      continue;
    }
    const trimmed = value.trim();
    if (trimmed && trimmed.length <= ATTRIBUTION_VALUE_MAX_LENGTH && ATTRIBUTION_VALUE.test(trimmed)) {
      result[key] = trimmed;
    }
  }
  return Object.keys(result).length > 0 ? result : undefined;
}
