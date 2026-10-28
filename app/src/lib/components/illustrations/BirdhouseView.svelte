<script lang="ts">
// The six-view example subject: a birdhouse on a dark sweep, drawn in code (no photo). Wood colours depict the object.
import type { ViewId } from '$lib/content/layers';
let { view, label = '' }: { view: ViewId; label?: string } = $props();
const wall = '#C29E73', roof = '#6E4E33', bg = '#2E261F';
</script>
<svg viewBox="0 0 240 220" class="w-full h-full block" role="img" aria-label={label || `Birdhouse, ${view} view`}>
  <rect width="240" height="220" fill={bg} />
  <line x1="20" y1="198" x2="220" y2="198" stroke={roof} stroke-width="3" />
  {#if view === 'front' || view === 'back'}
    <path d="M60 190 V95 L120 40 L180 95 V190 Z" fill={wall} />
    <path d="M45 102 L120 30 L195 102" fill="none" stroke={roof} stroke-width="10" stroke-linejoin="round" />
    {#if view === 'front'}<circle cx="120" cy="105" r="16" fill={bg} /><rect x="116" y="132" width="8" height="18" fill={roof} />{:else}<circle cx="120" cy="70" r="4" fill={bg} />{/if}
  {:else if view === 'left' || view === 'right'}
    <rect x="50" y="85" width="140" height="105" fill={wall} />
    <path d="M38 88 L120 45 L202 88" fill="none" stroke={roof} stroke-width="8" stroke-linejoin="round" />
    <rect x="50" y="82" width="140" height="6" fill={roof} opacity="0.6" />
  {:else if view === 'top'}
    <rect x="40" y="50" width="160" height="60" fill={roof} /><rect x="40" y="112" width="160" height="60" fill={roof} opacity="0.8" />
  {:else}
    <rect x="60" y="55" width="120" height="120" fill={wall} /><circle cx="80" cy="75" r="3" fill={bg} /><circle cx="160" cy="155" r="3" fill={bg} />
  {/if}
</svg>
