<script lang="ts">
import { goto } from '$app/navigation';
import { resolve } from '$app/paths';
import { Button, Card, StatusList, Toggle } from '@rokkit/ui';
import LayeredScene from '$lib/components/illustrations/LayeredScene.svelte';
import { copy } from '$lib/content/layers';
import { useApp } from '$lib/state/context';
const app = useApp();
const f = app.layers;
app.setScreen(f.data.project, copy.cutout.sub);
const views = [{ label: copy.cutout.original, value: 'original' }, { label: copy.cutout.cutout, value: 'cutout' }];
</script>
<svelte:head><title>Katachi · Cutout</title></svelte:head>
<div class="layers-grid">
  <Card><div class="aspect-square grid-bed rounded"><LayeredScene layers={f.layers} mode={f.cutoutView} /></div></Card>
  <div class="flex flex-col gap-4">
    <Toggle options={views} value={f.cutoutView} showLabels onchange={(v) => f.setCutoutView(v as 'original' | 'cutout')} />
    <StatusList items={copy.cutout.checks} />
    <div class="flex gap-2.5">
      <Button style="outline" size="lg" class="flex-1" icon="i-solar:pen-new-square-linear" label={copy.cutout.touch} />
      <Button variant="primary" size="lg" class="flex-1" label={copy.cutout.next} onclick={() => void goto(resolve('/snap/layers/objects'))} />
    </div>
  </div>
</div>
