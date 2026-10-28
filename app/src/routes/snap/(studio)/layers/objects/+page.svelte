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
app.setScreen(f.data.project, copy.objects.sub);
const dot: Record<string, string> = { muted: 'bg-ink-soft', warn: 'bg-warning', accent: 'bg-accent', ok: 'bg-success', ink: 'bg-ink' };
</script>
<svelte:head><title>Katachi · Objects</title></svelte:head>
<div class="layers-grid">
  <Card><div class="aspect-square"><LayeredScene layers={f.layers} mode="regions" regions={f.regions} label="Regions found in the image, tinted by kind" /></div></Card>
  <div class="flex flex-col gap-4">
    <ChatThread messages={[{ role: 'katachi', text: copy.objects.agent }]} label="Katachi on the regions" />
    <section aria-label="Regions">
      <Card>
        <ul class="divide-y divide-paper-edge">
          {#each f.regions as r (r.id)}
            <li><label class="flex items-center gap-3 min-h-12 px-3.5 cursor-pointer">
              <span class="w-2 h-2 rounded-full shrink-0 {dot[r.tone]}"></span>
              <span class="flex-1"><span class="block">{r.name}</span><span class="meta">{r.note}</span></span>
              <span class="readout">{r.pct}%</span>
              <InputCheckbox variant="default" name={r.id} value={r.on} onchange={() => f.toggleRegion(r.id)} />
            </label></li>
          {/each}
        </ul>
        {#snippet footer()}<p class="readout text-ink">{f.keptPct}% of the image kept as parts</p>{/snippet}
      </Card>
    </section>
    <Button variant="primary" size="lg" label={copy.objects.next} onclick={() => void goto(resolve('/snap/layers/layers'))} />
  </div>
</div>
