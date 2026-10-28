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
$effect(() => app.setScreen(f.data.project, `${copy.layers.sub} · ${f.layers.length} layers`));
app.setInfo('Layer', info);
const sets = Object.entries(layerSets).map(([value, s]) => ({ label: s.label, value }));
const options = $derived(f.layers.map((l) => ({ label: `${l.n} · ${l.name}`, value: l.n })));
</script>
{#snippet info()}
  <div class="flex flex-col gap-3">
    <Toggle options={sets} value={f.set} showLabels label="Set" onchange={(v) => f.setSet(v as 'paper' | 'wood')} />
    <p class="eyebrow">Layer {f.selected.n}</p>
    <h2 class="panel-title">{f.selected.name}</h2>
    <Card>
      <dl class="divide-y divide-paper-edge">
        <div class="flex justify-between items-center min-h-10 px-3"><dt>Colour</dt><dd class="flex items-center gap-2"><LayerSwatch colour={f.selected.colour} size="sm" /><span class="readout">{f.selected.colour}</span></dd></div>
        <div class="flex justify-between items-center min-h-10 px-3"><dt>Shows</dt><dd class="readout">{f.selected.visiblePct}%</dd></div>
        <div class="flex justify-between items-center min-h-10 px-3"><dt>Hidden</dt><dd class="readout">{f.selected.hiddenPct}%</dd></div>
        <div class="flex justify-between items-center min-h-10 px-3"><dt>Material</dt><dd class="text-ui">{f.selected.material}</dd></div>
      </dl>
    </Card>
    {#if f.selected.flag}<p class="text-ui text-warning-ink">{f.selected.flag}</p>{/if}
    <p class="meta">Depth {f.selected.n} of {f.layers.length} · {f.depthMm} mm from the back</p>
  </div>
{/snippet}
<svelte:head><title>Katachi · Layers</title></svelte:head>
<LayersWork prev={{ href: '/snap/layers/objects', label: 'Objects' }} nextLabel={copy.layers.next} onNext={() => void goto(resolve('/snap/layers/gaps'))}>
  <div class="aspect-square max-w-[520px] mx-auto"><LayeredScene layers={f.layers} mode="layer" selected={f.selected.n} label={`Layer ${f.selected.n}, ${f.selected.name}: visible area solid, hidden area hatched`} /></div>
  {#snippet strip()}
    <section aria-label="Layer stack" class="overflow-x-auto">
      <Toggle {options} value={f.selected.n} label="Layers, back to front" onchange={(v) => f.selectLayer(Number(v))}>
        {#snippet item(proxy)}
          <span class="flex flex-col items-center gap-1 py-1 w-20"><span class="w-14 h-14"><LayeredScene layers={f.layers} mode="layer" selected={Number(proxy.value)} label={proxy.label} /></span><span class="meta truncate max-w-full">{proxy.label}</span></span>
        {/snippet}
      </Toggle>
    </section>
  {/snippet}
</LayersWork>
