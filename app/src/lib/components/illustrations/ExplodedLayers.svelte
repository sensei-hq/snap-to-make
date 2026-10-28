<script lang="ts">
// What Katachi does, in one picture: the picture split into its cut layers, drawn as an exploded isometric
// stack (back layer at the bottom, front layer on top). Shapes are the code-drawn Mountain sunset (mountain.ts).
import type { Layer } from '$lib/content/layers';
import { shapes } from './mountain';
let { layers, animate = true, label = 'A picture split into its cut layers, stacked back to front' }: { layers: Layer[]; animate?: boolean; label?: string } = $props();
const uid = `xl${Math.random().toString(36).slice(2, 8)}`;
const gap = $derived(Math.min(46, 230 / Math.max(1, layers.length - 1)));
const base = $derived(130 + (layers.length - 1) * gap);
// isometric plane: half height, rotated 45°
const iso = 'matrix(0.62 0.36 -0.62 0.36 0 0) translate(-150 -150)';
</script>
<svg viewBox="0 0 470 {base + 130}" class="w-full h-auto block" role="img" aria-label={label}>
  <defs><clipPath id="{uid}-disc"><circle cx="150" cy="150" r="132" /></clipPath></defs>
  {#each layers as l, i (l.n)}
    <g class="sheet" class:animate style:--y="{base}px" style:--lift="{-i * gap}px" style:--i={i}>
      <g transform={iso}>
        <circle cx="150" cy="150" r="132" fill="var(--paper)" fill-opacity="0.35" stroke="var(--ink-soft)" stroke-width="1.6" stroke-dasharray={i === 0 ? '' : '5 5'} />
        <g clip-path="url(#{uid}-disc)">{#each l.shapes as s (s)}<path d={shapes[s]} fill={l.colour} />{/each}</g>
      </g>
      <text x="150" y="4" fill="var(--ink-soft)" font-size="11" font-family="var(--font-mono, monospace)">{String(l.n).padStart(2, '0')} {l.name}</text>
    </g>
  {/each}
</svg>
<style>
  .sheet { transform: translate(180px, calc(var(--y) + var(--lift))); }
  .sheet.animate { animation: lift 7s ease-in-out infinite; animation-delay: calc(var(--i) * 70ms); }
  @keyframes lift {
    0%, 60% { transform: translate(180px, calc(var(--y) + var(--lift))); }
    75%, 85% { transform: translate(180px, calc(var(--y) + var(--lift) * 0.12)); }
    100% { transform: translate(180px, calc(var(--y) + var(--lift))); }
  }
</style>
