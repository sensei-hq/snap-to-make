import { getContext, setContext } from 'svelte';
import { AppState } from './app.svelte';

const KEY = Symbol('katachi-app');

/** Called once, by routes/snap/+layout.svelte. */
export function provideApp(): AppState { return setContext(KEY, new AppState()); }

/** Every page and shell component reads the shared state through this. */
export function useApp(): AppState { return getContext<AppState>(KEY); }
