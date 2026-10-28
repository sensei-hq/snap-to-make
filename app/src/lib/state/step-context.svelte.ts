import { onDestroy, type Snippet } from 'svelte';
import { MediaQuery } from 'svelte/reactivity';
import type { AppState } from './app.svelte';

/** The studio breakpoint (uno.config.js `md`): rail + work area + assistant column from here up. */
export const STUDIO_QUERY = 'min-width: 1024px';

/**
 * A step page's context card (inspector, gap rule, send-to): in the studio it sits above the Katachi chat
 * (mockups/desktop); on phones it stays inline in the page (mockups/mobile). Call during page init.
 */
export function stepContext(app: AppState, title: string, body: Snippet) {
  const wide = new MediaQuery(STUDIO_QUERY, false);
  $effect(() => { if (wide.current) app.setInfo(title, body); else app.clearInfo(body); });
  onDestroy(() => app.clearInfo(body));
  return { get wide() { return wide.current; }, get inline() { return wide.current ? null : body; } };
}
