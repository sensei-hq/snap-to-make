import { describe, expect, it } from 'vitest';
import { EditorState } from './editor.svelte';

describe('EditorState (desktop canvas editor, mock ShellState)', () => {
  it('starts on select, cut, the Properties tab, 100 % zoom with the grid on', () => {
    const e = new EditorState();
    expect([e.tool, e.op, e.tab, e.zoom, e.showGrid]).toEqual(['select', 'cut', 'properties', 100, true]);
    expect(e.zoomLabel).toBe('100%');
  });

  it('zooms in 25 % steps between 25 % and 400 %', () => {
    const e = new EditorState();
    e.zoomIn(); expect(e.zoom).toBe(125);
    for (let i = 0; i < 20; i++) e.zoomIn();
    expect(e.zoom).toBe(400);
    for (let i = 0; i < 20; i++) e.zoomOut();
    expect(e.zoom).toBe(25);
  });

  it('keeps power, speed and passes per operation, clamped to their ranges', () => {
    const e = new EditorState();
    expect(e.params).toEqual({ power: 80, speed: 6, passes: 1 });
    e.setParam('power', 150);
    expect(e.params.power).toBe(100);
    e.setOp('engrave');
    expect(e.params).toEqual({ power: 35, speed: 40, passes: 1 });
    e.setParam('passes', 0);
    expect(e.params.passes).toBe(1);
    e.setOp('cut');
    expect(e.params.power).toBe(100);
  });

  it('switches tools, tabs, grid and air assist, and reports a status line', () => {
    const e = new EditorState();
    e.setTool('measure'); e.setTab('job'); e.toggleGrid(); e.toggleAir();
    expect([e.tool, e.tab, e.showGrid, e.airAssist]).toEqual(['measure', 'job', false, false]);
    expect(e.statusLine).toBe('cut · 80% power · 6 mm/s · 1 pass · air off');
  });
});
