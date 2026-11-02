import { isAbsolute, relative, resolve } from 'node:path';

export const DEFAULT_LEADS_JSON_PATH = './var/miraath-guide/leads.json';
export const DEFAULT_ALLOWED_ORIGINS = ['https://miraath-guide.islamictools.app'];

export interface LeadsConfig {
  /** `json` stores signups in `jsonPath`; `none` makes the API answer 503. */
  driver: 'json' | 'none';
  /** Absolute path of the JSON file (only meaningful when driver is `json`). */
  jsonPath: string;
  /** Exact origins allowed to POST, in addition to the request's own host. */
  allowedOrigins: string[];
  /** Value for Express `trust proxy`, or undefined to leave it off. */
  trustProxy: number | string | undefined;
  rateLimit: { max: number; windowMs: number };
  /** Non-sensitive configuration problems, safe to log. */
  problems: string[];
}

interface ReadOptions {
  env?: Record<string, string | undefined>;
  cwd?: string;
  /** Directories the JSON file must never live inside (public assets, build output, sources). */
  forbiddenRoots?: string[];
}

const isInside = (child: string, parent: string): boolean => {
  const rel = relative(parent, child);
  return rel === '' || (!!rel && !rel.startsWith('..') && !isAbsolute(rel));
};

const positiveInt = (raw: string | undefined, fallback: number): number => {
  const value = raw === undefined ? NaN : Number(raw);
  return Number.isInteger(value) && value > 0 ? value : fallback;
};

/**
 * Reads lead-storage settings from the environment. Pure: performs no
 * filesystem access, so importing the server during build/prerender never
 * creates files.
 */
export function readLeadsConfig(options: ReadOptions = {}): LeadsConfig {
  const env = options.env ?? process.env;
  const cwd = options.cwd ?? process.cwd();
  const problems: string[] = [];

  const rawDriver = (env['LEADS_STORAGE_DRIVER'] ?? 'none').trim().toLowerCase();
  let driver: LeadsConfig['driver'] = 'none';
  if (rawDriver === 'json') {
    driver = 'json';
  } else if (rawDriver !== 'none' && rawDriver !== '') {
    problems.push(`Unknown LEADS_STORAGE_DRIVER "${rawDriver}"; signup storage is disabled.`);
  }

  const jsonPath = resolve(cwd, env['LEADS_JSON_PATH']?.trim() || DEFAULT_LEADS_JSON_PATH);
  const forbiddenRoots = [
    resolve(cwd, 'public'),
    resolve(cwd, 'src'),
    resolve(cwd, 'dist'),
    ...(options.forbiddenRoots ?? []),
  ];
  if (driver === 'json' && forbiddenRoots.some((root) => isInside(jsonPath, root))) {
    problems.push('LEADS_JSON_PATH points inside public assets, sources or build output; signup storage is disabled.');
    driver = 'none';
  }

  const configuredOrigins = (env['LEADS_ALLOWED_ORIGINS'] ?? '')
    .split(',')
    .map((origin) => origin.trim().replace(/\/+$/, ''))
    .filter(Boolean);

  const rawTrustProxy = env['LEADS_TRUST_PROXY']?.trim();
  let trustProxy: LeadsConfig['trustProxy'];
  if (rawTrustProxy) {
    if (rawTrustProxy === 'true') {
      problems.push('LEADS_TRUST_PROXY=true would trust any forwarded IP header; ignoring it. Use a hop count or proxy address.');
    } else if (/^\d+$/.test(rawTrustProxy)) {
      trustProxy = Number(rawTrustProxy);
    } else {
      trustProxy = rawTrustProxy;
    }
  }

  return {
    driver,
    jsonPath,
    allowedOrigins: configuredOrigins.length > 0 ? configuredOrigins : DEFAULT_ALLOWED_ORIGINS,
    trustProxy,
    rateLimit: {
      max: positiveInt(env['LEADS_RATE_LIMIT_MAX'], 10),
      windowMs: positiveInt(env['LEADS_RATE_LIMIT_WINDOW_MS'], 15 * 60 * 1000),
    },
    problems,
  };
}

/** A one-line, PII-free startup summary. */
export function describeLeadsConfig(config: LeadsConfig): string {
  return config.driver === 'json'
    ? `[leads] Signup storage: JSON file at ${config.jsonPath} (single-writer; run one API process per file)`
    : '[leads] Signup storage: disabled (POST /api/leads answers 503). Set LEADS_STORAGE_DRIVER=json to enable.';
}
