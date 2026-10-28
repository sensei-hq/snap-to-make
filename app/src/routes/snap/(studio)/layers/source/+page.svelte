<script lang="ts">
import { goto } from '$app/navigation';
import { resolve } from '$app/paths';
import { Button, Card } from '@rokkit/ui';
import { InputField } from '@rokkit/forms';
import ChatThread from '$lib/components/ChatThread.svelte';
import LayeredScene from '$lib/components/illustrations/LayeredScene.svelte';
import { copy, kinds } from '$lib/content/layers';
import { useApp } from '$lib/state/context';
const app = useApp();
const f = app.layers;
app.setScreen(copy.source.title, copy.source.sub);
</script>
<svelte:head><title>Katachi · New from an image</title></svelte:head>
<div class="layers-grid">
  <Card>
    <div class="aspect-square"><LayeredScene layers={f.layers} mode="original" /></div>
    {#snippet footer()}<p class="flex justify-between"><span class="readout text-ink">{copy.source.file}</span><span class="meta">{copy.source.fileMeta}</span></p>{/snippet}
  </Card>
  <div class="flex flex-col gap-4">
    <ChatThread messages={[{ role: 'katachi', text: copy.source.agent }]} label="Katachi on this image" />
    <InputField type="radio" name="kind" label={copy.source.what} options={kinds} value={f.currentKind} onchange={(k: any) => f.setKind(k.id)} />
    <p class="text-ui text-ink-mute">{f.currentKind.hint}</p>
    <div class="flex gap-2.5">
      <Button style="outline" size="lg" class="flex-1" label={copy.source.change} onclick={() => void goto(resolve('/snap/layers/reference'))} />
      <Button variant="primary" size="lg" class="flex-1" label={copy.source.next} onclick={() => void goto(resolve(f.currentKind.next as '/snap/layers/cutout'))} />
    </div>
  </div>
</div>
