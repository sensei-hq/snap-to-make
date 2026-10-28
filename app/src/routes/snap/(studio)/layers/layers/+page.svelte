<script lang="ts">
import { goto } from '$app/navigation';
import { resolve } from '$app/paths';
import { Button, Card, List, Toggle } from '@rokkit/ui';
import LayeredScene from '$lib/components/illustrations/LayeredScene.svelte';
import LayerSwatch from '$lib/components/illustrations/LayerSwatch.svelte';
import { copy, layerSets } from '$lib/content/layers';
import { useApp } from '$lib/state/context';
const app = useApp();
const f = app.layers;
$effect(() => app.setScreen(f.data.project, `${copy.layers.sub} · ${f.layers.length} layers`));
const sets = Object.entries(layerSets).map(([value, s]) => ({ label: s.label, value }));
const items = $derived(f.layers.map((l) => ({ label: `${l.n} · ${l.name}`, value: l.n, colour: l.colour, visible: l.visiblePct, hidden: l.hiddenPct, flag: l.flag })));
</script>
<svelte:head><title>Katachi · Layers</title></svelte:head>
<div class="layers-grid">
  <Card>
    <div class="aspect-square"><LayeredScene layers={f.layers} mode="layer" selected={f.selected.n} label={`Layer ${f.selected.n}, ${f.selected.name}: visible area solid, hidden area hatched`} /></div>
    {#snippet footer()}<p class="flex justify-between"><span>{f.selected.name}</span><span class="readout">{f.selected.visiblePct}% visible · {f.selected.hiddenPct}% hidden · depth {f.depthMm} mm</span></p>{/snippet}
  </Card>
  <div class="flex flex-col gap-4">
    <Toggle options={sets} value={f.set} showLabels onchange={(v) => f.setSet(v as 'paper' | 'wood')} />
    <p class="eyebrow">{copy.layers.order}</p>
    <section aria-label="Layer stack">
      <Card>
        <List {items} value={f.selected.n} onselect={(v) => f.selectLayer(Number(typeof v === 'object' && v ? (v as { value: number }).value : v))}>
          {#snippet itemContent(proxy)}<LayerSwatch colour={String(proxy.get('colour'))} /><span class="flex-1">{proxy.label}</span><span class="meta">{proxy.get('visible')}% visible</span>{/snippet}
        </List>
      </Card>
    </section>
    {#if f.selected.flag}<p class="text-ui text-warning-ink">{f.selected.flag}</p>{/if}
    <p class="meta">{f.data.headline} · {f.data.spacer}</p>
    <Button variant="primary" size="lg" label={copy.layers.next} onclick={() => void goto(resolve('/snap/layers/gaps'))} />
  </div>
</div>
