import { redirect, type Handle } from '@sveltejs/kit';
import { legacyPath } from '$lib/content/routes';

export const handle: Handle = async ({ event, resolve }) => {
  const moved = legacyPath(event.url.pathname);
  if (moved) redirect(308, moved + event.url.search);
  return resolve(event);
};
