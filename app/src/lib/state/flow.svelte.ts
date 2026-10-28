import { ConversationState } from './conversation.svelte';
import { DesignState } from './design.svelte';
import { PlaybackState } from './playback.svelte';
import { TraceState } from './trace.svelte';
import { getAdapter } from '../devices/registry';
import { deriveCoasterSet, coasterSetToSpec, type LidState } from '../domain/holder';
import { implToCanvas } from '../domain/canvas';

export interface Measurement { id: 'mug' | 'sketch'; label: string; kind: 'diameter' | 'wh'; value: number; value2?: number; tolerance: number }
const PREVIEW_SCENES = ['on a coffee table', 'on a kitchen counter', 'on a workbench'];
// Orchestration state: owns async transitions (API calls live here, never in presentation).
export class FlowState {
  conversation = new ConversationState();
  design = new DesignState();
  trace = new TraceState();
  playback = $state<PlaybackState | null>(null);
  measureLabel = $state('');
  scene = $state<any>(null);
  status = $state('idle');
  adapterId = $state('laser');

  // Scene: measured values the user can correct; everything downstream is derived from them in code.
  measurements = $state<Measurement[]>([
    { id: 'mug', label: 'Mug base', kind: 'diameter', value: 82, tolerance: 2 },
    { id: 'sketch', label: 'Logo sketch', kind: 'wh', value: 62, value2: 58, tolerance: 0 }
  ]);
  editing = $state<Measurement['id'] | null>(null);
  startEdit(id: Measurement['id']) { this.editing = id; }
  wallHeightMm = $state(40);
  lid = $state<LidState>('offered');
  get mugBaseMm() { return this.measurements.find((m) => m.id === 'mug')!.value; }
  get coasterSet() { return deriveCoasterSet({ mugBaseMm: this.mugBaseMm, wallHeightMm: this.wallHeightMm, lid: this.lid }); }
  get canvasPieces() { return this.design.impl ? implToCanvas(this.design.impl) : []; }
  get lidMessage() {
    return this.lid === 'added' ? 'Lid added — one more part on the same sheet.'
      : this.lid === 'declined' ? `Walls at ${this.wallHeightMm} mm — still fits.`
      : `Walls at ${this.wallHeightMm} mm — still fits. Want a lid?`;
  }
  setMeasurement(id: Measurement['id'], value: number) {
    const m = this.measurements.find((x) => x.id === id);
    this.editing = null;
    if (!m || !Number.isFinite(value) || value <= 0) return;
    m.value = Math.round(value * 10) / 10;
    if (id === 'mug') this.measureLabel = `Ø ${m.value} mm ±${m.tolerance}`;
  }
  /** Voice/text edits on the canvas. The live app sends these to Spark as edit_design; the demo phrase is matched here. */
  async runCommand(text: string): Promise<boolean> {
    const walls = text.match(/walls?\s+(\d+)\s*mm\s+taller/i);
    if (!walls) return false;
    this.wallHeightMm += Number(walls[1]);
    this.conversation.say(`Walls raised to ${this.wallHeightMm} mm — re-planned, still fits the sheet.`);
    if (this.design.impl) await this.plan();
    return true;
  }
  async addLid() { this.lid = 'added'; if (this.design.impl) await this.plan(); }
  async declineLid() { this.lid = 'declined'; }

  // Art and preview choices.
  artRerolls = $state(0);
  artUsesOriginal = $state(false);
  sceneIndex = $state(0);
  darkerEngraving = $state(false);
  pickArt(i: number) { this.artSelected = i; this.artUsesOriginal = false; }
  useOriginalArt() { this.artUsesOriginal = true; }
  reroll() { this.artRerolls += 1; }
  nextScene() { this.sceneIndex = (this.sceneIndex + 1) % PREVIEW_SCENES.length; }
  toggleEngraving() { this.darkerEngraving = !this.darkerEngraving; }
  get previewCaption() {
    return `Here's how it'll look in birch, ${PREVIEW_SCENES[this.sceneIndex]}. Four Ø ${this.coasterSet.coasterDiameterMm} mm coasters, M engraved at 60 mm.`;
  }
  async talk() {
    // Real mic path: browser SpeechRecognition when available; deterministic demo transcript otherwise (voice relay is server-side with META_API_KEY).
    const SR = (globalThis as any).SpeechRecognition ?? (globalThis as any).webkitSpeechRecognition;
    if (!SR) { this.conversation.ingestTranscript('make four coasters 3 mm birch'); await this.analyse(); return; }
    const rec = new SR();
    rec.lang = 'en-US';
    rec.onresult = (e: any) => { this.conversation.ingestTranscript(e.results[0][0].transcript); void this.analyse(); };
    rec.start();
  }
  startListen() { this.conversation.startListening(); }
  stopListen() { this.conversation.stopListening(); void this.analyse(); }
  async analyse() {
    this.status = 'analyzing';
    const r = await fetch('/api/scene', { method: 'POST' }).then(x => x.json());
    this.scene = r;
    for (const t of r.trace ?? []) this.trace.add(t);
    if (r.measure?.status === 'measured') this.setMeasurement('mug', Math.round(r.measure.targets[0].valueMm));
    this.status = 'measured';
  }
  async plan() {
    const slots = this.conversation.slots;
    const spec = coasterSetToSpec(this.coasterSet, { qty: slots.qty ?? 4, materialId: slots.material ?? 'birch', thicknessMm: slots.thicknessMm ?? 3 });
    const r = await fetch('/api/design', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ spec, adapterId: this.adapterId }) }).then(x => x.json());
    for (const t of r.trace ?? []) this.trace.add(t);
    const { designSpecToObject } = await import('../domain/geometry');
    const { DesignSpecSchema } = await import('../domain/schemas');
    this.design.setObject(designSpecToObject(DesignSpecSchema.parse(spec)), { ...getAdapter(this.adapterId).defaultTarget });
    this.playback = new PlaybackState(getAdapter('simulator').preview(this.design.impl!));
    this.conversation.say('Build plan ready — check the parts, then simulate before you burn.');
    this.status = 'planned';
  }
  selectAdapter(id: string) {
    this.adapterId = id;
    if (this.design.object) { this.design.selectTarget({ ...getAdapter(id).defaultTarget }); this.playback = new PlaybackState(getAdapter('simulator').preview(this.design.impl!)); }
  }
  artVariants = $state<string[]>([]);
  artSelected = $state(0);
  previewLabel = $state('');
  async loadArt() { const r = await fetch('/api/art', { method: 'POST' }).then(x => x.json()); for (const t of r.trace ?? []) this.trace.add(t); this.artVariants = r.variants ?? []; }
  async loadPreview() { const r = await fetch('/api/preview', { method: 'POST' }).then(x => x.json()); for (const t of r.trace ?? []) this.trace.add(t); this.previewLabel = r.label ?? ''; }
  download(kind: string) {
    if (!this.design.impl) return '';
    try { const f = getAdapter(this.design.impl.adapterId).emit(this.design.impl).find(x => x.filename.endsWith(kind)); return f?.content ?? ''; }
    catch { return 'Phase 2 export'; }
  }
}
