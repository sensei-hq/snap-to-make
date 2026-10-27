import { describe, it, expect } from 'vitest';
import { checkInvite, BudgetGuard } from './guard';
describe('invite + budget guard (R-PL-2/4/7)', () => {
  it('accepts seeded invite, rejects wrong code and missing attestation', () => {
    expect(checkInvite('DEMO-JUDGES', true, ['DEMO-JUDGES']).ok).toBe(true);
    expect(checkInvite('NOPE', true, ['DEMO-JUDGES']).ok).toBe(false);
    expect(checkInvite('DEMO-JUDGES', false, ['DEMO-JUDGES']).ok).toBe(false);
  });
  it('trips at cap and kill switch blocks everything', () => {
    const g = new BudgetGuard(1, 10);
    g.charge(0.6); expect(g.tripped).toBe(false);
    g.charge(0.5); expect(g.tripped).toBe(true);
    const k = new BudgetGuard(1, 10, true); expect(k.blocked).toBe(true);
  });
  it('retries 429 with backoff then succeeds', async () => {
    let n = 0;
    const r = await BudgetGuard.withRetry(async () => { n++; if (n < 3) throw Object.assign(new Error('rate'), { status: 429 }); return 'ok'; }, 3, 1);
    expect(r).toBe('ok'); expect(n).toBe(3);
  });
});
