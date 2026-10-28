<script lang="ts">
import { resolve } from '$app/paths';
import { goto } from '$app/navigation';
import { Button, Toggle } from '@rokkit/ui';
import CraftCard from '$lib/components/craft/CraftCard.svelte';
import { layerSets } from '$lib/content/layers';
import { useApp } from '$lib/state/context';
// Crafts gallery (docs/design/07 G6): every craft, newest first; filter by in progress / finished; open or delete.
const app = useApp();
type Filter = 'all' | 'draft' | 'finished';
let filter = $state<Filter>('all');
const filters = [{ label: 'All', value: 'all' }, { label: 'In progress', value: 'draft' }, { label: 'Finished', value: 'finished' }];
const shown = $derived(app.projects.filter((p) => filter === 'all' || (filter === 'finished') === (p.status === 'finished')));
const finishedCount = $derived(app.projects.filter((p) => p.status === 'finished').length);
$effect(() => app.setScreen('Crafts', `${app.projects.length} saved · ${finishedCount} finished`));
const go = (path: string) => void goto(resolve(path as '/workshop'));
const openCraft = (id: string) => { app.open(id); go(app.resumePath); };
const ago = (t: number) => new Date(t).toLocaleString(undefined, { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
const sample = layerSets.paper.layers;
</script>
<svelte:head><title>Katachi · Crafts</title></svelte:head>
<div class="mx-auto w-full max-w-[1180px] px-4 py-5 md:px-8 md:py-8 flex flex-col gap-5">
  <div class="flex flex-wrap items-center gap-3">
    <Toggle options={filters} value={filter} showLabels label="Show" onchange={(v) => (filter = v as Filter)} />
    <span class="flex-1"></span>
    <Button variant="primary" icon="i-solar:add-circle-linear" label="New craft" onclick={() => go('/workshop')} />
  </div>
  {#if shown.length}
    <div class="grid gap-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {#each shown as p (p.id)}
        {@const pr = app.progressOf(p)}
        <CraftCard name={p.name} image={p.image} progress={pr} finished={pr.finished} example={p.example} updated={ago(p.updatedAt)} fallback={sample}
          onOpen={() => openCraft(p.id)} onDelete={() => app.removeCraft(p.id)} />
      {/each}
    </div>
  {:else}
    <section aria-label="No crafts" class="rounded-lg border border-dashed border-paper-edge p-8 flex flex-col items-center gap-3 text-center">
      <span class="i-solar:layers-linear text-head text-ink-soft" aria-hidden="true"></span>
      <h2 class="panel-title">{filter === 'all' ? 'No crafts yet' : filter === 'finished' ? 'Nothing finished yet' : 'Nothing in progress'}</h2>
      <p class="text-ui text-ink-mute max-w-[44ch]">A craft is saved as soon as you capture its picture and keeps its layers, sheets, assembly steps and your notes to Katachi.</p>
      <div class="flex gap-2.5">
        <Button variant="primary" label="Start a craft" onclick={() => go('/workshop')} />
        {#if !app.projects.some((p) => p.example)}<Button style="outline" label="Open the example" onclick={() => { app.openExample(); go(app.resumePath); }} />{/if}
      </div>
    </section>
  {/if}
</div>
