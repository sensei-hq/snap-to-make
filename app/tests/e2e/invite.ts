import { readFileSync } from 'node:fs';

/** A valid invite code for the e2e run: SNAP_INVITE_CODES from the environment or app/.env (never hardcoded). */
export function inviteCode(): string {
  const raw = process.env.SNAP_INVITE_CODES ?? readFileSync(new URL('../../.env', import.meta.url), 'utf8').match(/^SNAP_INVITE_CODES=(.*)$/m)?.[1] ?? '';
  const code = raw.split(',').map((c) => c.trim()).find(Boolean);
  if (!code) throw new Error('Set SNAP_INVITE_CODES (app/.env) for the e2e run');
  return code;
}
