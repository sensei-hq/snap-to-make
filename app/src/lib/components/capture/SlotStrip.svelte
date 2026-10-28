<script lang="ts">
import { Button, Toggle } from '@rokkit/ui';
import type { Slot } from '$lib/state/capture.svelte';
// Thumbnails of the captured images (or empty slots); choosing one shows it full size. Captured slots can be retaken.
let { slots, selected, currentId = null, onSelect, onRetake }: {
  slots: Slot[]; selected: string | null; currentId?: string | null; onSelect: (id: Slot['id']) => void; onRetake: (id: Slot['id']) => void;
} = $props();
const options = $derived(slots.map((s) => ({ label: s.label, value: s.id, url: s.url ?? '' })));
</script>
<div class="flex flex-col gap-1.5">
  <Toggle {options} value={selected ?? currentId ?? ''} label="Captured images" showLabels onchange={(v) => onSelect(v as Slot['id'])}>
    {#snippet item(proxy)}
      <span class="flex flex-col items-center gap-1 py-1">
        {#if proxy.get('url')}<img src={String(proxy.get('url'))} alt="" class="w-14 h-10 object-cover rounded-sm" />
        {:else}<span class="w-14 h-10 rounded-sm border border-dashed {proxy.value === currentId ? 'border-accent' : 'border-paper-edge'}"></span>{/if}
        <span class="meta">{proxy.label}</span>
      </span>
    {/snippet}
  </Toggle>
  <div class="flex flex-wrap gap-1">
    {#each slots.filter((s) => s.url) as s (s.id)}
      <Button style="ghost" size="sm" icon="i-solar:refresh-linear" label={s.label} aria-label={`Retake ${s.label.toLowerCase()}`} onclick={() => onRetake(s.id)} />
    {/each}
  </div>
</div>
