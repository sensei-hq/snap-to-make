import { agentJobs, type AgentJobId } from '../content/agents';
import { copy, regions, layerSets, type Kind, type MakeAs } from '../content/layers';
import { fixtureParts, type Check, type Outline, type Part, type Region } from './layer-flow.svelte';
import type { AssemblyStep } from '../domain/assembly';
import { startFor, type Start } from '../content/journey';

/** One run of a model or agent job for a craft, as the UI shows it. */
export interface AgentTask { key: string; job: AgentJobId; craftId: string; status: 'running' | 'done' | 'placeholder' | 'failed'; summary: string; costUsd?: number; ms?: number }

const tick = () => new Promise<void>((r) => queueMicrotask(r));

/**
 * The only place the craft journey talks to Meta models and agents (presentation never does).
 * Each job runs through `run`, which records a task the screens render. Today every craft job is a
 * placeholder: it returns a fixture in the shape the live call will return, and is marked as such.
 * Wiring one means replacing its body with a fetch to the route in content/agents.ts.
 */
export class MuseAgents {
  tasks = $state<AgentTask[]>([]);
  /** told about every finished job (AppState posts it in the chat with its model, action and cost) */
  onFinish: ((t: AgentTask) => void) | null = null;

  private async run<T>(job: AgentJobId, craftId: string, work: () => Promise<{ result: T; summary: string }>): Promise<T> {
    const key = `${craftId}:${job}:${this.tasks.length}`;
    this.tasks = [...this.tasks, { key, job, craftId, status: 'running', summary: agentJobs[job].label }];
    const set = (patch: Partial<AgentTask>) => { this.tasks = this.tasks.map((t) => (t.key === key ? { ...t, ...patch } : t)); };
    const started = Date.now();
    const finish = (patch: Partial<AgentTask>) => { set({ ...patch, ms: Date.now() - started }); const t = this.tasks.find((x) => x.key === key); if (t) this.onFinish?.(t); };
    try {
      const { result, summary } = await work();
      // placeholders report the job's typical cost as an estimate; live jobs report what the server billed
      finish({ status: agentJobs[job].status === 'live' ? 'done' : 'placeholder', summary, costUsd: agentJobs[job].estUsd });
      return result;
    } catch (e) {
      finish({ status: 'failed', summary: `${agentJobs[job].label} failed`, costUsd: 0 });
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
    const subject = kind === '3d' ? 'a birdhouse' : 'layered paper art in a round hoop';
    return this.run('capture.describe', craftId, async () => { await tick(); return { result: { subject }, summary: `Sees ${subject}` }; });
  }
  // ── Shape
  cleanSketch(craftId: string) {
    return this.run('shape.cleanSketch', craftId, async () => { await tick(); return { result: { variants: 3 }, summary: '3 line-art takes of your sketch' }; });
  }
  cutout(craftId: string) {
    const outline: Outline = { shape: 'circle', sizeMm: 300 };
    const checks = copy.cutout.checks.map((c) => ({ ...c })) as Check[];
    return this.run('shape.cutout', craftId, async () => { await tick(); return { result: { outline, checks }, summary: `Background removed · ${outline.shape} outline, Ø ${outline.sizeMm} mm` }; });
  }
  segment(craftId: string) {
    const found: Region[] = regions.map((r) => ({ ...r }));
    return this.run('shape.segment', craftId, async () => { await tick(); return { result: found, summary: `${found.length} regions found` }; });
  }
  // ── Layers
  planLayers(craftId: string, makeAs: MakeAs) {
    const set = layerSets[makeAs === 'wood' ? 'wood' : 'paper'];
    const layers = set.layers.map((l) => ({ ...l, shapes: [...l.shapes] }));
    return this.run('layers.plan', craftId, async () => { await tick(); return { result: layers, summary: `${layers.length} layers · ${set.label.toLowerCase()}` }; });
  }
  imagineGaps(craftId: string) {
    return this.run('layers.imagineGaps', craftId, async () => { await tick(); return { result: { filled: 0 }, summary: 'Ready to fill hidden areas when you ask' }; });
  }
  unfold(craftId: string) {
    const parts: Part[] = fixtureParts.map((p) => ({ ...p, needs: [...p.needs] }));
    return this.run('layers.unfold', craftId, async () => { await tick(); return { result: parts, summary: `${parts.length} part groups · front, back, sides, roof, floor` }; });
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
  /** Placeholder: returns the code-derived steps it is given; the live job has Spark rewrite them from the ObjectSpec. */
  writeInstructions(craftId: string, draft: AssemblyStep[]) {
    return this.run('assemble.instructions', craftId, async () => { await tick(); return { result: draft, summary: `${draft.length} assembly steps` }; });
  }
  renderFinished(craftId: string) {
    return this.run('assemble.render', craftId, async () => { await tick(); return { result: { image: '' }, summary: 'Photo of the finished piece' }; });
  }
}
