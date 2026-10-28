<script lang="ts">
import { goto } from '$app/navigation';
import { resolve } from '$app/paths';
import { Button, Card, Toggle } from '@rokkit/ui';
import StepScreen from '$lib/components/StepScreen.svelte';
import BirdhouseView from '$lib/components/illustrations/BirdhouseView.svelte';
import { copy, joinery, type Joinery } from '$lib/content/layers';
import { useApp } from '$lib/state/context';
import { stepContext } from '$lib/state/step-context.svelte';
// D5 · 3D object six views (studio) · 08 · six views (phone)
const app = useApp();
const f = app.layers;
$effect(() => app.setScreen(app.title, `${copy.views.sub} · ${f.done.length} of 6 in`));
const ctx = stepContext(app, 'Parts', parts);
const rows = $derived<[string, string, boolean][]>(f.partRows.map((p) => [p.name, p.ok ? p.size : p.missing, p.ok]));
const missing = $derived(f.views.filter((v) => !v.ok).map((v) => v.label.toLowerCase()));
const build = () => void goto(resolve('/make/output'));
const joins = joinery.map((j) => ({ label: j.label, value: j.id }));
</script>
{#snippet parts()}
  <div class="flex flex-col gap-3">
    <p class="eyebrow">Parts · 6 mm ply</p>
    <Card><dl class="divide-y divide-paper-edge -my-1">{#each rows as [k, v, ok] (k)}<div class="flex justify-between gap-3 min-h-11 items-center"><dt>{k}</dt><dd class="readout text-right {ok ? 'text-ink' : 'text-warning-ink'}">{v}</dd></div>{/each}</dl></Card>
    <p class="eyebrow mt-1">Joinery</p>
    <Toggle options={joins} value={f.joinery} label="Joinery" class="chips" onchange={(v) => f.setJoinery(v as Joinery)} />
  </div>
{/snippet}
{#snippet actions()}
  <span class="grid md:hidden"><Button target="" href="/capture" style="outline" size="lg" label="Upload" /></span>
  {#if f.nextView}<span class="flex-1 grid md:hidden"><Button variant="primary" size="lg" icon="i-solar:camera-linear" label={`${copy.views.shutter} · ${f.nextView.label}`} onclick={() => f.shoot()} /></span>{/if}
  <span class="grid {f.nextView ? 'lt-md:hidden' : 'flex-1 md:flex-none'}"><Button variant={f.nextView ? 'default' : 'primary'} style={f.nextView ? 'outline' : 'default'} size="lg" iconRight="i-solar:arrow-right-linear"
    label={f.nextView ? `Build with ${f.done.length} views (guess ${missing.join(', ')})` : 'Unfold into parts'} onclick={build} /></span>
{/snippet}
<svelte:head><title>Katachi · Six views</title></svelte:head>
<StepScreen {actions} context={ctx.inline} note={f.nextView ? `${f.done.length} of 6. Turn it so the ${f.nextView.label.toLowerCase()} faces you — I match edges between views to size every panel.` : copy.views.allIn}>
  {#if f.nextView}
    <figure class="md:hidden relative m-0 aspect-[4/3.4] rounded-lg overflow-hidden bg-camera">
      <BirdhouseView view={f.nextView.id} label={`Viewfinder: ${f.nextView.label}`} />
      <span class="absolute left-3 top-3 rounded-full bg-camera px-3 py-1 text-ui text-brand-tile">Shoot the {f.nextView.label.toLowerCase()} · keep the card in view</span>
    </figure>
  {/if}
  <section aria-label="Views" class="flex flex-col gap-5">
    <header class="lt-md:hidden"><h2 class="font-heading text-head font-normal tracking-display">{copy.views.title} · six views</h2>
      <p class="text-ui text-ink-mute mt-1">I match edges across views to size every panel. {f.done.length} of 6 in{missing.length ? ` — ${missing.join(' and ')} still needed.` : '.'}</p></header>
    <div class="grid grid-cols-6 gap-1.5 md:grid-cols-3 md:gap-4">
      {#each f.views as v (v.id)}
        <button type="button" aria-pressed={v.ok} aria-label={`${v.label}: ${v.ok ? 'matched' : 'needed'}`} onclick={() => f.toggleView(v.id)}
          class="rounded-lg border bg-paper-soft p-1.5 md:p-3 flex flex-col gap-2 text-left cursor-pointer {f.nextView?.id === v.id ? 'border-accent' : 'border-paper-edge'}">
          <span class="lt-md:hidden aspect-[4/3] rounded-md overflow-hidden {v.ok ? '' : 'border border-dashed border-ink-faint bg-paper grid place-items-center text-center'}">
            {#if v.ok}<BirdhouseView view={v.id} />{:else}<span class="text-ui text-ink-mute">Waiting for a photo<br /><span class="text-ink">Send from phone ↗</span></span>{/if}
          </span>
          <span class="flex items-center justify-between gap-1 lt-md:flex-col lt-md:py-1">
            <span class="lt-md:hidden text-body">{v.label}</span>
            <span class="md:hidden {v.ok ? 'i-solar:check-read-linear text-ink' : 'i-solar:record-circle-linear text-ink-faint'}" aria-hidden="true"></span>
            <span class="md:hidden text-micro">{v.label}</span>
            <span class="lt-md:hidden meta flex items-center gap-1 {v.ok ? 'text-success' : 'text-warning-ink'}">{#if v.ok}<span class="i-solar:check-read-linear" aria-hidden="true"></span>{/if}{v.ok ? 'matched' : 'needed'}</span>
          </span>
        </button>
      {/each}
    </div>
  </section>
</StepScreen>
