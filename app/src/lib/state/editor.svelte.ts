// Desktop canvas editor (≥ md): tool, operation, panel tab, zoom and per-operation laser settings.
// Port of the mock's ShellState; the phone canvas does not use it.
export type Tool = 'select' | 'rect' | 'ellipse' | 'pen' | 'text' | 'measure' | 'pan';
export type Op = 'cut' | 'engrave' | 'score';
export type Tab = 'properties' | 'layers' | 'job';
export interface OpParams { power: number; speed: number; passes: number }
const LIMITS: Record<keyof OpParams, [number, number]> = { power: [1, 100], speed: [1, 300], passes: [1, 10] };

export class EditorState {
  tool = $state<Tool>('select');
  op = $state<Op>('cut');
  tab = $state<Tab>('properties');
  zoom = $state(100);
  showGrid = $state(true);
  airAssist = $state(true);
  byOp = $state<Record<Op, OpParams>>({
    cut: { power: 80, speed: 6, passes: 1 },
    engrave: { power: 35, speed: 40, passes: 1 },
    score: { power: 20, speed: 30, passes: 1 }
  });

  get params() { return this.byOp[this.op]; }
  get zoomLabel() { return `${this.zoom}%`; }
  get statusLine() {
    const p = this.params;
    return `${this.op} · ${p.power}% power · ${p.speed} mm/s · ${p.passes} pass${p.passes > 1 ? 'es' : ''} · air ${this.airAssist ? 'on' : 'off'}`;
  }

  setTool(t: Tool) { this.tool = t; }
  setOp(o: Op) { this.op = o; }
  setTab(t: Tab) { this.tab = t; }
  setParam(key: keyof OpParams, value: number) {
    const [lo, hi] = LIMITS[key];
    if (Number.isFinite(value)) this.byOp[this.op][key] = Math.min(hi, Math.max(lo, Math.round(value)));
  }
  zoomIn() { this.zoom = Math.min(400, this.zoom + 25); }
  zoomOut() { this.zoom = Math.max(25, this.zoom - 25); }
  toggleGrid() { this.showGrid = !this.showGrid; }
  toggleAir() { this.airAssist = !this.airAssist; }
}
