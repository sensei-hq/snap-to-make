<script lang="ts">
import { goto } from '$app/navigation';
import { resolve } from '$app/paths';
import { Button, Card, List, Toggle } from '@rokkit/ui';
import StepScreen from '$lib/components/StepScreen.svelte';
import LayeredScene from '$lib/components/illustrations/LayeredScene.svelte';
import { copy, guide, kinds, layerSets, makeAs, sources, type MakeAs, type SourceId } from '$lib/content/layers';
import { useApp } from '$lib/state/context';
import { stepContext } from '$lib/state/step-context.svelte';
// D1 · Import (studio) · 01 · Source (phone)
const app = useApp();
const f = app.layers;
app.setScreen(copy.import.title, copy.import.sub);
const ctx = stepContext(app, 'Send from phone', phone);
const go = () => void goto(resolve(f.currentKind.next as '/make/cutout'));
const kindOptions = kinds.map((k) => ({ label: k.label, value: k.id }));
const makeOptions = makeAs.map((m) => ({ label: m.label, value: m.id }));
const sourceItems = sources.map((s) => ({ label: s.label, value: s.id, hint: s.hint }));
</script>
{#snippet phone()}
  <Card>
    <div class="flex items-center gap-4">
      <span class="i-solar:qr-code-linear text-[56px] shrink-0 text-ink" aria-hidden="true"></span>
      <span><span class="block text-body text-ink">{copy.import.phone}</span><span class="block text-ui text-ink-mute">{copy.import.phoneHint}</span></span>
    </div>
  </Card>
{/snippet}
{#snippet aside()}
  <p class="eyebrow">{copy.import.startFrom}</p>
  <Card class="overflow-hidden">
    <List items={sourceItems} value={f.source} label="Start from" onselect={(v) => f.setSource(v as SourceId)}>
      {#snippet itemContent(proxy)}<span class="flex flex-col items-start text-left py-1.5"><span class="text-body text-ink">{proxy.label}</span><span class="text-ui text-ink-mute">{proxy.get('hint')}</span></span>{/snippet}
    </List>
  </Card>
  <p class="eyebrow mt-2">{copy.import.makeAs}</p>
  <Toggle options={makeOptions} value={f.makeAs} label="Make it as" class="chips" onchange={(v) => f.setMakeAs(v as MakeAs)} />
  <p class="lt-md:hidden mt-auto text-ui text-ink-soft">{copy.import.privacy}</p>
{/snippet}
{#snippet actions()}
  <span class="md:hidden contents">
    <span class="flex-1 grid"><Button target="" href="/make/reference" style="outline" size="lg" label={copy.import.change} /></span>
    <span class="flex-[1.4] grid"><Button variant="primary" size="lg" label={copy.import.next} onclick={go} /></span>
  </span>
{/snippet}
<svelte:head><title>Katachi · New from an image</title></svelte:head>
<StepScreen aside={ctx.wide ? aside : phoneAside} note={guide.import.text} {actions}>
  <!-- phone: camera | upload, the picked image, what is it -->
  <div class="md:hidden flex flex-col gap-3">
    <Toggle options={[{ label: 'Camera', value: 'camera', icon: 'i-solar:camera-linear' }, { label: 'Upload', value: 'upload', icon: 'i-solar:gallery-linear' }]} value="upload" label="Source" class="seg" onchange={(v) => { if (v === 'camera') void goto(resolve('/capture')); }} />
    <figure class="relative m-0 aspect-[4/3.3] rounded-lg overflow-hidden border border-paper-edge">
      <LayeredScene layers={f.layers} mode="original" />
      <figcaption class="absolute inset-x-2.5 bottom-2.5 flex items-center gap-2 rounded-md bg-paper-soft border border-paper-edge px-3 py-2">
        <span class="flex-1 min-w-0"><span class="block text-ui text-ink truncate">{copy.import.file}</span><span class="meta">{copy.import.fileMeta}</span></span>
        <Button target="" href="/capture" size="sm" style="ghost" label="Replace" />
      </figcaption>
    </figure>
  </div>
  <!-- studio: the drop card with this file and a recent one -->
  <section aria-label="Drop an image" class="lt-md:hidden h-full grid place-items-center">
    <div class="w-full max-w-[1110px] rounded-xl border border-paper-edge bg-paper p-2">
      <div class="rounded-lg border-2 border-dashed border-paper-edge px-8 py-10 flex flex-col items-center gap-3 text-center">
        <h2 class="font-heading text-head font-normal tracking-display">{copy.import.drop}</h2>
        <p class="text-body text-ink-mute">{copy.import.dropHint}</p>
        <div class="grid grid-cols-2 gap-5 mt-4 w-full max-w-[720px]">
          <figure class="m-0 flex flex-col gap-2 text-left">
            <span class="aspect-square rounded-lg overflow-hidden ring-2 ring-accent"><LayeredScene layers={f.layers} mode="original" /></span>
            <figcaption class="meta text-ink">{copy.import.file} · uploading 100%</figcaption>
          </figure>
          <figure class="m-0 flex flex-col gap-2 text-left">
            <span class="aspect-square rounded-lg overflow-hidden border border-paper-edge"><LayeredScene layers={layerSets.wood.layers} mode="full" label="Recent: the wood version" /></span>
            <figcaption class="meta">{copy.import.recent} · recent</figcaption>
          </figure>
        </div>
        <div class="flex gap-3 mt-4">
          <Button target="" href="/capture" style="outline" label="Browse files" />
          <Button variant="primary" label={`Continue with ${copy.import.file.replace(/\.png$/, '')}`} onclick={go} />
        </div>
      </div>
    </div>
  </section>
</StepScreen>
{#snippet phoneAside()}
  <p class="eyebrow">{copy.import.what}</p>
  <Toggle options={kindOptions} value={f.kind} label={copy.import.what} class="chips" onchange={(v) => f.setKind(v as never)} />
  <p class="text-ui text-ink-mute">{f.currentKind.hint}</p>
{/snippet}
