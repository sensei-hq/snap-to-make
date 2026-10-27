import { describe, it, expect } from 'vitest';
import { objectFromPieces, buildBreakdown } from './convert';
const pieces = [
  { name: 'Front face', kind: 'face', note: 'blossom panel with windows' },
  { name: 'Date wheel', kind: 'wheel', note: '31 days ring' },
  { name: 'Base / stand', kind: 'base', note: 'oval base' }
] as any;
describe('objectFromPieces (agreed objective keeps the model dissection)', () => {
  it('builds Object parts named after dissection pieces, no generic holder', () => {
    const obj = objectFromPieces('Perpetual calendar', pieces, 'laser-cut');
    expect(obj.parts.map(p => p.name)).toEqual(['Front face', 'Date wheel', 'Base / stand']);
    expect(obj.parts.some(p => p.template === 'finger_box_open')).toBe(false);
    const wheel = obj.parts.find(p => p.name === 'Date wheel');
    expect(wheel?.intent.kind).toBe('wheel');
  });
  it('breakdown gallery pieces keep their kind for per-kind rendering', () => {
    const obj = objectFromPieces('Perpetual calendar', pieces, 'laser-cut');
    const b = buildBreakdown(obj, 'laser-cut');
    expect(b.pieces.map(p => p.name)).toContain('Date wheel');
    expect(b.pieces.find(p => p.name === 'Date wheel')?.kind).toBe('wheel');
  });
});
