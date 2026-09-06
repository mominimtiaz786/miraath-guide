import { Injectable, inject } from '@angular/core';
import { PlatformService } from './platform.service';

/**
 * A plugin handed back inside a box.
 *
 * Capacitor plugin objects are Proxies that turn *every* property read into a
 * native method call - `then` included. That makes a plugin look like a
 * thenable, so an `async` function which resolves to one makes the runtime
 * call `Plugin.then()` while settling the promise, which rejects outside any
 * try/catch. Wrapping keeps a proxy from ever being a promise's resolution
 * value.
 */
interface Loaded<T> {
  readonly plugin: T;
}

/**
 * The single place Capacitor plugins are loaded.
 *
 * Every plugin is pulled in with a dynamic `import()` behind an `isNative`
 * check, which means the web build never downloads (or even ships) the
 * plugin chunks, and SSR never evaluates code that expects a WebView. Each
 * accessor resolves to `null` on the web so callers can branch on a value
 * rather than duplicating the platform check.
 */
@Injectable({ providedIn: 'root' })
export class NativeBridgeService {
  private readonly platform = inject(PlatformService);

  /**
   * `importer` must resolve to a module namespace, never to a plugin: `pick`
   * reaches into it synchronously, after the await, for the reason above.
   */
  private async load<M, T>(importer: () => Promise<M>, pick: (module: M) => T): Promise<Loaded<T> | null> {
    if (!this.platform.isNative) {
      return null;
    }
    try {
      const module = await importer();
      return { plugin: pick(module) };
    } catch {
      return null;
    }
  }

  preferences() {
    return this.load(() => import('@capacitor/preferences'), (m) => m.Preferences);
  }

  /** The whole module - callers need `Directory` alongside `Filesystem`. */
  filesystem() {
    return this.load(
      () => import('@capacitor/filesystem'),
      (m) => ({ Filesystem: m.Filesystem, Directory: m.Directory }),
    );
  }

  share() {
    return this.load(() => import('@capacitor/share'), (m) => m.Share);
  }

  app() {
    return this.load(() => import('@capacitor/app'), (m) => m.App);
  }

  /** `Style` is an enum, not a proxy, but travels with the plugin for convenience. */
  statusBar() {
    return this.load(
      () => import('@capacitor/status-bar'),
      (m) => ({ StatusBar: m.StatusBar, Style: m.Style }),
    );
  }

  splashScreen() {
    return this.load(() => import('@capacitor/splash-screen'), (m) => m.SplashScreen);
  }
}
