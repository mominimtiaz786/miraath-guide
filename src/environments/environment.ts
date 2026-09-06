/**
 * Web / SSR build settings. Replaced at build time by `environment.app.ts`
 * for the Capacitor (native) target via `fileReplacements` in angular.json.
 */
export const environment = {
  /** True only inside the packaged mobile app build. */
  appBuild: false,
  /**
   * Canonical/hreflang links and JSON-LD only mean something to a crawler.
   * They are inert weight inside a WebView, so the app build switches them off.
   */
  enableSeo: true,
};
