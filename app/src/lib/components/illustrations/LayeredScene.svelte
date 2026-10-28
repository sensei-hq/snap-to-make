<script lang="ts">
// The app's own example subject for the layers flow: a layered "Mountain sunset" in a round hoop,
// drawn in code (no photo). Layer colours come from the fixture (they depict the art, so they are raw).
import type { Layer, LayerShape, RegionId, Tone } from '$lib/content/layers';
import { shapes } from './mountain';
type Mode = 'original' | 'cutout' | 'full' | 'regions' | 'layer' | 'stack';
// layer mode: `solid` fills the part of the selected layer you see, `hidden` hatches the part covered by the layers in front.
let { layers, mode = 'full', selected = 0, regions = [], label = 'Layered mountain sunset in a round hoop', solid = true, hidden = true }: {
  layers: Layer[]; mode?: Mode; selected?: number;
  regions?: { id: RegionId; on: boolean; tone: Tone }[]; label?: string; solid?: boolean; hidden?: boolean;
} = $props();

const uid = `ls${Math.random().toString(36).slice(2, 8)}`;
const regionShapes: Record<RegionId, LayerShape[]> = { frame: [], sky: ['sky'], sun: ['sun'], mountains: ['far', 'ridge'], trees: ['hills', 'pines'] };
const toneVar: Record<Tone, string> = { muted: 'var(--ink-soft)', warn: 'var(--warning)', accent: 'var(--accent)', ok: 'var(--success)', ink: 'var(--ink)' };
const sel = $derived(layers.find((l) => l.n === selected));
</script>

<svg viewBox="0 0 300 300" class="w-full h-full block" role="img" aria-label={label}>
  <defs>
    <clipPath id="{uid}-disc"><circle cx="150" cy="150" r="132" /></clipPath>
    <pattern id="{uid}-hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
      <line x1="0" y1="0" x2="0" y2="6" stroke="var(--ink-soft)" stroke-width="1.2" />
    </pattern>
  </defs>

  {#if mode === 'original'}<rect width="300" height="300" fill="#E9E1D3" /><rect x="0" y="252" width="300" height="48" fill="#D8CDBA" />{/if}

  {#if mode === 'stack'}
    {#each layers as l (l.n)}
      <g transform="translate({20 + (l.n - 1) * 18} {-30 + (layers.length - l.n) * 14}) scale(0.62)">
        <g clip-path="url(#{uid}-disc)">{#each l.shapes as s (s)}<path d={shapes[s]} fill={l.colour} />{/each}</g>
        <circle cx="150" cy="150" r="132" fill="none" stroke="var(--paper-edge)" stroke-width="2" />
      </g>
    {/each}
  {:else}
    <g clip-path="url(#{uid}-disc)">
      {#each layers as l (l.n)}
        {#each l.shapes as s (s)}
          {#if mode === 'layer' && l.n === selected && !solid}
            <path d={shapes[s]} fill="none" stroke={l.colour} stroke-width="2" />
          {:else}
            <path d={shapes[s]} fill={l.colour} opacity={mode === 'regions' ? 0.35 : mode === 'layer' && l.n !== selected ? 0.18 : 1} />
          {/if}
        {/each}
      {/each}
      {#if mode === 'regions'}
        {#each regions as r (r.id)}
          {#each regionShapes[r.id] as s (s)}
            <path d={shapes[s]} fill={r.on ? toneVar[r.tone] : `url(#${uid}-hatch)`} fill-opacity={r.on ? 0.45 : 1} stroke={toneVar[r.tone]} stroke-width="1.5" />
          {/each}
        {/each}
      {/if}
      {#if mode === 'layer' && sel && hidden}
        {#each layers.filter((l) => l.n > selected) as front (front.n)}{#each front.shapes as s (s)}<path d={shapes[s]} fill="url(#{uid}-hatch)" />{/each}{/each}
      {/if}
    </g>
    {#if mode === 'original' || mode === 'full'}<circle cx="150" cy="150" r="136" fill="none" stroke="#6E5236" stroke-width="8" />{/if}
    {#if mode === 'regions'}
      {@const frame = regions.find((r) => r.id === 'frame')}
      <circle cx="150" cy="150" r="136" fill="none" stroke={frame?.on ? toneVar.muted : 'var(--ink-faint)'} stroke-width="8" stroke-dasharray={frame?.on ? '' : '6 6'} />
    {/if}
    {#if mode === 'cutout'}<circle cx="150" cy="150" r="133" fill="none" stroke="var(--accent)" stroke-width="2" stroke-dasharray="6 5" />{/if}
  {/if}
</svg>
