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
import { InputField } from '@rokkit/forms';
import { copy, kinds } from '$lib/content/layers';
app.setScreen(copy.source.title, copy.source.sub);
app.setInfo('Source', info);
</script>
{#snippet info()}
  <div class="flex flex-col gap-3">
    <p class="flex justify-between"><span class="readout text-ink">{copy.source.file}</span><span class="meta">{copy.source.fileMeta}</span></p>
    <InputField type="radio" name="kind" label={copy.source.what} options={kinds} value={f.currentKind} onchange={(k: any) => f.setKind(k.id)} />
    <p class="text-ui text-ink-mute">{f.currentKind.hint}</p>
  </div>
{/snippet}
<svelte:head><title>Katachi · New from an image</title></svelte:head>
<LayersWork nextLabel={copy.source.next} onNext={() => void goto(resolve(f.currentKind.next as '/snap/layers/cutout'))}>
  <div class="aspect-square max-w-[560px] mx-auto"><LayeredScene layers={f.layers} mode="original" /></div>
</LayersWork>
