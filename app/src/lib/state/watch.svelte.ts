export interface BurnEvent { atSec: number; kind: string; note: string }
/** What Burn Watch found for one cut (sheet) of the craft. */
export interface CutWatch { events: BurnEvent[]; clipSec: number; checked: boolean }

const isFlare = (e: BurnEvent) => /flare/i.test(e.kind + e.note);

// Burn Watch: one watch per cut. The selected cut's clip, events and alert are what the stage shows;
// every watched cut keeps its result so the cut list can show "2 alerts" or "clean".
export class WatchState {
  events = $state<BurnEvent[]>([]);
  positionSec = $state(42);
  checked = $state(false);
  clipSec = $state(58);
  selectedAt = $state<number | null>(null);
  /** the cut (sheet number) on the stage; null = the demo clip, no craft open */
  sheet = $state<number | null>(null);
  watched = $state<Record<number, CutWatch>>({});
  get selected() { return this.events.find((e) => e.atSec === (this.selectedAt ?? this.alert?.atSec)) ?? this.events[0] ?? null; }
  get showAlert() { return !!this.alert && !this.checked; }
  selectEvent(atSec: number) { this.selectedAt = atSec; }
  get alert() { return this.events.find(isFlare) ?? null; }
  /** Spark + SAM 3.1 analyse the clip (server route /api/watch; fixture events until a real clip is uploaded). */
  async load() { const r = await fetch('/api/watch', { method: 'POST' }).then(x => x.json()); this.events = r.events ?? []; if (r.clipSec) this.clipSec = r.clipSec; }
  /** Watch one cut: analyse its clip and keep the result against the sheet. */
  async watchSheet(n: number) {
    this.sheet = n; this.selectedAt = null;
    const seen = this.watched[n];
    if (seen) { this.events = seen.events; this.clipSec = seen.clipSec; this.checked = seen.checked; return; }
    this.checked = false;
    await this.load();
    this.watched = { ...this.watched, [n]: { events: this.events, clipSec: this.clipSec, checked: false } };
  }
  /** show a cut that was already watched (no new analysis) */
  showSheet(n: number) { if (this.watched[n]) void this.watchSheet(n); else this.sheet = n; }
  /** alerts on a watched cut, or null when it was not watched yet */
  alertsOn(n: number): number | null { const w = this.watched[n]; return w ? (w.checked ? 0 : w.events.filter(isFlare).length) : null; }
  replay() { if (this.alert) this.positionSec = this.alert.atSec; }
  acknowledge() {
    this.checked = true;
    if (this.sheet != null && this.watched[this.sheet]) this.watched = { ...this.watched, [this.sheet]: { ...this.watched[this.sheet], checked: true } };
  }
  reset() { this.sheet = null; this.watched = {}; this.events = []; this.checked = false; this.selectedAt = null; }
}
