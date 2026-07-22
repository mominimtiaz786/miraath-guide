import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';

/**
 * SSR-safe JSON-LD injection. Uses `textContent` (never `innerHTML`) so
 * serialized data is never parsed as markup, and looks up existing tags by a
 * stable `data-seo-id` before creating a new one so hydration never
 * duplicates a script the server already rendered.
 */
@Injectable({ providedIn: 'root' })
export class StructuredDataService {
  private readonly document = inject(DOCUMENT);

  set(id: string, data: Record<string, unknown>): void {
    let script = this.document.head.querySelector<HTMLScriptElement>(
      `script[type="application/ld+json"][data-seo-id="${id}"]`,
    );
    if (!script) {
      script = this.document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-seo-id', id);
      this.document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(data);
  }

  remove(id: string): void {
    this.document.head.querySelector(`script[type="application/ld+json"][data-seo-id="${id}"]`)?.remove();
  }
}
