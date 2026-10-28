import { describe, expect, it } from 'vitest';
import { howItWorks, journey, journeyPath, journeyStepFor, journeyStrip, startFor, starts } from './journey';
import { steps } from './layers';

describe('the craft journey (docs/design/07 §1)', () => {
  it('has five steps with the same names everywhere', () => {
    expect(journey.map((j) => j.label)).toEqual(['Capture', 'Shape', 'Layers', 'Sheets', 'Assemble']);
  });

  it('owns every flow route exactly once', () => {
    const owned = journey.flatMap((j) => j.routes);
    expect(new Set(owned).size).toBe(owned.length);
    for (const s of steps) expect(owned).toContain(s.path);
    expect(owned).toEqual(expect.arrayContaining(['/capture', '/make/views', '/make/reference']));
  });

  it('maps a route to its step and outside the flow to nothing', () => {
    expect(journeyStepFor('/make/cutout')?.id).toBe('shape');
    expect(journeyStepFor('/make/gaps')?.id).toBe('layers');
    expect(journeyStepFor('/make/views')?.id).toBe('layers');
    expect(journeyStepFor('/canvas')).toBeNull();
  });

  it('phone strip: "02 / 05 · Shape · outline", next named; 3D names parts & joins', () => {
    expect(journeyStrip('/make/cutout')).toEqual({ n: 2, total: 5, label: 'Shape', sub: 'outline', next: 'layers' });
    expect(journeyStrip('/make/import', '3d')?.next).toBe('parts & joins');
    expect(journeyStrip('/make/assemble')?.next).toBeNull();
    expect(journeyStrip('/watch')).toBeNull();
  });

  it('a 3D craft opens Layers on its parts & joins', () => {
    const layers = journey.find((j) => j.id === 'layers')!;
    expect(journeyPath(layers, '3d')).toBe('/make/views');
    expect(journeyPath(layers, 'flat')).toBe('/make/layers');
  });
});

describe('starting a craft', () => {
  it('offers four starting points that preset Capture', () => {
    expect(starts.map((s) => [s.id, s.kind, s.mode, s.source])).toEqual([
      ['flat', 'flat', 'single', 'upload'], ['3d', '3d', 'multi', 'camera'], ['ref', 'ref', 'single', 'upload'], ['sketch', 'flat', 'single', 'sketch']
    ]);
  });

  it('reads the starting point from what was said', () => {
    expect(startFor('a layered mountain picture for Maya').id).toBe('flat');
    expect(startFor('a birdhouse like this one').id).toBe('3d');
    expect(startFor('let me sketch a fox').id).toBe('sketch');
    expect(startFor('remix this with a moon instead').id).toBe('ref');
  });

  it('the landing explains five steps, each naming who does it', () => {
    expect(howItWorks).toHaveLength(5);
    for (const s of howItWorks) expect(s.models.length).toBeGreaterThan(0);
  });
});
