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
import { StatusList, Toggle } from '@rokkit/ui';
import { copy } from '$lib/content/layers';
app.setScreen(f.data.project, copy.cutout.sub);
app.setInfo('Checks', info);
const views = [{ label: copy.cutout.cutout, value: 'cutout' }, { label: copy.cutout.original, value: 'original' }];
</script>
{#snippet info()}<StatusList items={copy.cutout.checks} />{/snippet}
<svelte:head><title>Katachi · Cutout</title></svelte:head>
<LayersWork prev={{ href: '/snap/layers/source', label: 'Source' }} nextLabel={copy.cutout.next} onNext={() => void goto(resolve('/snap/layers/objects'))}>
  <div class="flex justify-center mb-3"><Toggle options={views} value={f.cutoutView} showLabels label="View" onchange={(v) => f.setCutoutView(v as 'original' | 'cutout')} /></div>
  <div class="aspect-square max-w-[560px] mx-auto"><LayeredScene layers={f.layers} mode={f.cutoutView} /></div>
</LayersWork>
