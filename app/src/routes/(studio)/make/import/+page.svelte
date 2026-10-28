<script lang="ts">
import { goto } from '$app/navigation';
import { resolve } from '$app/paths';
import { Button, Toggle } from '@rokkit/ui';
import StepScreen from '$lib/components/StepScreen.svelte';
import LayeredScene from '$lib/components/illustrations/LayeredScene.svelte';
import { copy, guide, kinds, makeAs, type Kind, type MakeAs } from '$lib/content/layers';
import { useApp } from '$lib/state/context';
// D1 · Import (studio) · 01 · Source (phone): the captured image, what it is, and what to make it as.
// Getting the image in is Capture's job (New → camera or upload).
const app = useApp();
const f = app.layers;
$effect(() => app.setScreen(app.title, copy.import.sub));
const go = () => void goto(resolve(f.currentKind.next as '/make/cutout'));
const kindOptions = kinds.map((k) => ({ label: k.label, value: k.id }));
const makeOptions = makeAs.map((m) => ({ label: m.label, value: m.id }));
const image = $derived(app.project?.image ?? '');
</script>
{#snippet aside()}
  <p class="eyebrow">{copy.import.what}</p>
  <Toggle options={kindOptions} value={f.kind} label={copy.import.what} class="chips" onchange={(v) => f.setKind(v as Kind)} />
  <p class="text-ui text-ink-mute">{f.currentKind.hint}</p>
  <p class="eyebrow mt-2">{copy.import.makeAs}</p>
  <Toggle options={makeOptions} value={f.makeAs} label="Make it as" class="chips" onchange={(v) => f.setMakeAs(v as MakeAs)} />
  <p class="lt-md:hidden mt-auto text-ui text-ink-soft">{copy.import.privacy}</p>
{/snippet}
{#snippet actions()}
  <span class="flex-1 grid md:flex-none"><Button target="" href="/make/reference" style="outline" size="lg" label={copy.import.change} /></span>
  <span class="flex-[1.4] grid md:flex-none"><Button variant="primary" size="lg" iconRight="i-solar:arrow-right-linear" label={copy.import.next} onclick={go} /></span>
{/snippet}
<svelte:head><title>Katachi · Import</title></svelte:head>
<StepScreen {aside} {actions} note={guide.import.text}>
  <figure class="relative m-0 w-full max-w-[640px] mx-auto aspect-square md:aspect-auto md:h-full md:max-h-[640px] rounded-lg overflow-hidden border border-paper-edge bg-paper-soft">
    {#if image}<img src={image} alt={`Captured: ${app.title}`} class="absolute inset-0 w-full h-full object-contain" />
    {:else}<LayeredScene layers={f.layers} mode="original" />{/if}
    <figcaption class="absolute inset-x-2.5 bottom-2.5 flex items-center gap-2 rounded-md bg-paper-soft border border-paper-edge px-3 py-2">
      <span class="flex-1 min-w-0 text-ui text-ink truncate">{app.title}</span>
      <a href={resolve('/capture')} class="text-ui">Retake</a>
    </figcaption>
  </figure>
</StepScreen>
