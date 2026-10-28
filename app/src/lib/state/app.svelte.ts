import { vibe } from '@rokkit/states';
import { FlowState } from './flow.svelte';
import type { ChatAction } from './conversation.svelte';
import type { Snippet } from 'svelte';
import { guide, steps, type StepId } from '../content/layers';

type FlowPage = StepId | 'views' | 'reference';
const flowPath = (id: FlowPage) => `/make/${id}`;
const browserStore = () => new ProjectStore(typeof globalThis.localStorage?.getItem === 'function' ? globalThis.localStorage : undefined);

const WORKSHOP_CHIPS = ['Coasters from my sketch', 'Box that fits this', 'Ornaments for 40 names'];
import { WatchState } from './watch.svelte';
import { BatchState } from './batch.svelte';
import { CaptureState } from './capture.svelte';
import { SessionState } from './session.svelte';
import { LayerFlowState } from './layer-flow.svelte';
import { ProjectStore, projectName, type ProjectRecord } from './project.svelte';
import { EditorState } from './editor.svelte';

// One per app, created by routes/+layout.svelte and read by every page through useApp(),
// so section state (and the session's cost trace) survives navigation.
export class AppState {
  session = new SessionState();
  flow = new FlowState();
  watch = new WatchState();
  batch = new BatchState();
  capture = $state(new CaptureState());
  layers = new LayerFlowState();
  editor = new EditorState();
  chatOpen = $state(true);
  propsOpen = $state(false);
  screen = $state({ title: 'Workshop', subtitle: '' });

  // ── Projects: New → capture → the make flow → cuts. Named by the first step, saved as you go, reopened from Open.
  project = $state<ProjectRecord | null>(null);
  projects = $state<ProjectRecord[]>([]);
  constructor(private store: ProjectStore = browserStore()) {
    this.projects = store.list();
    const id = store.current();
    const saved = id ? store.load(id) : null;
    if (saved) this.apply(saved);
  }
  private apply(p: ProjectRecord) {
    this.layers.restore({ ...LayerFlowState.defaults(), ...p.choices });
    this.project = p;
  }
  /** The project's name, or the example subject until something is captured. */
  get title() { return this.project?.name || this.layers.data.project; }
  newProject() {
    const now = Date.now();
    this.capture = new CaptureState();
    this.layers.restore(LayerFlowState.defaults());
    this.project = { id: crypto.randomUUID(), name: '', createdAt: now, updatedAt: now, reached: -1, kind: 'flat', path: '/capture', image: '', choices: {} };
  }
  /** The first step: what was captured names the project and opens the flow (six sides go to the six-view step). */
  startFromCapture({ fileName, images, mode, at }: { fileName?: string; images: string[]; mode: 'single' | 'multi'; at?: Date }) {
    if (!this.project) this.newProject();
    const p = this.project!;
    const kind = mode === 'multi' ? '3d' : 'flat';
    this.layers.setKind(kind);
    // eslint-disable-next-line svelte/prefer-svelte-reactivity -- a one-off timestamp for the name, not reactive state
    const when = at ?? new Date();
    this.project = { ...p, name: p.name || projectName({ fileName, at: when }), kind, image: images[0] ?? p.image,
      reached: Math.max(p.reached, 0), path: flowPath(mode === 'multi' ? 'views' : 'import') };
    this.save();
  }
  /** A step is open once the one before it has been reached; the branch screens once anything is captured. */
  canVisit(id: FlowPage) {
    const reached = this.project?.reached ?? -1;
    if (reached < 0) return false;
    if (id === 'views' || id === 'reference') return true;
    return steps.findIndex((s) => s.id === id) <= reached + 1;
  }
  /** The furthest open step (where a blocked visit lands). */
  get resumePath() { return this.project && this.project.reached >= 0 ? this.project.path : '/workshop'; }
  visit(id: FlowPage) {
    if (!this.project || !this.canVisit(id)) return;
    const i = steps.findIndex((s) => s.id === id);
    this.project = { ...this.project, reached: Math.max(this.project.reached, i), path: flowPath(id) };
  }
  /** Autosave: called whenever the project or its choices change (a draft with nothing captured is not saved). */
  save() {
    const p = this.project;
    if (!p || p.reached < 0) return;
    const record: ProjectRecord = { ...$state.snapshot(p) as ProjectRecord, updatedAt: Date.now(), choices: this.layers.snapshot() };
    this.store.save(record);
    this.store.setCurrent(record.id);
    this.projects = this.store.list();
  }
  // Import · Katachi turns "what do you want to make of it" into a plan (Muse dissection, /api/convert)
  variations = $state<{ title: string; change: string }[]>([]);
  async askForBrief(description: string) {
    const text = description.trim();
    if (!text) return;
    this.flow.conversation.ingestTranscript(text);
    const group = this.layers.makeAs === 'paper' ? 'cricut-paper' : 'laser-cut';
    const r = await fetch('/api/convert', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ imageDataUrl: this.project?.image || undefined, description: text, group }) })
      .then((x) => (x.ok ? x.json() : null)).catch(() => null);
    if (!r?.objective) { this.flow.conversation.say('I couldn’t reach Muse just now — try again in a moment.'); return; }
    this.variations = (r.variations ?? []).slice(0, 3);
    this.flow.conversation.say(`${r.objective}. Pick a direction and I’ll plan the layers around it:`, this.variations.map((v, i) => ({ label: v.title, id: `variation:${i}` })));
  }
  chooseVariation(i: number) {
    const v = this.variations[i];
    if (!v) return;
    this.layers.setBrief(`${v.title} — ${v.change}`);
    this.flow.conversation.say(`Going with ${v.title}.`);
  }
  open(id: string) { const p = this.store.load(id); if (p) { this.apply(p); this.store.setCurrent(id); } }

  get trace() { return this.flow.trace; }
  get costPill() { return this.trace.label; }

  /** The Katachi assistant thread in Rokkit ChatMessage shape: greeting, then every entry of the conversation log. */
  get messages(): { id: string; role: 'user' | 'assistant'; text: string; data?: { actions: ChatAction[] } }[] {
    const log = [{ role: 'assistant' as const, text: 'Hi Dev — what are we making today?' }, ...this.flow.conversation.log];
    return log.map((e, i) => ({ id: `m${i}`, role: e.role, text: e.text, ...('actions' in e && e.actions ? { data: { actions: e.actions } } : {}) }));
  }

  /** A page's context for the assistant column (inspector, rule, send-to): it sits above the Katachi chat. */
  info = $state<{ title: string; body: Snippet } | null>(null);
  setInfo(title: string, body: Snippet) { this.info = { title, body }; }
  /** Pass the body you set: a leaving page must not clear the next page's info (it is set first). */
  clearInfo(body?: Snippet) { if (body && this.info?.body !== body) return; this.info = null; }

  /** Katachi guides each image → layers step once, with Previous / Next. */
  guidedSteps = $state<StepId[]>([]);
  currentStep = $state<StepId | null>(null);
  guideStep(id: StepId) {
    this.currentStep = id;
    if (this.guidedSteps.includes(id)) return;
    this.guidedSteps = [...this.guidedSteps, id];
    const i = steps.findIndex((s) => s.id === id);
    const prev = steps[i - 1], next = steps[i + 1];
    this.flow.conversation.say(guide[id].text, [
      ...(prev ? [{ label: `Previous · ${prev.label}`, href: prev.path }] : []),
      ...(next ? [{ label: `Next · ${next.label}`, href: next.path }] : [])
    ]);
  }
  /** Suggestion chips for the composer: the current step's, else the workshop's. */
  get suggestions() { return this.currentStep ? guide[this.currentStep].chips : WORKSHOP_CHIPS; }

  /** Phones show the assistant as a sheet over the work area. */
  sheetOpen = $state(false);
  toggleSheet() { this.sheetOpen = !this.sheetOpen; }

  /** The studio shows one right panel at a time: the Katachi chat or the editor's properties. */
  toggleChat() { this.chatOpen = !this.chatOpen; if (this.chatOpen) this.propsOpen = false; }
  setDensity(d: 'comfortable' | 'compact') { vibe.density = d; }
  toggleProps() { this.propsOpen = !this.propsOpen; if (this.propsOpen) this.chatOpen = false; }
  setScreen(title: string, subtitle = '') { this.screen = { title, subtitle }; }

  /** The composer (phone dock or studio chat panel) speaks to the workshop conversation. */
  async ask(text: string) {
    if (await this.flow.runCommand(text)) return;
    this.flow.conversation.ingestTranscript(text);
    await this.flow.analyse();
  }
}
