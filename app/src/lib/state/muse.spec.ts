import { describe, expect, it } from 'vitest';
import { MuseAgents } from './muse.svelte';
import { AppState } from './app.svelte';
import { MemoryStorage, ProjectStore } from './project.svelte';
import { agentJobs, jobsOnVisit } from '../content/agents';

const settle = () => new Promise((r) => setTimeout(r, 0));

describe('MuseAgents · every model/agent job runs through one place (placeholders until wired)', () => {
  it('records a task per job, marked placeholder with its summary', async () => {
    const m = new MuseAgents();
    const regions = await m.segment('c1');
    expect(regions.length).toBeGreaterThan(0);
    expect(m.tasks).toEqual([expect.objectContaining({ job: 'shape.segment', craftId: 'c1', status: 'placeholder', summary: `${regions.length} regions found` })]);
    expect(m.has('c1', 'shape.segment')).toBe(true);
    expect(m.forCraft('c2')).toEqual([]);
  });

  it('every job in the catalogue names its model, step and future route; every step job is catalogued', () => {
    for (const j of Object.values(agentJobs)) expect([j.model, j.step, j.route].every(Boolean)).toBe(true);
    for (const ids of Object.values(jobsOnVisit)) for (const id of ids) expect(agentJobs[id]).toBeDefined();
  });
});

describe('AppState runs the step jobs once per craft and shows them per step', () => {
  it('capture describes the picture; opening a step runs its jobs once; a chat note becomes a refine job', async () => {
    const app = new AppState(new ProjectStore(new MemoryStorage()));
    app.startCraft('a layered picture of a lake');
    app.startFromCapture({ images: ['x'], mode: 'single' });
    app.visit('cutout'); app.visit('cutout'); app.visit('segment');
    await settle();
    expect(app.activity().map((t) => t.summary)).toEqual([
      'Reads “a layered picture of a lake” as layered picture', 'Sees layered paper art in a round hoop',
      'Background removed · circle outline, Ø 300 mm', '5 regions found'
    ]);
    expect(app.activity('shape').map((t) => t.model)).toEqual(['SAM 3.1', 'SAM 3.1']);
    await app.ask('raise the sun', '/make/segment');
    await settle();
    expect(app.activity().at(-1)).toMatchObject({ model: 'Muse Spark 1.3', status: 'placeholder', summary: 'Will apply “raise the sun”' });
  });
});
