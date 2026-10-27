import { describe, it, expect } from 'vitest';
import { pieceShape, pieceFinalLabel } from './gallery';
describe('piece gallery descriptor', () => {
  it('round pieces are round, cut red dims labelled', () => {
    expect(pieceShape({ name: 'coaster-1', kind: 'pattern', cutMm: 95, finalMm: 95, note: 'flat piece' }).isRound).toBe(true);
    expect(pieceShape({ name: 'wall', kind: 'join', cutMm: 100, finalMm: 100, note: 'finger join' }).hasJointTeeth).toBe(true);
  });
  it('shrink pieces show cut AND final size', () => {
    expect(pieceFinalLabel({ name: 'charm', kind: 'pattern', cutMm: 100, finalMm: 40, note: 'flat piece' }, 'shrink-plastic')).toContain('100');
    expect(pieceFinalLabel({ name: 'charm', kind: 'pattern', cutMm: 100, finalMm: 40, note: 'flat piece' }, 'shrink-plastic')).toContain('40');
  });
});
