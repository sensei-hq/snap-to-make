export interface TraceEntry { model: string; purpose: string; latencyMs: number; costUsd: number }
export class TraceState {
  entries = $state<TraceEntry[]>([]);
  constructor(private capUsd = 1) {}
  /** told about every live call (AppState posts it in the chat) */
  onAdd: ((e: TraceEntry) => void) | null = null;
  add(e: TraceEntry) { this.entries = [...this.entries, e]; this.onAdd?.(e); }
  get totalCostUsd() { return this.entries.reduce((s, e) => s + e.costUsd, 0); }
  get modelCount() { return this.entries.reduce<string[]>((acc, e) => (acc.includes(e.model) ? acc : [...acc, e.model]), []).length; }
  get budgetTripped() { return this.totalCostUsd >= this.capUsd; }
  get totalMs() { return this.entries.reduce((s, e) => s + e.latencyMs, 0); }
  get modelShares() { const acc: { model: string; cost: number }[] = []; for (const e of this.entries) { const hit = acc.find(a => a.model === e.model); if (hit) hit.cost += e.costUsd; else acc.push({ model: e.model, cost: e.costUsd }); } return acc; }
  get label() { return `$${this.totalCostUsd.toFixed(2)} · ${this.modelCount} models`; }
  exportJson() { return JSON.stringify({ totalCostUsd: this.totalCostUsd, entries: this.entries }, null, 2); }
}
