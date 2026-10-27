import { describe, it, expect } from 'vitest';
import { parseSamBoxes } from './sam';
const PROBE = `<0f>0<|box;x1=679;y1=195;x2=1019;y2=742;w=1024;h=1024|><|mask;x=0;y=0;data=abc|><|box;x1=350;y1=232;x2=703;y2=848;w=1024;h=1024|><|mask;x=0;y=0;data=def|>`;
describe('parseSamBoxes (SAM 3.1 text output)', () => {
  it('extracts boxes normalised to 0-1000', () => {
    const boxes = parseSamBoxes(PROBE);
    expect(boxes).toHaveLength(2);
    expect(boxes[0].x1).toBeCloseTo(663, -1);
    expect(boxes[1].y2).toBeCloseTo(828, -1);
  });
  it('returns empty for no segments', () => { expect(parseSamBoxes('nothing')).toEqual([]); });
});
