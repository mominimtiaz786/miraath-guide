import { Injectable, inject } from '@angular/core';
import { NativeBridgeService } from './native-bridge.service';
import { PlatformService } from './platform.service';

/** Namespace every key we own, so `hydrate()` can never resurrect a foreign key. */
const KEY_PREFIX = 'mirath-guide.';

/**
 * `session` is state that is meaningful for one sitting (an in-progress
 * calculation); `persistent` outlives it (the chosen language).
 *
 * On the web those map onto `sessionStorage`/`localStorage` as you would
 * expect. On native the distinction collapses: a WebView's `sessionStorage`
 * is destroyed the moment the OS reclaims the app process, which would throw
 * away a half-finished wizard just for backgrounding the app - so both
 * scopes use `localStorage` there.
 */
export type StorageScope = 'session' | 'persistent';

/**
 * Synchronous key/value storage with a durable native backup.
 *
 * The API is deliberately synchronous: `CalculatorStore` and `LocaleService`
 * both need their persisted value while constructing initial signal state,
 * and threading a promise through that would mean rendering an empty wizard
 * first and correcting it a frame later. Capacitor's `Preferences` (which is
 * async, and survives the WebView storage eviction iOS performs on apps that
 * sit unused) is therefore used as a write-behind mirror rather than as the
 * primary store: writes fan out to it in the background, and `hydrate()`
 * copies anything missing back into `localStorage` before the app boots.
 */
@Injectable({ providedIn: 'root' })
export class AppStorageService {
  private readonly platform = inject(PlatformService);
  private readonly bridge = inject(NativeBridgeService);

  read(key: string, scope: StorageScope = 'session'): string | null {
    const store = this.backingStore(scope);
    if (!store) {
      return null;
    }
    try {
      return store.getItem(KEY_PREFIX + key);
    } catch {
      return null;
    }
  }

  write(key: string, value: string, scope: StorageScope = 'session'): void {
    const store = this.backingStore(scope);
    if (!store) {
      return;
    }
    try {
      store.setItem(KEY_PREFIX + key, value);
    } catch {
      // Private browsing or a full quota - in-memory state is still correct.
    }
    void this.mirrorWrite(key, value);
  }

  remove(key: string, scope: StorageScope = 'session'): void {
    const store = this.backingStore(scope);
    if (!store) {
      return;
    }
    try {
      store.removeItem(KEY_PREFIX + key);
    } catch {
      // Nothing to do - the caller has already cleared its in-memory copy.
    }
    void this.mirrorRemove(key);
  }

  /**
   * Restores any key the WebView has lost but the native preference store
   * still holds. Runs once, before bootstrap, so the synchronous readers
   * above see a fully populated `localStorage`.
   */
  async hydrate(): Promise<void> {
    // Runs as an app initializer, so it must never reject: a convenience
    // restore is not worth blocking the launch over. The whole body is inside
    // the guard for that reason.
    try {
      if (!this.platform.isNative) {
        return;
      }
      const preferences = await this.bridge.preferences();
      if (!preferences) {
        return;
      }
      const { keys } = await preferences.plugin.keys();
      await Promise.all(
        keys
          .filter((key) => key.startsWith(KEY_PREFIX))
          .map(async (key) => {
            if (localStorage.getItem(key) !== null) {
              return;
            }
            const { value } = await preferences.plugin.get({ key });
            if (value !== null) {
              localStorage.setItem(key, value);
            }
          }),
      );
    } catch {
      // A cold, empty preference store is the normal first-launch case.
    }
  }

  private backingStore(scope: StorageScope): Storage | null {
    if (!this.platform.isBrowser) {
      return null;
    }
    try {
      return scope === 'persistent' || this.platform.isNative ? localStorage : sessionStorage;
    } catch {
      return null;
    }
  }

  private async mirrorWrite(key: string, value: string): Promise<void> {
    try {
      const preferences = await this.bridge.preferences();
      await preferences?.plugin.set({ key: KEY_PREFIX + key, value });
    } catch {
      // localStorage already holds the value; the mirror is a backup only.
    }
  }

  private async mirrorRemove(key: string): Promise<void> {
    try {
      const preferences = await this.bridge.preferences();
      await preferences?.plugin.remove({ key: KEY_PREFIX + key });
    } catch {
      // As above - the authoritative delete has already happened.
    }
  }
}
