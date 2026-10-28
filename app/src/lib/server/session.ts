import { dev } from '$app/environment';
import { env } from '$env/dynamic/private';

// Signs the gate's session cookie. Production needs SESSION_SECRET (fail closed without it);
// local dev uses a per-process secret, so sessions end when the dev server restarts.
// Made on first use: Workers forbid generating random values in global scope.
let devSecret: string | null = null;
export function sessionSecret(): string | null {
  if (env.SESSION_SECRET) return env.SESSION_SECRET;
  if (!dev) return null;
  return (devSecret ??= crypto.randomUUID());
}
export const SESSION_COOKIE = 'snap_session';
