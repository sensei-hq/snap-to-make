import { json, redirect, type Handle } from '@sveltejs/kit';
import { legacyPath } from '$lib/content/routes';
import { isPublicPath, verifySession } from '$lib/server/guard';
import { SESSION_COOKIE, sessionSecret } from '$lib/server/session';

// 1. old /snap links move to the root routes; 2. the gate: no valid signed session → no pages and no API.
export const handle: Handle = async ({ event, resolve }) => {
  const path = event.url.pathname;
  const moved = legacyPath(path);
  if (moved) redirect(308, moved + event.url.search);

  const secret = sessionSecret();
  const id = secret ? await verifySession(event.cookies.get(SESSION_COOKIE), secret) : null;
  event.locals.session = id ? { id } : null;
  if (!id && !isPublicPath(path)) {
    if (path.startsWith('/api/')) return json({ ok: false, reason: 'Enter through the gate first' }, { status: 401 });
    redirect(303, '/');
  }
  return resolve(event);
};
