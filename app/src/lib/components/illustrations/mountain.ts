// The Mountain sunset's layer shapes (300 × 300, the hoop is a circle r 132 at the centre), shared by LayeredScene and ExplodedLayers.
import type { LayerShape } from '$lib/content/layers';

const peaks = 'M15 205 L70 125 L105 162 L150 85 L195 150 L230 110 L290 192 L290 300 L15 300 Z';
const snow = 'M131 112 L150 85 L170 116 L160 108 L150 119 L140 108 Z M214 126 L230 110 L249 137 L239 131 L230 139 L222 131 Z';
const hills = 'M10 232 Q80 192 150 216 T292 206 L292 300 L10 300 Z';
const pines = [24, 46, 68, 92, 118, 186, 210, 236, 262, 280].map((x, i) => {
  const h = 34 + ((i * 17) % 22);
  return `M${x - 11} 286 L${x} ${286 - h} L${x + 11} 286 Z`;
}).join(' ');
export const shapes: Record<LayerShape, string> = { sky: 'M0 0 H300 V300 H0 Z', sun: 'M171 115 a24 24 0 1 0 48 0 a24 24 0 1 0 -48 0', far: peaks, ridge: snow, hills, pines };
