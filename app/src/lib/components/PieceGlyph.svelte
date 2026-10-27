<script lang="ts">
// One piece drawn as its cut (accent) and engrave (ink) layers, on graph paper. Shared by detail and gallery.
let { kind, label, caption = '', title = '', class: cls = '' }: { kind: string; label: string; caption?: string; title?: string; class?: string } = $props();
const spokes = [0, 60, 120, 180, 240, 300].map((a) => [60 + 22 * Math.cos(a * Math.PI / 180), 56 + 22 * Math.sin(a * Math.PI / 180)]);
</script>
<svg viewBox="0 0 120 120" role="img" aria-label={label} class="block grid-thumb {cls}" fill="none" stroke-width="2">
  {#if kind === 'wheel'}
    <circle cx="60" cy="56" r="36" stroke="var(--cut)" /><circle cx="60" cy="56" r="22" stroke="var(--engrave)" /><circle cx="60" cy="56" r="4" fill="var(--cut)" />
    {#each spokes as [x, y], i (i)}<line x1="60" y1="56" x2={x} y2={y} stroke="var(--engrave)" stroke-width="1" />{/each}
    <rect x="48" y="24" width="24" height="12" stroke="var(--cut)" stroke-width="1.5" />
  {:else if kind === 'face'}
    <rect x="26" y="20" width="68" height="72" rx="4" stroke="var(--cut)" />
    <rect x="38" y="34" width="16" height="12" stroke="var(--engrave)" stroke-width="1.5" /><rect x="66" y="34" width="16" height="12" stroke="var(--engrave)" stroke-width="1.5" />
    <circle cx="60" cy="68" r="10" stroke="var(--engrave)" stroke-width="1.5" />
  {:else if kind === 'base'}
    <ellipse cx="60" cy="80" rx="40" ry="12" stroke="var(--cut)" /><path d="M38 80 v-28 h44 v28" stroke="var(--engrave)" stroke-width="1.5" />
  {:else if kind === 'join'}
    <rect x="22" y="44" width="76" height="28" stroke="var(--cut)" /><path d="M32 72 v-9 h8 v9 h8 v-9 h8 v9 h8 v-9 h8 v9" stroke="var(--engrave)" />
  {:else if kind === 'layer'}
    <rect x="30" y="26" width="60" height="60" rx="4" stroke="var(--cut)" /><rect x="38" y="34" width="60" height="60" rx="4" stroke="var(--engrave)" stroke-width="1.5" opacity="0.7" />
  {:else}
    <rect x="28" y="24" width="64" height="68" rx="4" stroke="var(--cut)" /><circle cx="60" cy="58" r="12" stroke="var(--engrave)" stroke-width="1.5" />
  {/if}
  {#if caption}<text x="60" y="108" text-anchor="middle" fill="var(--ink)" stroke="none" class="font-mono" font-size="8">{caption}</text>{/if}
  {#if title}<text x="60" y="13" text-anchor="middle" fill="var(--ink-mute)" stroke="none" class="font-sans" font-size="7">{title}</text>{/if}
</svg>
