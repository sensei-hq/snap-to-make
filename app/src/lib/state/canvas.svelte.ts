// Canvas + make shell state. Mock API returns the nested sheet plan until
// the canvas route is backed by Impl placements from /api/design.
export interface CanvasPiece { id: string; kind: 'circle' | 'rect'; xMm: number; yMm: number; wMm: number; hMm: number; op: 'cut' | 'engrave'; label?: string }
export interface CanvasPlan { sheet: { wMm: number; hMm: number }; pieces: CanvasPiece[]; preflight: { label: string; ok: boolean }[]; estMin: number; deviceLabel: string; suggestion: string }
const mockCanvasApi = {
  async plan(): Promise<CanvasPlan> {
    await new Promise(r => setTimeout(r, 20));
    const circles: CanvasPiece[] = [0, 1, 2, 3].map(i => ({ id: `coaster-${i}`, kind: 'circle', xMm: 12 + (i % 2) * 105, yMm: 12 + Math.floor(i / 2) * 105, wMm: 95, hMm: 95, op: 'cut', label: 'M' }));
    return {
      sheet: { wMm: 300, hMm: 300 },
      pieces: [...circles,
        { id: 'wall-a', kind: 'rect', xMm: 12, yMm: 225, wMm: 103, hMm: 40, op: 'cut' },
        { id: 'wall-b', kind: 'rect', xMm: 125, yMm: 225, wMm: 103, hMm: 40, op: 'cut' },
        { id: 'base', kind: 'rect', xMm: 238, yMm: 225, wMm: 50, hMm: 40, op: 'cut' }],
      preflight: [{ label: 'Fits the bed', ok: true }, { label: 'Paths closed', ok: true }, { label: 'Engrave before cut', ok: true }],
      estMin: 14, deviceLabel: 'Ray 5 · birch_3mm · GRBL', suggestion: 'Walls at 45 mm — still fits. Want a lid?'
    };
  }
};
export class CanvasState {
  plan = $state<CanvasPlan | null>(null);
  get sheet() { return this.plan?.sheet ?? { wMm: 300, hMm: 300 }; }
  get pieces() { return this.plan?.pieces ?? []; }
  get preflight() { return this.plan?.preflight ?? []; }
  get estMin() { return this.plan?.estMin ?? 0; }
  async load(api = mockCanvasApi) { this.plan = await api.plan(); }
  svg() {
    const p = this.pieces.map(x => x.kind === 'circle'
      ? `<circle cx="${x.xMm + x.wMm / 2}" cy="${x.yMm + x.hMm / 2}" r="${x.wMm / 2}"/>`
      : `<rect x="${x.xMm}" y="${x.yMm}" width="${x.wMm}" height="${x.hMm}"/>`).join('');
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${this.sheet.wMm} ${this.sheet.hMm}">${p}</svg>`;
  }
  gcode() { return ['G21', 'G90', ...this.pieces.map((_, i) => `G1 X${10 + i * 5} Y${10 + i * 5} F1200`), 'M2'].join('\n'); }
}
