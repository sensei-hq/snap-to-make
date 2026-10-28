import { vibe } from '@rokkit/states';
import { FlowState } from './flow.svelte';
import { ConvertState } from './convert.svelte';
import { WatchState } from './watch.svelte';
import { BatchState } from './batch.svelte';
import { CaptureState } from './capture.svelte';
import { SessionState } from './session.svelte';
import { LayerFlowState } from './layer-flow.svelte';
import { EditorState } from './editor.svelte';

// One per app, created by routes/snap/+layout.svelte and read by every page through useApp(),
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

  /** The Katachi chat thread (studio panel): greeting, what you said, Katachi's replies. */
  get messages() {
    const c = this.flow.conversation;
    return [
      { role: 'katachi', text: 'Hi Dev — what are we making today?' },
      ...(c.transcript ? [{ role: 'user', text: c.transcript }] : []),
      ...c.captions.map((text) => ({ role: 'katachi', text }))
    ];
  }

  /** The studio shows one right panel at a time: the Katachi chat or the editor's properties. */
  toggleChat() { this.chatOpen = !this.chatOpen; if (this.chatOpen) this.propsOpen = false; }
  setDensity(d: 'comfortable' | 'compact') { vibe.density = d; }
  toggleProps() { this.propsOpen = !this.propsOpen; if (this.propsOpen) this.chatOpen = false; }
  setScreen(title: string, subtitle = '') { this.screen = { title, subtitle }; }

  /** A suggestion chip is said for you; the page then opens the camera. */
  pickSuggestion(text: string) { this.flow.conversation.ingestTranscript(text); }

  /** The composer (phone dock or studio chat panel) speaks to the workshop conversation. */
  async ask(text: string) {
    if (await this.flow.runCommand(text)) return;
    this.flow.conversation.ingestTranscript(text);
    await this.flow.analyse();
  }
}
