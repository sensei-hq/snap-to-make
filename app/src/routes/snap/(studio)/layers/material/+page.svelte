<script lang="ts">
import { goto } from '$app/navigation';
import { resolve } from '$app/paths';
import { onDestroy } from 'svelte';
import LayersWork from '$lib/components/LayersWork.svelte';
import LayeredScene from '$lib/components/illustrations/LayeredScene.svelte';
import { useApp } from '$lib/state/context';
const app = useApp();
const f = app.layers;
onDestroy(() => app.clearInfo(info));
import { Card, Toggle } from '@rokkit/ui';
import LayerSwatch from '$lib/components/illustrations/LayerSwatch.svelte';
import { copy, layerSets } from '$lib/content/layers';
app.setScreen(f.data.project, copy.material.sub);
app.setInfo('Materials', info);
const sets = Object.entries(layerSets).map(([value, s]) => ({ label: s.label, value }));
</script>
{#snippet info()}
  <section aria-label="Materials" class="flex flex-col gap-3">
    <Toggle options={sets} value={f.set} showLabels label="Set" onchange={(v) => f.setSet(v as 'paper' | 'wood')} />
    <Card>
      <ul class="divide-y divide-paper-edge">
        {#each f.layers as l (l.n)}<li class="flex items-center gap-3 min-h-11 px-3"><LayerSwatch colour={l.colour} /><span class="flex-1">{l.n} · {l.name}</span><span class="meta text-right">{l.material}</span></li>{/each}
      </ul>
    </Card>
    <p class="meta">{f.data.device}</p>
  </section>
{/snippet}
<svelte:head><title>Katachi · Material</title></svelte:head>
<LayersWork prev={{ href: '/snap/layers/gaps', label: 'Gaps' }} nextLabel={copy.material.next} onNext={() => void goto(resolve('/snap/layers/cut'))}>
  <div class="aspect-square max-w-[560px] mx-auto"><LayeredScene layers={f.layers} mode="full" /></div>
</LayersWork>
