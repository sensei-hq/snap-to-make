import { describe, expect, it } from 'vitest';
import { makeAs, steps } from './layers';

describe('image → layers routes (gated in order; the journey groups them, see journey.spec.ts)', () => {
  it('runs import → … → output → assemble', () => {
    expect(steps.map((s) => s.id)).toEqual(['import', 'cutout', 'segment', 'layers', 'gaps', 'output', 'assemble']);
  });

  it('D1 · make it as: Katachi picks, paper, wood or acrylic (where the image comes from is Capture)', () => {
    expect(makeAs.map((m) => m.id)).toEqual(['auto', 'paper', 'wood', 'acrylic']);
  });
});
