import { ConversationState } from './conversation.svelte';
import { DesignState } from './design.svelte';
import { PlaybackState } from './playback.svelte';
import { TraceState } from './trace.svelte';
import { getAdapter } from '../devices/registry';
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
    if (r.measure?.status === 'measured') this.measureLabel = `Ø ${Math.round(r.measure.targets[0].valueMm)} mm ±2`;
    this.status = 'measured';
  }
  async plan() {
    const spec = { project: 'Coasters for Maya', material: { id: this.conversation.slots.material ?? 'birch', thicknessMm: this.conversation.slots.thicknessMm ?? 3 }, deviceId: 'longer-ray5-10w', sheet: { wMm: 300, hMm: 300 },
      parts: [{ name: 'coaster', qty: this.conversation.slots.qty ?? 4, template: 'coaster', params: { shape: 'round', diameterMm: 95 }, engrave: [{ artId: 'art-2', sizeMm: 60, anchor: 'center' }] }, { name: 'holder', qty: 1, template: 'finger_box_open', params: { innerWMm: 97, innerDMm: 14, innerHMm: 40 } }], kerfMm: 0.1, clearanceMm: 1, assumptions: ['coaster = mug base + 13 mm'] };
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
