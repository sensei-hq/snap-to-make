export interface BatchJob { status: string; steps: string[]; plan?: string }
export class BatchState {
  job = $state<BatchJob | null>(null);
  async start(names: string) {
    const r = await fetch('/api/batch', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ names }) }).then(x => x.json());
    this.job = { status: r.status, steps: r.steps ?? [], plan: r.plan };
  }
}
