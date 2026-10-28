<script lang="ts">
import { Button, Card } from '@rokkit/ui';
import { InputField } from '@rokkit/forms';
import StepScreen from '$lib/components/StepScreen.svelte';
import LayeredScene from '$lib/components/illustrations/LayeredScene.svelte';
import LayerSwatch from '$lib/components/illustrations/LayerSwatch.svelte';
import { copy, devices, guide } from '$lib/content/layers';
import { useApp } from '$lib/state/context';
import { stepContext } from '$lib/state/step-context.svelte';
// D6 · Output + device (studio) · 07 · Stack & cut (phone)
const app = useApp();
const f = app.layers;
$effect(() => app.setScreen(app.title, `${copy.output.sub} · ${f.layers.length} sheets`));
const ctx = stepContext(app, 'Output', output);
const rows = $derived<[string, string][]>([['Format', f.currentDevice.format], ['Settings', f.currentDevice.settings], ['Time', f.currentDevice.time]]);
const pad = (n: number) => String(n).padStart(2, '0');
const sheet = $derived(f.set === 'paper' ? '12 × 12 in cardstock' : '300 × 300 mm birch');
</script>
{#snippet output()}
  <div class="flex flex-col gap-3">
    <InputField type="radio" name="device" label="Send to" options={devices} value={f.currentDevice} onchange={(d: any) => f.setDevice(d.id)} />
    <Card><dl class="divide-y divide-paper-edge -my-1">{#each rows as [k, v] (k)}<div class="flex justify-between gap-3 min-h-11 items-center"><dt>{k}</dt><dd class="readout text-ink text-right">{v}</dd></div>{/each}</dl></Card>
    <p class="eyebrow mt-1">Assembly</p>
    <ol class="list-decimal pl-5 text-ui text-ink-mute flex flex-col gap-1">{#each copy.output.assembly as a (a)}<li>{a}</li>{/each}</ol>
  </div>
{/snippet}
{#snippet actions()}
  <span class="flex-1 grid md:flex-none"><Button style="outline" size="lg" icon="i-solar:download-linear" label={ctx.wide ? 'Download .zip' : copy.output.export} /></span>
  <span class="flex-[1.3] grid md:flex-none"><Button variant="primary" size="lg" label={f.currentDevice.cta} /></span>
{/snippet}
<svelte:head><title>Katachi · Cut</title></svelte:head>
<StepScreen {actions} context={ctx.inline} note={guide.output.text}>
  <div class="md:hidden flex flex-col gap-3">
    <figure class="relative m-0 aspect-[4/3] rounded-lg border border-paper-edge grid-bed p-2">
      <LayeredScene layers={f.layers} mode="stack" label="Exploded stack, back to front" />
      <span class="absolute right-2.5 bottom-2.5 meta rounded-sm bg-paper px-2 py-0.5 border border-paper-edge">Ø 300 · {f.layers.length} × {f.data.mmPerLayer} mm</span>
    </figure>
    <div class="flex gap-1.5 overflow-x-auto" aria-hidden="true">{#each f.layers as l (l.n)}<span class="w-11 h-11 shrink-0 rounded-md bg-paper-mute"><LayeredScene layers={f.layers} mode="layer" selected={l.n} label="" /></span>{/each}</div>
  </div>
  <section aria-label="Sheets" class="lt-md:hidden flex flex-col gap-5">
    <header class="flex items-start justify-between gap-4">
      <div><h2 class="font-heading text-head font-normal tracking-display">{f.layers.length} sheets · {sheet}</h2><p class="text-ui text-ink-mute mt-1">Each sheet has 3 registration holes (accent) so the stack lines up on pins.</p></div>
      <p class="readout text-ink whitespace-nowrap mt-2">mountain-sunset_L01–L{pad(f.layers.length)}</p>
    </header>
    <div class="grid grid-cols-3 lg:grid-cols-4 gap-4">
      {#each f.layers as l (l.n)}
        <div class="rounded-lg border border-paper-edge bg-paper-soft p-3 flex flex-col gap-2.5">
          <div class="relative aspect-square rounded-md bg-paper border border-paper-edge p-4">
            <LayeredScene layers={f.layers} mode="layer" selected={l.n} label={`Sheet ${pad(l.n)}, ${l.name}`} />
            <span class="absolute left-2 top-2 w-2 h-2 rounded-full border border-accent" aria-hidden="true"></span>
            <span class="absolute right-2 top-2 w-2 h-2 rounded-full border border-accent" aria-hidden="true"></span>
            <span class="absolute left-2 bottom-2 w-2 h-2 rounded-full border border-accent" aria-hidden="true"></span>
          </div>
          <p class="flex items-center gap-2 text-ui"><LayerSwatch colour={l.colour} size="sm" /><span class="flex-1">{pad(l.n)} · {l.name}</span><span class="meta">.svg</span></p>
        </div>
      {/each}
    </div>
  </section>
</StepScreen>
