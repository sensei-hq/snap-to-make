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
import { Button } from '@rokkit/ui';
import { InputCheckbox, InputField } from '@rokkit/forms';
import { copy, gapChoices, gapRules } from '$lib/content/layers';
app.setScreen(f.data.project, copy.gaps.sub);
app.setInfo('Gap rule', info);
</script>
{#snippet info()}
  <div class="flex flex-col gap-3">
    <InputField type="radio" name="rule" label={copy.gaps.rule} options={gapRules} value={gapRules.find((r) => r.id === f.gapRule)} onchange={(r: any) => f.setGapRule(r.id)} />
    <p class="readout">material ≈ {f.materialPct}% of {f.layers.length} full sheets</p>
    <InputField type="radio" name="gap" label="Fill the hidden area" options={gapChoices} value={f.currentGap} onchange={(g: any) => f.setGapChoice(g.id)} />
    <p class="text-ui text-ink-mute">{f.currentGap.hint}{f.currentGap.tag ? ` · ${f.currentGap.tag}` : ''}</p>
    <label class="flex items-center gap-3 cursor-pointer"><InputCheckbox variant="default" name="apply-all" value={f.applyAll} onchange={() => f.toggleApplyAll()} /><span>{copy.gaps.all}</span></label>
  </div>
{/snippet}
<svelte:head><title>Katachi · Gaps</title></svelte:head>
<LayersWork prev={{ href: '/snap/layers/layers', label: 'Layers' }} nextLabel={copy.gaps.next} onNext={() => void goto(resolve('/snap/layers/material'))}>
  <section aria-label="Gap review" class="grid grid-cols-2 md:grid-cols-3 gap-3">
    {#each f.gapCards as c (c.n)}
      <div class="rounded-lg border border-paper-edge bg-paper-soft p-2 flex flex-col gap-2">
        <div class="aspect-square"><LayeredScene layers={f.layers} mode="layer" selected={c.n} label={`L${c.n} ${c.name}, ${c.solid ? 'solid' : 'open'}`} /></div>
        <div class="flex items-center justify-between gap-2"><span class="text-ui">L{c.n} {c.name}</span>
          <Button size="sm" style={c.solid ? 'default' : 'outline'} variant={c.solid ? 'primary' : 'default'} aria-pressed={c.solid} label={c.solid ? 'solid' : 'open'} aria-label={`L${c.n} ${c.name}: ${c.solid ? 'solid' : 'open'}`} onclick={() => f.toggleSolid(c.n)} /></div>
      </div>
    {/each}
  </section>
</LayersWork>
