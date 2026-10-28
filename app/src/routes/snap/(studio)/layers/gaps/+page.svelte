<script lang="ts">
import { goto } from '$app/navigation';
import { resolve } from '$app/paths';
import { Button, Card } from '@rokkit/ui';
import { InputCheckbox, InputField } from '@rokkit/forms';
import ChatThread from '$lib/components/ChatThread.svelte';
import LayeredScene from '$lib/components/illustrations/LayeredScene.svelte';
import { copy, gapChoices, gapRules } from '$lib/content/layers';
import { useApp } from '$lib/state/context';
const app = useApp();
const f = app.layers;
app.setScreen(f.data.project, copy.gaps.sub);
</script>
<svelte:head><title>Katachi · Gaps</title></svelte:head>
<div class="layers-grid">
  <div class="flex flex-col gap-4">
    <Card><div class="aspect-square"><LayeredScene layers={f.layers} mode="layer" selected={f.selected.n} label="Hidden area of the selected layer, hatched" /></div></Card>
    <section aria-label="Gap review" class="lt-md:hidden">
      <p class="eyebrow mb-2">{copy.gaps.rule} · material ≈ {f.materialPct}%</p>
      <div class="grid grid-cols-3 gap-2">
        {#each f.gapCards as c (c.n)}
          <Button style={c.solid ? 'default' : 'outline'} variant={c.solid ? 'primary' : 'default'} aria-pressed={c.solid}
            label={`${c.n} · ${c.name} · ${c.solid ? 'solid' : 'open'}`} onclick={() => f.toggleSolid(c.n)} />
        {/each}
      </div>
    </section>
  </div>
  <div class="flex flex-col gap-4">
    <ChatThread messages={[{ role: 'katachi', text: copy.gaps.agent }]} label="Katachi on hidden areas" />
    <InputField type="radio" name="gap" label="Fill the hidden area" options={gapChoices} value={f.currentGap} onchange={(g: any) => f.setGapChoice(g.id)} />
    <p class="text-ui text-ink-mute">{f.currentGap.hint}{f.currentGap.tag ? ` · ${f.currentGap.tag}` : ''}</p>
    <label class="flex items-center gap-3 cursor-pointer"><InputCheckbox variant="default" name="apply-all" value={f.applyAll} onchange={() => f.toggleApplyAll()} /><span>{copy.gaps.all}</span></label>
    <div class="lt-md:hidden"><InputField type="radio" name="rule" label={copy.gaps.rule} options={gapRules} value={gapRules.find((r) => r.id === f.gapRule)} onchange={(r: any) => f.setGapRule(r.id)} /></div>
    <Button variant="primary" size="lg" label={copy.gaps.next} onclick={() => void goto(resolve('/snap/layers/material'))} />
  </div>
</div>
