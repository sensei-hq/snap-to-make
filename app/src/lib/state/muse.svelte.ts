import { agentJobs, type AgentJobId } from '../content/agents';
import { regions, layerSets, type Kind, type MakeAs } from '../content/layers';
import { startFor, type Start } from '../content/journey';

/** One run of a model or agent job for a craft, as the UI shows it. */
export interface AgentTask { key: string; job: AgentJobId; craftId: string; status: 'running' | 'done' | 'placeholder' | 'failed'; summary: string }

const tick = () => new Promise<void>((r) => queueMicrotask(r));

/**
 * The only place the craft journey talks to Meta models and agents (presentation never does).
 * Each job runs through `run`, which records a task the screens render. Today every craft job is a
 * placeholder: it returns a fixture in the shape the live call will return, and is marked as such.
 * Wiring one means replacing its body with a fetch to the route in content/agents.ts.
 */
export class MuseAgents {
  tasks = $state<AgentTask[]>([]);

  private async run<T>(job: AgentJobId, craftId: string, work: () => Promise<{ result: T; summary: string }>): Promise<T> {
    const key = `${craftId}:${job}:${this.tasks.length}`;
    this.tasks = [...this.tasks, { key, job, craftId, status: 'running', summary: agentJobs[job].label }];
    const set = (patch: Partial<AgentTask>) => { this.tasks = this.tasks.map((t) => (t.key === key ? { ...t, ...patch } : t)); };
    try {
      const { result, summary } = await work();
      set({ status: agentJobs[job].status === 'live' ? 'done' : 'placeholder', summary });
      return result;
    } catch (e) {
      set({ status: 'failed', summary: `${agentJobs[job].label} failed` });
      throw e;
    }
  }
  /** a job already ran (or is running) for this craft */
  has(craftId: string, job: AgentJobId) { return this.tasks.some((t) => t.craftId === craftId && t.job === job && t.status !== 'failed'); }
  /** tasks for one craft, newest last */
  forCraft(craftId: string | undefined) { return craftId ? this.tasks.filter((t) => t.craftId === craftId) : []; }

  // ── Home
  /** Spark classifies intent into a starting point. Placeholder: keyword match, synchronous so Capture opens at once. */
  classifyIntent(text: string, craftId: string): Start {
    const start = startFor(text);
    void this.run('intent.classify', craftId, async () => ({ result: start, summary: `Reads “${text}” as ${start.label.toLowerCase()}` }));
    return start;
  }
  // ── Capture
  describeCapture(craftId: string, kind: Kind) {
    return this.run('capture.describe', craftId, async () => { await tick(); return { result: { subject: kind === '3d' ? 'birdhouse' : 'layered paper art in a hoop' }, summary: kind === '3d' ? 'Sees a birdhouse, six sides' : 'Sees layered paper art in a round hoop' }; });
  }
  // ── Shape
  cleanSketch(craftId: string) {
    return this.run('shape.cleanSketch', craftId, async () => { await tick(); return { result: { variants: 3 }, summary: '3 line-art takes of your sketch' }; });
  }
  cutout(craftId: string) {
    return this.run('shape.cutout', craftId, async () => { await tick(); return { result: { outline: 'circle', diameterMm: 300 }, summary: 'Background removed · circle outline, Ø 300 mm' }; });
  }
  segment(craftId: string) {
    return this.run('shape.segment', craftId, async () => { await tick(); return { result: regions, summary: `${regions.length} regions found` }; });
  }
  // ── Layers
  planLayers(craftId: string, makeAs: MakeAs) {
    const set = layerSets[makeAs === 'wood' ? 'wood' : 'paper'];
    return this.run('layers.plan', craftId, async () => { await tick(); return { result: set.layers, summary: `${set.layers.length} layers · ${set.label.toLowerCase()}` }; });
  }
  imagineGaps(craftId: string) {
    return this.run('layers.imagineGaps', craftId, async () => { await tick(); return { result: { filled: 0 }, summary: 'Ready to fill hidden areas when you ask' }; });
  }
  unfold(craftId: string) {
    return this.run('layers.unfold', craftId, async () => { await tick(); return { result: { parts: 7 }, summary: '7 parts · front, back, 2 sides, 2 roof, floor' }; });
  }
  /** Spark turns a chat note into edit operations (merge, split, raise, recolour) on the layer it names. */
  applyRefinement(craftId: string, note: { step: string; layer?: string; text: string }) {
    return this.run('layers.refine', craftId, async () => { await tick(); return { result: { applied: false, ops: [] as string[] }, summary: `Will apply “${note.text}”${note.layer ? ` to ${note.layer}` : ''}` }; });
  }
  // ── Sheets
  vectorise(craftId: string, sheets: number) {
    return this.run('sheets.vectorise', craftId, async () => { await tick(); return { result: { sheets }, summary: `${sheets} sheets traced and nested` }; });
  }
  // ── Assemble
  writeInstructions(craftId: string, steps: number) {
    return this.run('assemble.instructions', craftId, async () => { await tick(); return { result: { steps }, summary: `${steps} assembly steps` }; });
  }
  renderFinished(craftId: string) {
    return this.run('assemble.render', craftId, async () => { await tick(); return { result: { image: '' }, summary: 'Photo of the finished piece' }; });
  }
}
