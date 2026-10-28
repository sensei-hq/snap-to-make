<script lang="ts">
import { goto } from '$app/navigation';
import { resolve } from '$app/paths';
import { Button, Card, Toggle } from '@rokkit/ui';
import StepScreen from '$lib/components/StepScreen.svelte';
import LayeredScene from '$lib/components/illustrations/LayeredScene.svelte';
import LayerSwatch from '$lib/components/illustrations/LayerSwatch.svelte';
import { copy, guide, layerSets, type LayerSetId } from '$lib/content/layers';
import { useApp } from '$lib/state/context';
// 06 · Material per layer (phone); in the studio it is the second half of Layers
const app = useApp();
const f = app.layers;
$effect(() => app.setScreen(f.data.project, copy.material.sub));
const sets = Object.entries(layerSets).map(([value, s]) => ({ label: s.label, value }));
</script>
{#snippet aside()}
  <Toggle options={sets} value={f.set} label="Set" class="seg" onchange={(v) => f.setSet(v as LayerSetId)} />
  <section aria-label="Materials">
    <Card>
      <ul class="divide-y divide-paper-edge -my-1">
        {#each f.layers as l (l.n)}<li class="flex items-center gap-3 min-h-11"><span class="meta w-4">{l.n}</span><LayerSwatch colour={l.colour} /><span class="flex-1 truncate">{l.name}</span><span class="text-ui text-ink-mute text-right">{l.material}</span></li>{/each}
      </ul>
    </Card>
  </section>
  <Card><div class="flex items-center gap-3"><span class="flex-1 text-ui">{f.data.spacer}</span><Button size="sm" style="ghost" class="rounded-full" label="Change" /></div></Card>
{/snippet}
{#snippet actions()}
  <span class="flex-1 grid md:flex-none"><Button target="" href="/snap/materials" style="outline" size="lg" label="My supplies" /></span>
  <span class="flex-[1.3] grid md:flex-none"><Button variant="primary" size="lg" iconRight="i-solar:arrow-right-linear" label={copy.material.next} onclick={() => void goto(resolve('/snap/layers/cut'))} /></span>
{/snippet}
<svelte:head><title>Katachi · Material</title></svelte:head>
<StepScreen {aside} {actions} note={guide.material.text}>
  <div class="flex flex-col gap-4 md:h-full md:items-center md:justify-center">
    <div class="flex items-center gap-3 md:max-w-[560px]">
      <span class="w-20 h-20 md:w-24 md:h-24 shrink-0 rounded-md overflow-hidden"><LayeredScene layers={f.layers} mode="full" label={`${f.data.project}, ${f.data.label.toLowerCase()}`} /></span>
      <span><span class="block font-heading text-lede md:text-title">{f.data.headline}</span><span class="text-ui text-ink-mute">{f.data.device}</span></span>
    </div>
    <div class="lt-md:hidden w-full max-w-[520px] aspect-square"><LayeredScene layers={f.layers} mode="stack" label="Exploded stack, back to front" /></div>
  </div>
</StepScreen>
