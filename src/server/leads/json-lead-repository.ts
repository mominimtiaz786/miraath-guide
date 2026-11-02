import { randomBytes, randomUUID } from 'node:crypto';
import { promises as fs } from 'node:fs';
import { basename, dirname, join } from 'node:path';
import { Attribution, normalizeEmail } from '../../app/features/inheritance-guide/lead-signup.contract';
import { LeadRepository, LeadStorageError, ResourceSignupInput } from './lead-repository';

export const LEAD_SCHEMA_VERSION = 1;

export interface StoredLead {
  id: string;
  email: string;
  resourceId: string;
  resourceVersion: string;
  source: string;
  locale: string;
  createdAt: string;
  updatedAt: string;
  consent: ResourceSignupInput['consent'];
  attribution?: Attribution;
}

export interface LeadDocument {
  schemaVersion: typeof LEAD_SCHEMA_VERSION;
  leads: StoredLead[];
}

/**
 * Persists signups to one private JSON file on the machine running the Node
 * API.
 *
 * Integrity rules:
 * - A missing file is the only case that starts a fresh document. An empty,
 *   malformed or wrong-schema file is reported as `corrupt` and left
 *   untouched - it is never replaced with an empty list.
 * - Every read-modify-write runs through one in-process promise queue, so
 *   concurrent requests can't overwrite each other's changes.
 * - Each write goes to a fresh temp file in the same directory, is fsynced,
 *   then atomically renamed over the target before the call resolves.
 *
 * The queue is per process: run exactly one API process against a given
 * file. There is no inter-process lock.
 */
export class JsonLeadRepository implements LeadRepository {
  private queue: Promise<unknown> = Promise.resolve();

  constructor(
    readonly filePath: string,
    private readonly now: () => Date = () => new Date(),
  ) {}

  upsertResourceSignup(input: ResourceSignupInput): Promise<void> {
    const run = this.queue.then(() => this.upsertNow(input));
    // Keep the chain alive after a failure; the caller still sees the rejection.
    this.queue = run.catch(() => undefined);
    return run;
  }

  private async upsertNow(input: ResourceSignupInput): Promise<void> {
    const document = await this.read();
    const timestamp = this.now().toISOString();
    const email = normalizeEmail(input.email);
    const existing = document.leads.find(
      (lead) => lead.resourceId === input.resourceId && normalizeEmail(lead.email) === email,
    );

    if (existing) {
      existing.updatedAt = timestamp;
      existing.resourceVersion = input.resourceVersion;
      existing.locale = input.locale;
      existing.consent = { ...input.consent };
      // First-touch attribution wins; only fill it if it was never recorded.
      if (!existing.attribution && input.attribution) {
        existing.attribution = { ...input.attribution };
      }
    } else {
      const lead: StoredLead = {
        id: randomUUID(),
        email,
        resourceId: input.resourceId,
        resourceVersion: input.resourceVersion,
        source: input.source,
        locale: input.locale,
        createdAt: timestamp,
        updatedAt: timestamp,
        consent: { ...input.consent },
      };
      if (input.attribution) {
        lead.attribution = { ...input.attribution };
      }
      document.leads.push(lead);
    }

    await this.write(document);
  }

  private async read(): Promise<LeadDocument> {
    let raw: string;
    try {
      raw = await fs.readFile(this.filePath, 'utf8');
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        return { schemaVersion: LEAD_SCHEMA_VERSION, leads: [] };
      }
      throw new LeadStorageError('io', 'Could not read the leads file', { cause: error });
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch (error) {
      throw new LeadStorageError('corrupt', 'The leads file is not valid JSON', { cause: error });
    }
    if (!isLeadDocument(parsed)) {
      throw new LeadStorageError('corrupt', 'The leads file does not match the expected schema');
    }
    return parsed;
  }

  private async write(document: LeadDocument): Promise<void> {
    const directory = dirname(this.filePath);
    const tempPath = join(directory, `.${basename(this.filePath)}.${process.pid}.${randomBytes(6).toString('hex')}.tmp`);
    try {
      await fs.mkdir(directory, { recursive: true, mode: 0o700 });
      const handle = await fs.open(tempPath, 'wx', 0o600);
      try {
        await handle.writeFile(`${JSON.stringify(document, null, 2)}\n`, 'utf8');
        await handle.sync();
      } finally {
        await handle.close();
      }
      await fs.rename(tempPath, this.filePath);
    } catch (error) {
      await fs.rm(tempPath, { force: true }).catch(() => undefined);
      throw new LeadStorageError('io', 'Could not write the leads file', { cause: error });
    }
    await syncDirectory(directory);
  }
}

/** Best effort: persist the rename itself. Not supported on every platform. */
async function syncDirectory(directory: string): Promise<void> {
  try {
    const handle = await fs.open(directory, 'r');
    try {
      await handle.sync();
    } finally {
      await handle.close();
    }
  } catch {
    // Directory fsync is unavailable on some platforms (e.g. Windows).
  }
}

const isString = (value: unknown): value is string => typeof value === 'string';

function isStoredLead(value: unknown): value is StoredLead {
  if (!value || typeof value !== 'object') {
    return false;
  }
  const lead = value as Record<string, unknown>;
  const consent = lead['consent'] as Record<string, unknown> | undefined;
  return (
    isString(lead['id']) &&
    isString(lead['email']) &&
    isString(lead['resourceId']) &&
    isString(lead['resourceVersion']) &&
    isString(lead['source']) &&
    isString(lead['locale']) &&
    isString(lead['createdAt']) &&
    isString(lead['updatedAt']) &&
    !!consent &&
    typeof consent === 'object' &&
    consent['updates'] === true &&
    isString(consent['textVersion']) &&
    isString(consent['capturedAt']) &&
    (lead['attribution'] === undefined || (typeof lead['attribution'] === 'object' && lead['attribution'] !== null))
  );
}

export function isLeadDocument(value: unknown): value is LeadDocument {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }
  const document = value as Record<string, unknown>;
  return (
    document['schemaVersion'] === LEAD_SCHEMA_VERSION &&
    Array.isArray(document['leads']) &&
    document['leads'].every(isStoredLead)
  );
}
