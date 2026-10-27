// Server-only guard (R-PL-2/4/5/7). Invite list comes from snap.invites at runtime; pure helpers tested here.
export function checkInvite(code: string, attested18: boolean, validCodes: string[]): { ok: boolean; reason?: string } {
  if (!attested18) return { ok: false, reason: 'Age attestation required' };
  if (!validCodes.includes(code.trim())) return { ok: false, reason: 'Invalid invite code' };
  return { ok: true };
}
export class BudgetGuard {
  spentSession = 0; spentDay = 0;
  constructor(private sessionCap = 1, private dayCap = 10, private killSwitch = false) {}
  get blocked() { return this.killSwitch; }
  get tripped() { return this.killSwitch || this.spentSession >= this.sessionCap || this.spentDay >= this.dayCap; }
  charge(usd: number) { this.spentSession += usd; this.spentDay += usd; }
  static async withRetry<T>(fn: () => Promise<T>, max = 3, baseMs = 250): Promise<T> {
    let last: unknown;
    for (let i = 0; i < max; i++) {
      try { return await fn(); } catch (e) {
        last = e; const status = (e as { status?: number })?.status;
        if (status !== 429 && status !== 503) throw e;
        if (i < max - 1) await new Promise(r => setTimeout(r, baseMs * 2 ** i));
      }
    }
    throw last;
  }
}
