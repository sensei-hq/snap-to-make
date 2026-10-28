// Image → layers flow: copy and fixture data only (no markup). Flow, copy and state model follow the
// design mock; the example subject is the app's own "Mountain sunset", drawn in code by
// components/illustrations/LayeredScene.svelte. (The mock's reference photos are third-party listings
// and never ship.) Stages follow docs/design/01-image-pipeline.md.

export type LayerSetId = 'paper' | 'wood';
export type LayerShape = 'sky' | 'sun' | 'far' | 'ridge' | 'hills' | 'pines';
export interface Layer { n: number; name: string; shape: LayerShape; colour: string; visiblePct: number; hiddenPct: number; material: string; flag?: string }
export interface LayerSet {
  label: string; project: string; headline: string; device: string; spacer: string; mmPerLayer: number;
  /** layers that carry the stack under the "smart" gap rule (doc 01 · S6) */
  structural: number[];
  layers: Layer[];
}

type Row = [name: string, shape: LayerShape, colour: string, visiblePct: number, hiddenPct: number, material: string, flag?: string];
const build = (rows: Row[]): Layer[] => rows.map(([name, shape, colour, visiblePct, hiddenPct, material, flag], i) => ({ n: i + 1, name, shape, colour, visiblePct, hiddenPct, material, flag }));

export const layerSets: Record<LayerSetId, LayerSet> = {
  paper: {
    label: 'Paper layers', project: 'Mountain sunset', headline: '6 sheets of cardstock, colour-matched',
    device: 'Cricut Maker or diode laser at 8% · 12 × 12 in', spacer: '1.5 mm foam dots between layers for depth', mmPerLayer: 1.8,
    structural: [1, 5, 6],
    layers: build([
      ['Sky', 'sky', '#F2B880', 22.0, 78.0, 'Apricot cardstock'],
      ['Sun', 'sun', '#F7DFA8', 2.4, 0.6, 'Butter cardstock'],
      ['Far peaks', 'far', '#9AA9B8', 14.6, 61.2, 'Slate blue'],
      ['Snow ridge', 'ridge', '#E6E2D8', 9.8, 52.4, 'Cream cardstock', 'Thin ridge line under 1 mm in two places'],
      ['Hills', 'hills', '#7C8C5E', 21.5, 30.1, 'Sage'],
      ['Front pines', 'pines', '#2F3F2E', 29.7, 0.0, 'Black-green']
    ])
  },
  wood: {
    label: 'Laser wood + paint', project: 'Mountain sunset', headline: '5 layers of 3 mm birch, stain + paint',
    device: 'xTool S1 · 300 × 300 mm · paint before glue-up', spacer: 'Glued flush · 3 mm per layer, 15 mm deep', mmPerLayer: 3,
    structural: [1, 5],
    layers: build([
      ['Back panel', 'sky', '#8A6A4F', 24.4, 75.6, '3 mm birch · walnut stain'],
      ['Sun', 'sun', '#D9A066', 2.4, 0.6, '3 mm birch · ochre paint'],
      ['Mountains', 'far', '#A07E5E', 24.4, 58.0, '3 mm birch · mid stain'],
      ['Hills', 'hills', '#6F5640', 21.5, 30.1, '3 mm birch · dark stain'],
      ['Front pines', 'pines', '#3B2E24', 27.3, 0.0, '3 mm birch · ebony stain']
    ])
  }
};

export type RegionId = 'frame' | 'sky' | 'sun' | 'mountains' | 'trees';
export type Tone = 'muted' | 'warn' | 'accent' | 'ok' | 'ink';
/** tone is a semantic colour role, never a raw colour */
export const regions: { id: RegionId; name: string; pct: number; note: string; tone: Tone; keep: boolean }[] = [
  { id: 'frame', name: 'Frame ring', pct: 12.6, note: 'Embroidery hoop · looks bought', tone: 'muted', keep: false },
  { id: 'sky', name: 'Sky', pct: 21.4, note: 'Flat apricot · back layer', tone: 'warn', keep: true },
  { id: 'sun', name: 'Sun', pct: 2.4, note: 'Small disc · could raise on a spacer', tone: 'accent', keep: true },
  { id: 'mountains', name: 'Mountains', pct: 24.4, note: 'Peaks and a snow ridge · 2 tones', tone: 'ok', keep: true },
  { id: 'trees', name: 'Hills and pines', pct: 39.2, note: '2 depths of green', tone: 'ink', keep: true }
];

export const steps = [
  { id: 'source', label: 'Source', path: '/snap/layers/source' },
  { id: 'cutout', label: 'Cutout', path: '/snap/layers/cutout' },
  { id: 'objects', label: 'Objects', path: '/snap/layers/objects' },
  { id: 'layers', label: 'Layers', path: '/snap/layers/layers' },
  { id: 'gaps', label: 'Gaps', path: '/snap/layers/gaps' },
  { id: 'material', label: 'Material', path: '/snap/layers/material' },
  { id: 'cut', label: 'Cut', path: '/snap/layers/cut' }
] as const;
export type StepId = (typeof steps)[number]['id'];

export type Kind = 'flat' | '3d' | 'ref';
export const kinds: { id: Kind; label: string; hint: string; next: string }[] = [
  { id: 'flat', label: 'Flat · layered art', hint: 'Paper, wood or acrylic layers stacked for depth. One photo is enough.', next: '/snap/layers/cutout' },
  { id: '3d', label: '3D object · 6 views', hint: 'A real object to rebuild in parts. I will ask for front, back, sides, top and bottom.', next: '/snap/layers/views' },
  { id: 'ref', label: 'Reference + changes', hint: 'Use this as the starting point and tell me what to change.', next: '/snap/layers/reference' }
];

export type GapChoice = 'extend' | 'leave' | 'imagine' | 'draw';
export const gapChoices: { id: GapChoice; label: string; hint: string; tag: string }[] = [
  { id: 'extend', label: 'Extend behind', hint: 'One solid sheet — sturdy, uses more paper', tag: 'default' },
  { id: 'leave', label: 'Leave it open', hint: 'Cut only what shows, plus a 3 mm glue lip', tag: '−60% paper' },
  { id: 'imagine', label: 'Let Katachi imagine it', hint: 'Inpaint what peeks through if you shift layers', tag: '≈ $0.01' },
  { id: 'draw', label: "I'll draw it", hint: 'Open this layer in the editor', tag: '' }
];

export type GapRule = 'extend' | 'smart' | 'leave';
export const gapRules: { id: GapRule; label: string; hint: string }[] = [
  { id: 'extend', label: 'Extend every layer', hint: 'Solid sheets, strongest stack' },
  { id: 'smart', label: "Katachi's mix", hint: 'Solid where it carries weight, open elsewhere' },
  { id: 'leave', label: 'Leave all open', hint: 'Least material, needs a backing board' }
];

export type ViewId = 'front' | 'right' | 'back' | 'left' | 'top' | 'base';
export const views: { id: ViewId; label: string }[] = [
  { id: 'front', label: 'Front' }, { id: 'right', label: 'Right' }, { id: 'back', label: 'Back' },
  { id: 'left', label: 'Left' }, { id: 'top', label: 'Top' }, { id: 'base', label: 'Base' }
];

export const changes = [
  { n: 1, label: 'Sun → crescent moon', where: 'L2 sun' },
  { n: 2, label: 'Small cabin on the hills', where: 'L5 hills' },
  { n: 3, label: 'Scale to Ø 300 mm', where: 'all layers' }
];

export type DeviceId = 'cricut' | 'xtool' | 'glowforge' | 'file';
export const devices: { id: DeviceId; label: string; adapter: string; status: string; format: string; settings: string; time: string; cta: string }[] = [
  { id: 'cricut', label: 'Cricut Maker 3', adapter: 'blade · cricut-svg · design-space', status: 'paired', format: 'SVG · one mat per layer', settings: 'Medium cardstock · 2 passes', time: '≈ 22 min', cta: 'Send 6 sheets' },
  { id: 'xtool', label: 'xTool S1 laser', adapter: 'laser · svg-colour-ops · lan-http', status: 'online', format: 'SVG · cut + score', settings: '10 W · 8% power · 300 mm/s', time: '≈ 12 min', cta: 'Start cut' },
  { id: 'glowforge', label: 'Glowforge Pro', adapter: 'laser · svg · cloud', status: 'offline', format: 'SVG · Proofgrade', settings: 'Uncertified cardstock', time: '≈ 16 min', cta: 'Queue job' },
  { id: 'file', label: 'Just the files', adapter: 'export · download', status: '', format: 'SVG · DXF · PDF', settings: '—', time: '—', cta: 'Export files' }
];

export const copy = {
  source: {
    title: 'New from an image', sub: 'source · upload or snap', file: 'mountain-sunset.png', fileMeta: '2048 × 2048 · from Photos',
    what: 'What is it?',
    agent: 'Looks like layered paper art in a round hoop. I’ll lift it off the wall, then split it into the parts you’d cut.',
    change: 'Change it first', next: 'Find the outline'
  },
  cutout: {
    sub: 'cutout · background removed', original: 'Original', cutout: 'Cutout',
    checks: [
      { status: 'pass', text: 'Wall removed · SAM 3.1' },
      { status: 'pass', text: 'Outline · circle, 2% off round · Ø 300 mm?' },
      { status: 'warn', text: 'Shadow on the lower edge · erase?' }
    ],
    touch: 'Touch up edge', next: 'Find the objects'
  },
  objects: { sub: 'objects · 5 regions', agent: 'I found 5 regions. Which should become parts? The hoop looks bought — I left it out.', next: 'Split into layers' },
  layers: { sub: 'layers · colour groups', order: 'Back → front', next: 'Fill the gaps' },
  gaps: {
    sub: 'gaps · what sits behind',
    agent: 'Most of the back layers are hidden behind the ones in front. The photo can’t show what’s there — how should I fill it?',
    all: 'Use this for all layers', rule: 'Rule for all layers', next: 'Pick materials'
  },
  material: { sub: 'material · per layer', next: 'Ready to cut' },
  cut: {
    sub: 'cut · sheets ready', export: 'Export files',
    rows: [['Registration', '3 pin holes per sheet'], ['Stack', 'Ø 300 · back → front']] as [string, string][],
    assembly: ['Glue sheet 01 to a backing board.', 'Foam dots (1.5 mm) on each sheet, back to front.', 'Seat the sun on a double spacer.']
  },
  views: { title: 'Birdhouse', sub: '3D object · 6 views', shutter: 'Take this view', done: 'All 6 views captured', allIn: 'All sides in. I can unfold it into flat parts now.' },
  reference: {
    title: 'Mountain sunset · remix', sub: 'reference + changes',
    ask: 'Swap the sun for a crescent moon, add a small cabin on the hills, and make it 30 cm.',
    reply: 'Keeping your layer order. Only two layers change:', next: 'See layers'
  }
};
