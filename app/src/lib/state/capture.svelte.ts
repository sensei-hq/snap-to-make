import { sides, type CaptureMode, type CaptureSource, type SideId } from '../content/capture';

// One wizard for camera and upload: a single shot, or six sides of a 3D object. Camera shots and
// uploads fill the same slots, so they mix; switching mode carries the shots over.
export interface Slot { id: 'photo' | SideId; label: string; url?: string; source?: CaptureSource }

export class CaptureState {
  mode = $state<CaptureMode>('single');
  source = $state<CaptureSource>('camera');
  showGrid = $state(false);
  shots = $state<Partial<Record<Slot['id'], { url: string; source: CaptureSource }>>>({});
  /** the slot the next shot goes into (null = first empty) */
  target = $state<Slot['id'] | null>(null);
  /** the captured slot shown full size (null = current / live view) */
  viewingId = $state<Slot['id'] | null>(null);

  get slots(): Slot[] {
    const base = this.mode === 'single' ? [{ id: 'photo' as const, label: 'Photo' }] : sides;
    return base.map((s) => ({ ...s, ...(this.shots[s.id] ?? {}) }));
  }
  get current() { return this.slots.find((s) => s.id === this.target && !s.url) ?? this.slots.find((s) => !s.url) ?? null; }
  get done() { return this.slots.every((s) => s.url); }
  get prompt() {
    const c = this.current;
    if (!c) return this.mode === 'single' ? 'Photo captured' : 'All 6 sides captured';
    if (this.mode === 'single') return 'Frame the whole piece';
    return `Shoot the ${c.label.toLowerCase()} · ${this.slots.findIndex((s) => s.id === c.id) + 1} of ${this.slots.length}`;
  }
  get viewing() { return this.slots.find((s) => s.id === this.viewingId && s.url) ?? null; }
  /** captured images, in slot order (the work area's collection) */
  get media() { return this.slots.filter((s) => s.url).map((s) => ({ id: s.id, label: s.label, url: s.url!, source: s.source! })); }

  setMode(m: CaptureMode) {
    if (m === this.mode) return;
    const moved = { ...this.shots };
    if (m === 'multi' && moved.photo) { moved.front = moved.front ?? moved.photo; delete moved.photo; }
    if (m === 'single' && moved.front) { moved.photo = moved.photo ?? moved.front; }
    this.shots = moved; this.mode = m; this.target = null; this.viewingId = null;
  }
  setSource(s: CaptureSource) { this.source = s; }
  toggleGrid() { this.showGrid = !this.showGrid; }
  capture(url: string, source: CaptureSource = this.source) {
    const slot = this.current;
    if (!slot) return;
    this.shots = { ...this.shots, [slot.id]: { url, source } };
    this.target = null; this.viewingId = null;
  }
  upload(urls: string[]) { for (const url of urls) this.capture(url, 'upload'); }
  retake(id: Slot['id']) {
    const { [id]: _drop, ...rest } = this.shots;
    void _drop;
    this.shots = rest; this.target = id; this.viewingId = null;
  }
  view(id: Slot['id'] | null) { this.viewingId = id; }
}
