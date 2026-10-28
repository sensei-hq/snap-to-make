<script lang="ts">
import { onDestroy } from 'svelte';
import LayersWork from '$lib/components/LayersWork.svelte';
import LayeredScene from '$lib/components/illustrations/LayeredScene.svelte';
import { useApp } from '$lib/state/context';
const app = useApp();
const f = app.layers;
onDestroy(() => app.clearInfo(info));
import { Button, Card, Timeline } from '@rokkit/ui';
import { InputField } from '@rokkit/forms';
import { copy, devices } from '$lib/content/layers';
app.setScreen(f.data.project, copy.cut.sub);
app.setInfo('Output', info);
const rows = $derived<[string, string][]>([['Cut files', `${f.layers.length} × ${f.currentDevice.format}`], ...copy.cut.rows, ['Settings', f.currentDevice.settings], ['Cut time', f.currentDevice.time]]);
</script>
{#snippet info()}
  <div class="flex flex-col gap-3">
    <InputField type="radio" name="device" label="Send to" options={devices} value={f.currentDevice} onchange={(d: any) => f.setDevice(d.id)} />
    <Card><dl class="divide-y divide-paper-edge">{#each rows as [k, v] (k)}<div class="flex justify-between gap-3 min-h-10 items-center px-3"><dt>{k}</dt><dd class="readout text-right">{v}</dd></div>{/each}</dl></Card>
    <Timeline items={copy.cut.assembly.map((label) => ({ label }))} />
    {#if f.currentDevice.id !== 'file'}<Button style="outline" icon="i-solar:download-linear" label={copy.cut.export} />{/if}
  </div>
{/snippet}
<svelte:head><title>Katachi · Cut</title></svelte:head>
<LayersWork prev={{ href: '/snap/layers/material', label: 'Material' }} nextLabel={f.currentDevice.cta} onNext={() => {}}>
  <div class="aspect-square max-w-[520px] mx-auto"><LayeredScene layers={f.layers} mode="stack" label="Exploded stack, back to front" /></div>
  <p class="meta text-center mt-2">{f.data.headline} · {f.data.spacer}</p>
</LayersWork>
