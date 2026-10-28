export interface BurnEvent { atSec: number; kind: string; note: string }
export class WatchState {
  events = $state<BurnEvent[]>([]);
  positionSec = $state(42);
  checked = $state(false);
  clipSec = $state(58);
  selectedAt = $state<number | null>(null);
  get selected() { return this.events.find((e) => e.atSec === (this.selectedAt ?? this.alert?.atSec)) ?? this.events[0] ?? null; }
  get showAlert() { return !!this.alert && !this.checked; }
  selectEvent(atSec: number) { this.selectedAt = atSec; }
  get alert() { return this.events.find(e => /flare/i.test(e.kind + e.note)) ?? null; }
  async load() { const r = await fetch('/api/watch', { method: 'POST' }).then(x => x.json()); this.events = r.events ?? []; if (r.clipSec) this.clipSec = r.clipSec; }
  replay() { if (this.alert) this.positionSec = this.alert.atSec; }
  acknowledge() { this.checked = true; }
}
