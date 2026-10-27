import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { checkInvite } from '$lib/server/guard';
const VALID = (env.SNAP_INVITE_CODES ?? 'DEMO-JUDGES,DEMO-LOCAL').split(',');
export async function POST({ request, cookies }) {
  const { code, attested18 } = await request.json();
  const r = checkInvite(String(code ?? ''), Boolean(attested18), VALID);
  if (!r.ok) return json({ ok: false, reason: r.reason }, { status: 403 });
  const id = crypto.randomUUID();
  cookies.set('snap_session', id, { path: '/', httpOnly: true, sameSite: 'lax', maxAge: 86400 });
  return json({ ok: true, sessionId: id });
}
