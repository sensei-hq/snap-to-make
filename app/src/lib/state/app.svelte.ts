import { vibe } from '@rokkit/states';
import { FlowState } from './flow.svelte';
import type { ChatAction } from './conversation.svelte';
import type { Snippet } from 'svelte';
import { guide, steps, type StepId } from '../content/layers';

const WORKSHOP_CHIPS = ['Coasters from my sketch', 'Box that fits this', 'Ornaments for 40 names'];
import { ConvertState } from './convert.svelte';
import { WatchState } from './watch.svelte';
import { BatchState } from './batch.svelte';
import { CaptureState } from './capture.svelte';
import { SessionState } from './session.svelte';
import { LayerFlowState } from './layer-flow.svelte';
import { EditorState } from './editor.svelte';

// One per app, created by routes/+layout.svelte and read by every page through useApp(),
// so section state (and the session's cost trace) survives navigation.
export class AppState {
  session = new SessionState();
  flow = new FlowState();
  convert = new ConvertState();
  watch = new WatchState();
  batch = new BatchState();
  capture = new CaptureState();
  layers = new LayerFlowState();
  editor = new EditorState();
  chatOpen = $state(true);
  propsOpen = $state(false);
  screen = $state({ title: 'Workshop', subtitle: '' });

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
