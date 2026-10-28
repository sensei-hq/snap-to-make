<script lang="ts">
import { Button, Card, Timeline } from '@rokkit/ui';
import { InputField } from '@rokkit/forms';
import LayeredScene from '$lib/components/illustrations/LayeredScene.svelte';
import { copy, devices } from '$lib/content/layers';
import { useApp } from '$lib/state/context';
const app = useApp();
const f = app.layers;
app.setScreen(f.data.project, copy.cut.sub);
const rows = $derived<[string, string][]>([['Cut files', `${f.layers.length} × ${f.currentDevice.format}`], ...copy.cut.rows, ['Settings', f.currentDevice.settings], ['Cut time', f.currentDevice.time]]);
</script>
<svelte:head><title>Katachi · Cut</title></svelte:head>
<div class="layers-grid">
  <Card>
    <div class="aspect-square"><LayeredScene layers={f.layers} mode="stack" label="Exploded stack, back to front" /></div>
    {#snippet footer()}<p class="meta">{f.data.headline}</p>{/snippet}
  </Card>
  <div class="flex flex-col gap-4">
    <InputField type="radio" name="device" label="Send to" options={devices} value={f.currentDevice} onchange={(d: any) => f.setDevice(d.id)} />
    <Card>
      <dl class="divide-y divide-paper-edge">{#each rows as [k, v] (k)}<div class="flex justify-between gap-3 min-h-10 items-center px-3.5"><dt>{k}</dt><dd class="readout text-right">{v}</dd></div>{/each}</dl>
      {#snippet footer()}<p class="meta">{f.currentDevice.adapter}{f.currentDevice.status ? ` · ${f.currentDevice.status}` : ''}</p>{/snippet}
    </Card>
    <Timeline items={copy.cut.assembly.map((label) => ({ label }))} />
    <div class="flex gap-2.5">
      {#if f.currentDevice.id !== 'file'}<Button style="outline" size="lg" class="flex-1" icon="i-solar:download-linear" label={copy.cut.export} />{/if}
      <Button variant="primary" size="lg" class="flex-1" label={f.currentDevice.cta} />
    </div>
  </div>
</div>
