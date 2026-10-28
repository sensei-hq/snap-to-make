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
import { Card } from '@rokkit/ui';
import { InputCheckbox } from '@rokkit/forms';
import { copy } from '$lib/content/layers';
app.setScreen(copy.reference.title, copy.reference.sub);
app.setInfo('Changes', info);
</script>
{#snippet info()}
  <section aria-label="Changes" class="flex flex-col gap-2">
    <p class="text-ui text-ink-mute">“{copy.reference.ask}”</p>
    <Card>
      <ul class="divide-y divide-paper-edge">
        {#each f.changes as c (c.n)}
          <li><label class="flex items-center gap-3 min-h-12 px-3 cursor-pointer"><span class="flex-1"><span class="block">{c.label}</span><span class="meta">{c.where}</span></span><InputCheckbox variant="default" name={`change-${c.n}`} value={c.on} onchange={() => f.toggleChange(c.n)} /></label></li>
        {/each}
      </ul>
    </Card>
    <p class="readout text-ink">{f.activeChanges} of {f.changes.length} changes on</p>
  </section>
{/snippet}
<svelte:head><title>Katachi · Reference + changes</title></svelte:head>
<LayersWork prev={{ href: '/snap/layers/source', label: 'Source' }} nextLabel={copy.reference.next} onNext={() => void goto(resolve('/snap/layers/layers'))}>
  <div class="aspect-square max-w-[560px] mx-auto"><LayeredScene layers={f.layers} mode="full" label="The reference: layered mountain sunset" /></div>
</LayersWork>
