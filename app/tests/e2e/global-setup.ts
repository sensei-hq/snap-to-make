import { request, type FullConfig } from '@playwright/test';
import { inviteCode } from './invite';

export const AUTH_STATE = 'test-results/.auth/session.json';

/** Enter through the gate once; every spec starts signed in (the gate spec opts out). */
export default async function globalSetup(config: FullConfig) {
  const baseURL = config.projects[0].use.baseURL!;
  const ctx = await request.newContext({ baseURL });
  const r = await ctx.post('/api/gate', { data: { code: inviteCode(), attested18: true } });
  if (!r.ok()) throw new Error(`gate refused the e2e invite: ${r.status()}`);
  await ctx.storageState({ path: AUTH_STATE });
  await ctx.dispose();
}
