import express, { NextFunction, Request, Response, Router } from 'express';
import {
  LEAD_SIGNUP_RESOURCE_ID,
  LEAD_SIGNUP_SOURCE,
  LeadSignupErrorCode,
  LeadSignupResponse,
  isPlausibleEmail,
  normalizeEmail,
  sanitizeAttribution,
} from '../../app/features/inheritance-guide/lead-signup.contract';
import { isAppLocale } from '../../app/i18n/config/locale.config';
import { LeadRepository, LeadStorageError, ResourceSignupInput } from './lead-repository';
import { LeadsConfig } from './leads-config';

/**
 * Server-side allowlist. The client names a resource; the version and the
 * consent wording identifier always come from here, never from the request.
 */
const RESOURCES: Record<string, { version: string; consentTextVersion: string; sources: readonly string[] }> = {
  [LEAD_SIGNUP_RESOURCE_ID]: {
    version: '1.0',
    consentTextVersion: 'inheritance-guide-updates-v1',
    sources: [LEAD_SIGNUP_SOURCE],
  },
};

const BODY_LIMIT = '4kb';

interface LeadsApiOptions {
  config: Pick<LeadsConfig, 'allowedOrigins' | 'rateLimit'>;
  /** `null` when storage is disabled or misconfigured: the API answers 503. */
  repository: LeadRepository | null;
  now?: () => Date;
}

const send = (res: Response, status: number, body: LeadSignupResponse): void => {
  res.status(status).set('Cache-Control', 'no-store').json(body);
};

const fail = (res: Response, status: number, error: LeadSignupErrorCode): void => send(res, status, { ok: false, error });

/**
 * Router for `/api`. Mount it before static files and the Angular handler so
 * API errors are always JSON, never an HTML page.
 */
export function createLeadsApi({ config, repository, now = () => new Date() }: LeadsApiOptions): Router {
  const router = express.Router();
  const allowedOrigins = new Set(config.allowedOrigins);
  const limiter = createRateLimiter(config.rateLimit.max, config.rateLimit.windowMs, now);

  const checkOrigin = (req: Request, res: Response, next: NextFunction): void => {
    const origin = req.get('origin');
    if (!origin) {
      fail(res, 403, 'forbidden_origin');
      return;
    }
    let sameHost = false;
    try {
      sameHost = new URL(origin).host === req.get('host');
    } catch {
      // Malformed Origin header: treated as not allowed.
    }
    if (sameHost || allowedOrigins.has(origin)) {
      next();
      return;
    }
    fail(res, 403, 'forbidden_origin');
  };

  const requireJson = (req: Request, res: Response, next: NextFunction): void => {
    if (req.is('application/json')) {
      next();
    } else {
      fail(res, 415, 'unsupported_media_type');
    }
  };

  const rateLimit = (req: Request, res: Response, next: NextFunction): void => {
    const retryAfterSeconds = limiter(req.ip ?? 'unknown');
    if (retryAfterSeconds === 0) {
      next();
      return;
    }
    res.set('Retry-After', String(retryAfterSeconds));
    fail(res, 429, 'rate_limited');
  };

  const requireStorage = (_req: Request, res: Response, next: NextFunction): void => {
    if (repository) {
      next();
    } else {
      fail(res, 503, 'unavailable');
    }
  };

  router.post(
    '/leads',
    checkOrigin,
    requireJson,
    rateLimit,
    requireStorage,
    express.json({ limit: BODY_LIMIT, strict: true }),
    async (req: Request, res: Response) => {
      const parsed = parseSignup(req.body, now);
      if ('error' in parsed) {
        fail(res, 400, parsed.error);
        return;
      }
      if (parsed.honeypot) {
        // Looks like a bot: answer exactly like a success, store nothing.
        send(res, 200, { ok: true });
        return;
      }
      try {
        await repository!.upsertResourceSignup(parsed.input);
        // Same response for new and repeat signups, so it never reveals whether an address exists.
        send(res, 200, { ok: true });
      } catch (error) {
        const code = error instanceof LeadStorageError ? error.code : 'unexpected';
        console.error(`[leads] Signup not saved: storage ${code} error`);
        fail(res, 500, 'storage_error');
      }
    },
  );

  router.all('/leads', (_req, res) => {
    res.set('Allow', 'POST');
    fail(res, 405, 'method_not_allowed');
  });

  router.use((_req, res) => fail(res, 404, 'not_found'));

  // Body-parser failures (malformed or oversized JSON) and anything unexpected.
  router.use((error: { type?: string; status?: number }, _req: Request, res: Response, _next: NextFunction) => {
    void _next;
    if (error.type === 'entity.too.large') {
      fail(res, 413, 'payload_too_large');
    } else if (error.type === 'entity.parse.failed' || error.status === 400) {
      fail(res, 400, 'invalid_request');
    } else {
      console.error('[leads] Unexpected API error');
      fail(res, 500, 'storage_error');
    }
  });

  return router;
}

type ParseResult = { input: ResourceSignupInput; honeypot: boolean } | { error: LeadSignupErrorCode };

function parseSignup(body: unknown, now: () => Date): ParseResult {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return { error: 'invalid_request' };
  }
  const data = body as Record<string, unknown>;
  const honeypot = typeof data['website'] === 'string' && data['website'].trim() !== '';

  if (typeof data['email'] !== 'string') {
    return { error: 'invalid_email' };
  }
  const email = normalizeEmail(data['email']);
  if (!isPlausibleEmail(email)) {
    return { error: 'invalid_email' };
  }
  if (data['consent'] !== true) {
    return { error: 'consent_required' };
  }

  const resourceId = data['resourceId'];
  const resource = typeof resourceId === 'string' ? RESOURCES[resourceId] : undefined;
  const source = data['source'];
  if (!resource || typeof source !== 'string' || !resource.sources.includes(source)) {
    return { error: 'unsupported_resource' };
  }

  const locale = data['locale'];
  if (typeof locale !== 'string' || !isAppLocale(locale)) {
    return { error: 'invalid_locale' };
  }

  const input: ResourceSignupInput = {
    email,
    resourceId: resourceId as string,
    resourceVersion: resource.version,
    source,
    locale,
    consent: { updates: true, textVersion: resource.consentTextVersion, capturedAt: now().toISOString() },
  };
  const attribution = sanitizeAttribution(data['attribution']);
  if (attribution) {
    input.attribution = attribution;
  }
  return { input, honeypot };
}

/**
 * Fixed-window, in-memory limiter keyed by client IP. Suitable for the
 * documented single-instance deployment only. Returns 0 when allowed,
 * otherwise the seconds until the window resets.
 */
function createRateLimiter(max: number, windowMs: number, now: () => Date): (key: string) => number {
  const hits = new Map<string, { count: number; resetAt: number }>();
  return (key) => {
    const time = now().getTime();
    if (hits.size > 10_000) {
      for (const [k, entry] of hits) {
        if (entry.resetAt <= time) {
          hits.delete(k);
        }
      }
    }
    const entry = hits.get(key);
    if (!entry || entry.resetAt <= time) {
      hits.set(key, { count: 1, resetAt: time + windowMs });
      return 0;
    }
    entry.count += 1;
    return entry.count > max ? Math.max(1, Math.ceil((entry.resetAt - time) / 1000)) : 0;
  };
}
