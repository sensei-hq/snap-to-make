<script lang="ts">
import type { Snippet } from 'svelte';
// Fills the space it is given (the capture page sizes it to the viewport). The work area's image: one captured image full size, or the live view (children); optional 3×3 guide and the side prompt.
let { url = '', alt = '', prompt = '', showGrid = false, children }: { url?: string; alt?: string; prompt?: string; showGrid?: boolean; children?: Snippet } = $props();
</script>
<div class="relative w-full h-full min-h-[240px] rounded-lg overflow-hidden bg-camera" data-mode="dark">
  {#if url}<img src={url} {alt} class="absolute inset-0 w-full h-full object-contain" />{:else}{@render children?.()}{/if}
  {#if showGrid}
    <div data-testid="grid-guide" aria-hidden="true" class="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none">
      {#each Array(9) as _, i (i)}<span class="border border-ink-faint"></span>{/each}
    </div>
  {/if}
  {#if prompt}<span class="absolute left-3 top-3 inline-flex items-center gap-2 h-8 px-3 rounded-full bg-paper text-ui text-ink"><span class="w-1.5 h-1.5 rounded-full bg-warning"></span>{prompt}</span>{/if}
</div>
