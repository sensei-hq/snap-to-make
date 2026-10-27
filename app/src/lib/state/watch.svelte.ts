export interface BurnEvent { atSec: number; kind: string; note: string }
export class WatchState {
  events = $state<BurnEvent[]>([]);
  positionSec = $state(42);
  checked = $state(false);
  get alert() { return this.events.find(e => /flare/i.test(e.kind + e.note)) ?? null; }
  async load() { const r = await fetch('/api/watch', { method: 'POST' }).then(x => x.json()); this.events = r.events ?? []; }
  replay() { if (this.alert) this.positionSec = this.alert.atSec; }
  acknowledge() { this.checked = true; }
}
