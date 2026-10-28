<script lang="ts">
import type { Snippet } from 'svelte';
import KatachiNote from './KatachiNote.svelte';
// One image → layers step. Studio (mockups/desktop): left controls · work area on graph paper with its actions
// at the bottom right. Phone (mockups/mobile): work, Katachi's note, controls, context, then the actions docked
// above the icon nav.
let { aside, children, context = null, note = '', actions, label = 'Step controls' }: {
  aside?: Snippet; children: Snippet; context?: Snippet | null; note?: string; actions?: Snippet; label?: string;
} = $props();
</script>
<div class="mx-auto w-full max-w-[480px] flex flex-col gap-3.5 px-4 pt-3 md:max-w-none md:h-full md:flex-row md:gap-0 md:p-0">
  {#if aside}
    <aside aria-label={label} class="order-3 flex flex-col gap-3.5 md:order-none md:w-[300px] md:shrink-0 md:overflow-auto md:p-4 md:bg-paper-soft md:border-r md:border-paper-edge">{@render aside()}</aside>
  {/if}
  <div class="contents md:flex md:flex-1 md:min-w-0 md:flex-col md:grid-bed">
    <div class="order-1 md:order-none md:flex-1 md:min-h-0 md:overflow-auto md:px-8 md:py-6">{@render children()}</div>
    {#if note}<div class="order-2 md:hidden"><KatachiNote text={note} /></div>{/if}
    {#if actions}
      <div class="order-5 sticky bottom-[calc(3.5rem+env(safe-area-inset-bottom))] z-5 -mx-4 px-4 py-3 bg-paper flex gap-2.5 md:order-none md:static md:mx-0 md:bg-transparent md:justify-end md:px-4 md:pb-4 md:pt-0">{@render actions()}</div>
    {/if}
  </div>
  {#if context}<div class="order-4 md:hidden">{@render context()}</div>{/if}
</div>
