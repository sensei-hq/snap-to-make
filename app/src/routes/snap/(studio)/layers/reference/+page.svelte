<script lang="ts">
import { goto } from '$app/navigation';
import { resolve } from '$app/paths';
import { Button, Card } from '@rokkit/ui';
import { InputCheckbox } from '@rokkit/forms';
import ChatThread from '$lib/components/ChatThread.svelte';
import LayeredScene from '$lib/components/illustrations/LayeredScene.svelte';
import { copy } from '$lib/content/layers';
import { useApp } from '$lib/state/context';
const app = useApp();
const f = app.layers;
app.setScreen(copy.reference.title, copy.reference.sub);
</script>
<svelte:head><title>Katachi · Reference + changes</title></svelte:head>
<div class="layers-grid">
  <Card><div class="aspect-square"><LayeredScene layers={f.layers} mode="full" label="The reference: layered mountain sunset" /></div></Card>
  <div class="flex flex-col gap-4">
    <ChatThread messages={[{ role: 'user', text: copy.reference.ask }, { role: 'katachi', text: copy.reference.reply }]} label="Your changes" />
    <section aria-label="Changes">
      <Card>
        <ul class="divide-y divide-paper-edge">
          {#each f.changes as c (c.n)}
            <li><label class="flex items-center gap-3 min-h-12 px-3.5 cursor-pointer"><span class="flex-1"><span class="block">{c.label}</span><span class="meta">{c.where}</span></span><InputCheckbox variant="default" name={`change-${c.n}`} value={c.on} onchange={() => f.toggleChange(c.n)} /></label></li>
          {/each}
        </ul>
        {#snippet footer()}<p class="readout text-ink">{f.activeChanges} of {f.changes.length} changes on</p>{/snippet}
      </Card>
    </section>
    <Button variant="primary" size="lg" label={copy.reference.next} onclick={() => void goto(resolve('/snap/layers/layers'))} />
  </div>
</div>
