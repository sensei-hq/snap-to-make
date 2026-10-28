import { changes, devices, gapChoices, kinds, layerSets, regions, views, type DeviceId, type GapChoice, type GapRule, type Kind, type LayerSetId, type RegionId, type ViewId } from '../content/layers';

// Every choice in the image → layers flow (phone steps and studio). Pages read fields and call methods;
// components only get values. Stages mirror docs/design/01-image-pipeline.md (S1–S9).
export class LayerFlowState {
  // S1 · source
  kind = $state<Kind>('flat');
  get currentKind() { return kinds.find((k) => k.id === this.kind) ?? kinds[0]; }
  setKind(k: Kind) { this.kind = k; }

  // S3 · cutout
  cutoutView = $state<'original' | 'cutout'>('cutout');
  setCutoutView(v: 'original' | 'cutout') { this.cutoutView = v; }

  // S4 · which regions become parts
  keep = $state(Object.fromEntries(regions.map((r) => [r.id, r.keep])) as Record<RegionId, boolean>);
  get regions() { return regions.map((r) => ({ ...r, on: this.keep[r.id] })); }
  get kept() { return this.regions.filter((r) => r.on); }
  get keptPct() { return Math.round(this.kept.reduce((a, r) => a + r.pct, 0)); }
  toggleRegion(id: RegionId) { this.keep[id] = !this.keep[id]; }

  // S5a · colour-graded layers
  set = $state<LayerSetId>('paper');
  sel = $state(4);
  get data() { return layerSets[this.set]; }
  get layers() { return this.data.layers; }
  get structural() { return this.data.structural; }
  get selected() { return this.layers[Math.min(this.sel, this.layers.length) - 1]; }
  get depthMm() { return (this.selected.n * this.data.mmPerLayer).toFixed(1); }
  setSet(s: LayerSetId) { this.set = s; this.sel = 4; this.overrides = {}; }
  selectLayer(n: number) { this.sel = n; }

  // S6 · gaps for one layer (phone)
  gapChoice = $state<GapChoice>('extend');
  applyAll = $state(true);
  get currentGap() { return gapChoices.find((g) => g.id === this.gapChoice) ?? gapChoices[0]; }
  setGapChoice(g: GapChoice) { this.gapChoice = g; }
  toggleApplyAll() { this.applyAll = !this.applyAll; }

  // S6 · gaps for the whole stack (studio review)
  gapRule = $state<GapRule>('smart');
  overrides = $state<Record<number, boolean>>({});
  get gapCards() {
    return this.layers.map((l) => {
      const byRule = this.gapRule === 'extend' ? true : this.gapRule === 'leave' ? false : this.structural.includes(l.n);
      return { ...l, solid: l.n in this.overrides ? this.overrides[l.n] : byRule };
    });
  }
  get materialPct() { return Math.round(this.gapCards.reduce((a, l) => a + (l.solid ? 100 : l.visiblePct + 4), 0) / this.gapCards.length); }
  setGapRule(r: GapRule) { this.gapRule = r; this.overrides = {}; }
  toggleSolid(n: number) { const card = this.gapCards.find((c) => c.n === n); if (card) this.overrides = { ...this.overrides, [n]: !card.solid }; }

  // S5b · six views
  done = $state<ViewId[]>(['front', 'right', 'back']);
  get views() { return views.map((v) => ({ ...v, ok: this.done.includes(v.id) })); }
  get nextView() { return views.find((v) => !this.done.includes(v.id)); }
  get sidesKnown() { return this.done.includes('left') || this.done.includes('right'); }
  shoot() { if (this.nextView) this.done = [...this.done, this.nextView.id]; }
  toggleView(id: ViewId) { this.done = this.done.includes(id) ? this.done.filter((d) => d !== id) : [...this.done, id]; }

  // reference + changes
  skipped = $state<number[]>([]);
  get changes() { return changes.map((c) => ({ ...c, on: !this.skipped.includes(c.n) })); }
  get activeChanges() { return this.changes.filter((c) => c.on).length; }
  toggleChange(n: number) { this.skipped = this.skipped.includes(n) ? this.skipped.filter((s) => s !== n) : [...this.skipped, n]; }

  // output · device adapter (docs/design/03)
  device = $state<DeviceId>('cricut');
  get currentDevice() { return devices.find((d) => d.id === this.device) ?? devices[0]; }
  setDevice(d: DeviceId) { this.device = d; }
}
