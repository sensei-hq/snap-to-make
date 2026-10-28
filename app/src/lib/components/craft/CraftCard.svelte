<script lang="ts">
import { Button } from '@rokkit/ui';
import type { Layer } from '$lib/content/layers';
import LayeredScene from '../illustrations/LayeredScene.svelte';
// One saved craft in the gallery: thumbnail, name, where it got to, when; Open, and Delete (asks first, inline).
let { name, image = '', progress, updated, finished = false, example = false, fallback, onOpen, onDelete }: {
  name: string; image?: string; progress: { index: number; total: number; label: string }; updated: string; finished?: boolean; example?: boolean;
  fallback: Layer[]; onOpen: () => void; onDelete?: () => void;
} = $props();
let confirming = $state(false);
</script>
<article class="group flex flex-col rounded-lg border border-paper-edge bg-paper-soft overflow-hidden" aria-label={name}>
  <button type="button" class="relative block aspect-[4/3] bg-paper-mute overflow-hidden cursor-pointer" aria-label={`Open ${name}`} onclick={onOpen}>
    {#if image}<img src={image} alt="" class="absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-102" />
    {:else}<span class="absolute inset-[8%]"><LayeredScene layers={fallback} mode="full" label="" /></span>{/if}
    {#if finished}<span class="absolute top-2 left-2 meta rounded-full bg-paper-soft border border-paper-edge px-2 py-0.5 text-success">Finished</span>{/if}
    {#if example}<span class="absolute top-2 right-2 meta rounded-full bg-paper-soft border border-paper-edge px-2 py-0.5">Example</span>{/if}
  </button>
  <div class="flex flex-col gap-2 p-3">
    <h3 class="text-body text-ink font-medium truncate">{name}</h3>
    <div class="flex gap-1" aria-hidden="true">
      {#each Array.from({ length: progress.total }, (_, i) => i) as i (i)}
        <span class="flex-1 h-[3px] rounded-sm {finished || i < progress.index ? 'bg-ink-soft' : i === progress.index ? 'bg-accent' : 'bg-paper-edge'}"></span>
      {/each}
    </div>
    <p class="flex justify-between gap-2"><span class="meta text-ink">{progress.label}</span><span class="meta">{updated}</span></p>
    <div class="flex gap-2 pt-1">
      {#if confirming}
        <span class="flex-1 text-ui text-ink-mute self-center">Delete this craft?</span>
        <Button size="sm" style="ghost" label="Keep" onclick={() => (confirming = false)} />
        <Button size="sm" variant="danger" label="Delete" onclick={() => { confirming = false; onDelete?.(); }} />
      {:else}
        <span class="flex-1 grid"><Button size="sm" style="outline" label={finished ? 'Open' : 'Resume'} iconRight="i-solar:arrow-right-linear" onclick={onOpen} /></span>
        {#if onDelete}<Button size="sm" style="ghost" icon="i-solar:trash-bin-minimalistic-linear" aria-label={`Delete ${name}`} title="Delete" onclick={() => (confirming = true)} />{/if}
      {/if}
    </div>
  </div>
</article>
