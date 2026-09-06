import { ApplicationConfig, inject, provideAppInitializer, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';

import { AppStorageService } from './core/platform/app-storage.service';
import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(
      routes,
      withInMemoryScrolling({ scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled' }),
    ),
    provideClientHydration(withEventReplay()),
    // Copies anything the WebView's localStorage has lost back out of the
    // native preference store before the first component reads it. Resolves
    // immediately (and does nothing) on the web and during SSR.
    provideAppInitializer(() => inject(AppStorageService).hydrate()),
  ],
};
