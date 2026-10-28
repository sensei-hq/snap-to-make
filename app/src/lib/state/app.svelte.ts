import { vibe } from '@rokkit/states';
import { FlowState } from './flow.svelte';
import type { ChatAction } from './conversation.svelte';
import type { Snippet } from 'svelte';
import { guide, steps, type DeviceId, type StepId } from '../content/layers';
import { journey, journeyIndexOf, journeyStepFor, starts, type Start, type StartId } from '../content/journey';
import { assemblySteps } from '../domain/assembly';
import { agentJobs, jobsOnVisit } from '../content/agents';
import { MuseAgents } from './muse.svelte';

type FlowPage = StepId | 'views' | 'reference';
const flowPath = (id: FlowPage) => `/make/${id}`;
const browserStore = () => new ProjectStore(typeof globalThis.localStorage?.getItem === 'function' ? globalThis.localStorage : undefined);

const WORKSHOP_CHIPS = ['A layered mountain picture', 'A birdhouse from six photos', 'Remix it with a moon'];
const DEVICE_KEY = 'katachi.device';
import { WatchState } from './watch.svelte';
import { BatchState } from './batch.svelte';
import { CaptureState, thumbnail } from './capture.svelte';
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
  /** every Meta model / agent job of the craft journey runs through here (placeholders until wired) */
  muse = new MuseAgents();
  chatOpen = $state(true);
  propsOpen = $state(false);
  screen = $state({ title: 'Workshop', subtitle: '' });

  // ── Projects: New → capture → the make flow → cuts. Named by the first step, saved as you go, reopened from Open.
  project = $state<ProjectRecord | null>(null);
  projects = $state<ProjectRecord[]>([]);
  constructor(private store: ProjectStore = browserStore()) {
    this.projects = store.list();
    const d = store.getSetting(DEVICE_KEY) as DeviceId | null;
    if (d) this.defaultDevice = d;
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
    this.layers.setDevice(this.defaultDevice);
    this.project = { id: crypto.randomUUID(), name: '', createdAt: now, updatedAt: now, reached: -1, kind: 'flat', path: '/capture', image: '', choices: {}, status: 'draft' };
  }
  /** Home · a new craft from a starting point (or from what was said or typed): Capture opens set up for it. */
  startCraft(from: StartId | string, { heard = false } = {}): string {
    const picked = starts.find((s) => s.id === from);
    if (!heard && !picked) this.flow.conversation.ingestTranscript(from);
    this.newProject();
    const start: Start = picked ?? this.muse.classifyIntent(from, this.project!.id);
    this.project = { ...this.project!, kind: start.kind };
    this.layers.setKind(start.kind);
    this.capture.setMode(start.mode);
    this.capture.setSource(start.source);
    this.flow.conversation.say(start.say);
    return '/capture';
  }
  /** The first step: what was captured names the project and opens the flow (six sides go to the six-view step). */
  startFromCapture({ fileName, images, mode, at, prefix }: { fileName?: string; images: string[]; mode: 'single' | 'multi'; at?: Date; prefix?: string }) {
    if (!this.project) this.newProject();
    const p = this.project!;
    const kind = mode === 'multi' ? '3d' : p.kind === 'ref' ? 'ref' : 'flat';
    this.layers.setKind(kind);
    // eslint-disable-next-line svelte/prefer-svelte-reactivity -- a one-off timestamp for the name, not reactive state
    const when = at ?? new Date();
    this.project = { ...p, name: p.name || projectName({ fileName, at: when, prefix }), kind, image: images[0] ?? p.image,
      reached: Math.max(p.reached, 0), path: flowPath(mode === 'multi' ? 'views' : kind === 'ref' ? 'reference' : 'import') };
    this.save();
    void this.muse.describeCapture(p.id, kind);
    if (this.capture.media.some((m) => m.source === 'sketch')) void this.muse.cleanSketch(p.id);
  }
  /** Home · release the mic: what was heard starts a craft (returns where to go), or nothing was heard. */
  listenToStart(): string | null {
    this.flow.conversation.stopListening();
    const heard = this.flow.conversation.transcript.trim();
    return heard ? this.startCraft(heard, { heard: true }) : null;
  }
  /** Capture's Continue: the captured media start the craft (a small thumbnail is kept for the gallery). */
  async startFromCaptureMedia(fileName?: string) {
    const first = this.capture.media[0]?.url;
    const sketched = this.capture.media[0]?.source === 'sketch';
    this.startFromCapture({ fileName, images: first ? [await thumbnail(first)] : [], mode: this.capture.mode, prefix: sketched ? 'Sketch' : 'Photo' });
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
    this.runJobsFor(id);
  }
  /** The model / agent jobs a step needs, run once per craft when it is first opened. */
  private runJobsFor(id: FlowPage) {
    const craft = this.project?.id;
    if (!craft || this.project?.example) return;
    for (const job of jobsOnVisit[id] ?? []) {
      if (this.muse.has(craft, job)) continue;
      if (job === 'shape.cutout') void this.muse.cutout(craft);
      else if (job === 'shape.segment') void this.muse.segment(craft);
      else if (job === 'layers.plan') void this.muse.planLayers(craft, this.layers.makeAs);
      else if (job === 'layers.imagineGaps') void this.muse.imagineGaps(craft);
      else if (job === 'layers.unfold') void this.muse.unfold(craft);
      else if (job === 'sheets.vectorise') void this.muse.vectorise(craft, this.layers.layers.length);
      else if (job === 'assemble.instructions') void this.muse.writeInstructions(craft, this.assembly.length);
    }
  }
  /** What the models and agents did for the open craft (optionally one journey step), for the activity strip. */
  activity(step?: string) {
    return this.muse.forCraft(this.project?.id)
      .map((t) => ({ key: t.key, model: agentJobs[t.job].model, step: agentJobs[t.job].step, status: t.status, summary: t.summary }))
      .filter((t) => !step || t.step === step);
  }
  /** Assemble · Muse Image pictures the finished piece (placeholder). */
  renderFinished() { if (this.project) void this.muse.renderFinished(this.project.id); }
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
  /** Crafts · delete one (the gallery confirms first). */
  removeCraft(id: string) {
    this.store.remove(id);
    this.projects = this.store.list();
    if (this.project?.id === id) this.project = null;
  }
  /** Crafts · the bundled example, so an empty gallery still shows what a finished craft looks like. */
  openExample() {
    const existing = this.projects.find((p) => p.example);
    if (existing) { this.open(existing.id); return; }
    this.newProject();
    const at = steps.findIndex((s) => s.id === 'assemble');
    this.project = { ...this.project!, name: 'Mountain sunset · example', example: true, reached: at, path: flowPath('assemble'), status: 'finished' };
    this.save();
  }
  /** Where a craft is: its journey step (0–4) and label, or finished. */
  progressOf(p: ProjectRecord) {
    const i = p.reached < 0 ? 0 : journeyIndexOf(p.path);
    const finished = p.status === 'finished';
    return { index: i, total: journey.length, finished, label: finished ? 'Finished' : `Step ${i + 1} of ${journey.length} · ${journey[i].label}` };
  }
  /** Assemble · the instructions for the open craft. */
  get assembly() { return assemblySteps({ kind: this.layers.kind, layers: this.layers.layers, set: this.layers.data, joinery: this.layers.joinery }); }
  /** Assemble · Save craft: finished, with its layers, instructions and chat notes. */
  finishCraft() {
    if (!this.project) return;
    this.project = { ...this.project, status: 'finished', reached: Math.max(this.project.reached, steps.findIndex((s) => s.id === 'assemble')), path: flowPath('assemble') };
    this.save();
    this.flow.conversation.say(`Saved “${this.project.name}” to your crafts — layers, ${this.assembly.length} assembly steps and ${this.layers.notes.length} notes.`, [{ label: 'Open crafts', href: '/crafts' }]);
  }

  // Settings · the machine Sheets sends to by default (remembered in this browser)
  defaultDevice = $state<DeviceId>('cricut');
  setDefaultDevice(d: DeviceId) {
    this.defaultDevice = d;
    this.store.setSetting(DEVICE_KEY, d);
    if (this.project && this.project.status !== 'finished') this.layers.setDevice(d);
  }

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

  /**
   * The composer (phone dock or studio chat panel). On Home or Crafts, what you say starts a craft (returns where to go);
   * on a craft step it is a refinement note for that step (and the selected layer), saved with the craft.
   */
  async ask(text: string, path = '/workshop'): Promise<string | null> {
    const t = text.trim();
    if (!t) return null;
    if (path === '/workshop' || path === '/crafts') return this.startCraft(t);
    const step = journeyStepFor(path);
    if (step && this.project) { this.refine(t, path); return null; }
    if (await this.flow.runCommand(t)) return null;
    this.flow.conversation.ingestTranscript(t);
    await this.flow.analyse();
    return null;
  }
  /** A chat refinement on a craft step: noted against the step and, on Layers, the selected layer. */
  refine(text: string, path: string) {
    const step = journeyStepFor(path)?.label ?? 'Craft';
    const layer = /^\/make\/(layers|gaps)$/.test(path) ? `Layer ${this.layers.selected.n} · ${this.layers.selected.name}` : undefined;
    this.flow.conversation.ingestTranscript(text);
    const note = { step, ...(layer ? { layer } : {}), text };
    this.layers.addNote(note);
    if (this.project) void this.muse.applyRefinement(this.project.id, note);
    this.flow.conversation.say(`Noted for ${layer ?? step}. It’s saved with the craft and listed when you assemble.`);
  }
}
