import express from 'express';
import { JsonLeadRepository } from './json-lead-repository';
import { createLeadsApi } from './leads-api';
import { describeLeadsConfig, readLeadsConfig } from './leads-config';

/**
 * The lead API on its own, without Angular. Used for local development
 * (`ng serve` does not run the Express routes in src/server.ts, so the dev
 * server proxies /api here - see proxy.conf.json) and as an option for a
 * persistent Node host behind a static site. Start it with
 * `npm run api:leads`.
 */
export function startStandaloneLeadsApi(): void {
  const config = readLeadsConfig();
  config.problems.forEach((problem) => console.warn(`[leads] ${problem}`));

  const app = express();
  app.disable('x-powered-by');
  if (config.trustProxy !== undefined) {
    app.set('trust proxy', config.trustProxy);
  }
  app.use(
    '/api',
    createLeadsApi({
      config,
      repository: config.driver === 'json' ? new JsonLeadRepository(config.jsonPath) : null,
    }),
  );
  app.use((_req, res) => {
    res.status(404).set('Cache-Control', 'no-store').json({ ok: false, error: 'not_found' });
  });

  const host = process.env['LEADS_API_HOST'] || '127.0.0.1';
  const port = Number(process.env['LEADS_API_PORT']) || 4301;
  app.listen(port, host, () => {
    console.log(`[leads] API listening on http://${host}:${port}/api/leads`);
    console.log(describeLeadsConfig(config));
  });
}
