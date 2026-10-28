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
app.setScreen(f.data.project, copy.objects.sub);
app.setInfo('Regions', info);
const dot: Record<string, string> = { muted: 'bg-ink-soft', warn: 'bg-warning', accent: 'bg-accent', ok: 'bg-success', ink: 'bg-ink' };
</script>
{#snippet info()}
  <section aria-label="Regions" class="flex flex-col gap-2">
    <p class="flex justify-between"><span class="eyebrow">Regions</span><span class="readout">{f.kept.length} of {f.regions.length} kept · {f.keptPct}%</span></p>
    <Card>
      <ul class="divide-y divide-paper-edge">
        {#each f.regions as r (r.id)}
          <li><label class="flex items-center gap-3 min-h-12 px-3 cursor-pointer">
            <span class="w-2 h-2 rounded-full shrink-0 {dot[r.tone]}"></span>
            <span class="flex-1"><span class="block">{r.name}</span><span class="meta">{r.pct}% · {r.note}</span></span>
            <InputCheckbox variant="default" name={r.id} value={r.on} onchange={() => f.toggleRegion(r.id)} />
          </label></li>
        {/each}
      </ul>
    </Card>
  </section>
{/snippet}
<svelte:head><title>Katachi · Objects</title></svelte:head>
<LayersWork prev={{ href: '/snap/layers/cutout', label: 'Cutout' }} nextLabel={copy.objects.next} onNext={() => void goto(resolve('/snap/layers/layers'))}>
  <div class="aspect-square max-w-[560px] mx-auto"><LayeredScene layers={f.layers} mode="regions" regions={f.regions} label="Regions found in the image, tinted by kind" /></div>
</LayersWork>
