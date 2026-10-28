<script lang="ts">
import { goto } from '$app/navigation';
import { resolve } from '$app/paths';
import { Button, Card, Toggle } from '@rokkit/ui';
import LayeredScene from '$lib/components/illustrations/LayeredScene.svelte';
import LayerSwatch from '$lib/components/illustrations/LayerSwatch.svelte';
import { copy, layerSets } from '$lib/content/layers';
import { useApp } from '$lib/state/context';
const app = useApp();
const f = app.layers;
app.setScreen(f.data.project, copy.material.sub);
const sets = Object.entries(layerSets).map(([value, s]) => ({ label: s.label, value }));
</script>
<svelte:head><title>Katachi · Material</title></svelte:head>
<div class="layers-grid">
  <Card><div class="aspect-square"><LayeredScene layers={f.layers} mode="full" /></div></Card>
  <div class="flex flex-col gap-4">
    <Toggle options={sets} value={f.set} showLabels onchange={(v) => f.setSet(v as 'paper' | 'wood')} />
    <section aria-label="Materials">
      <Card>
        <ul class="divide-y divide-paper-edge">
          {#each f.layers as l (l.n)}<li class="flex items-center gap-3 min-h-11 px-3.5"><LayerSwatch colour={l.colour} /><span class="flex-1">{l.n} · {l.name}</span><span class="meta text-right">{l.material}</span></li>{/each}
        </ul>
        {#snippet footer()}<p class="meta">{f.data.device}</p>{/snippet}
      </Card>
    </section>
    <Button variant="primary" size="lg" label={copy.material.next} onclick={() => void goto(resolve('/snap/layers/cut'))} />
  </div>
</div>
