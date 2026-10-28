import { dev } from '$app/environment';
import { env } from '$env/dynamic/private';

// Signs the gate's session cookie. Production needs SESSION_SECRET (fail closed without it);
// local dev uses a per-process secret, so sessions end when the dev server restarts.
const devSecret = crypto.randomUUID();
export function sessionSecret(): string | null { return env.SESSION_SECRET || (dev ? devSecret : null); }
export const SESSION_COOKIE = 'snap_session';
