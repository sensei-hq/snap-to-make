export class SessionState {
  code = $state('');
  attested = $state(false);
  safetyAck = $state(false);
  noPersonalAck = $state(false);
  msg = $state('');
  get canEnter() { return this.code.trim().length > 0 && this.attested && this.safetyAck && this.noPersonalAck; }
  sessionId = $state<string | null>(null);
  inviteCode = $state('');
  attested18 = $state(false);
  get gated() { return Boolean(this.sessionId); }
  accept(id: string, inviteCode: string) { this.sessionId = id; this.inviteCode = inviteCode; this.attested18 = true; }
  async enter(code: string, attested: boolean): Promise<boolean> {
    const r = await fetch('/api/gate', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ code, attested18: attested }) });
    const data = await r.json().catch(() => ({}));
    if (r.ok && data.sessionId) this.accept(String(data.sessionId), code);
    return r.ok;
  }
  async enterFromForm(): Promise<boolean> {
    if (!this.canEnter) { this.msg = 'Invalid invite or attestation required'; return false; }
    const ok = await this.enter(this.code, this.attested);
    this.msg = ok ? 'Welcome — opening workshop' : 'Invalid invite or attestation required';
    return ok;
  }
}
