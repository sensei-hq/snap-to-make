<script lang="ts">
import { resolve } from '$app/paths';
import { goto } from '$app/navigation';
import { Button, Card } from '@rokkit/ui';
import { InputField } from '@rokkit/forms';
import CraftCard from '$lib/components/craft/CraftCard.svelte';
import LayeredScene from '$lib/components/illustrations/LayeredScene.svelte';
import { journey, starts, type StartId } from '$lib/content/journey';
import { layerSets } from '$lib/content/layers';
import { useApp } from '$lib/state/context';
// Home (docs/design/07 G4–G7): start a craft (say it, type it or pick a starting point), continue the one in
// progress, and the recent crafts. Studio: start | continue side by side, the gallery below. Phones: one column.
const app = useApp();
const flow = app.flow;
let typed = $state('');
$effect(() => app.setScreen('Home', 'start a craft or pick one up'));
const go = (path: string) => void goto(resolve(path as '/workshop'));
const begin = (from: StartId | string) => { if (typeof from === 'string' && !from.trim()) return; go(app.startCraft(from)); };
function micUp() { const to = app.listenToStart(); if (to) go(to); }
const openCraft = (id: string) => { app.open(id); go(app.resumePath); };
const ago = (t: number) => new Date(t).toLocaleString(undefined, { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
const recent = $derived(app.projects.slice(0, 8));
const current = $derived(app.project && app.project.reached >= 0 && app.project.status !== 'finished' ? app.project : null);
const sample = layerSets.paper.layers;
</script>
<svelte:head><title>Katachi · Home</title></svelte:head>
<div class="mx-auto w-full max-w-[1180px] px-4 py-5 md:px-8 md:py-8 flex flex-col gap-8">
  <div class="grid gap-4 md:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] md:gap-6">
    <Card class="p-5 md:p-6 flex flex-col gap-4">
      <section aria-label="Start a craft" class="flex flex-col gap-4">
        <div><p class="eyebrow">New craft</p><h2 class="font-heading text-title md:text-head font-normal tracking-display mt-1">What are we making today?</h2></div>
        <div class="flex items-end gap-2.5">
          <button type="button" aria-label="Hold to talk" aria-pressed={flow.conversation.listening} data-testid="mic"
            class="shrink-0 w-12 h-12 grid place-items-center rounded-full bg-primary text-on-primary transition-opacity hover:opacity-90 {flow.conversation.listening ? 'ring-4 ring-paper-edge' : ''}"
            onpointerdown={() => flow.startListen()} onpointerup={micUp}>
            <span class="i-solar:microphone-3-linear text-title" aria-hidden="true"></span>
          </button>
          <div class="flex-1 min-w-0">
            <InputField name="typed" type="text" label="Say it or type it" placeholder="a layered mountain picture for Maya" bind:value={typed}
              onkeydown={(e: KeyboardEvent) => { if (e.key === 'Enter') begin(typed); }} />
          </div>
          <Button variant="primary" icon="i-solar:arrow-right-linear" aria-label="Start" disabled={!typed.trim()} onclick={() => begin(typed)} />
        </div>
        {#if flow.conversation.listening}<p class="meta" aria-live="polite">{flow.conversation.listenLabel} · {flow.conversation.partial}</p>{/if}
        <p class="eyebrow mt-1">Or start from</p>
        <ul class="grid gap-2 sm:grid-cols-2">
          {#each starts as s (s.id)}
            <li>
              <button type="button" class="w-full h-full text-left flex gap-3 items-start rounded-md border border-paper-edge bg-paper p-3 hover:border-ink-soft transition-colors cursor-pointer" onclick={() => begin(s.id)}>
                <span class="{s.icon} text-title text-accent shrink-0" aria-hidden="true"></span>
                <span><span class="block text-body text-ink font-medium">{s.label}</span><span class="block text-ui text-ink-mute">{s.hint}</span></span>
              </button>
            </li>
          {/each}
        </ul>
      </section>
    </Card>

    {#if current}
      <Card class="p-5 md:p-6 flex flex-col gap-4">
        <section aria-label="Continue" class="flex flex-col gap-4 h-full">
          <p class="eyebrow">Continue</p>
          <div class="flex gap-4 items-center">
            <span class="w-24 h-24 shrink-0 rounded-md overflow-hidden bg-paper-mute">{#if current.image}<img src={current.image} alt="" class="w-full h-full object-cover" />{:else}<LayeredScene layers={sample} mode="full" label="" />{/if}</span>
            <div class="min-w-0"><h3 class="font-heading text-title font-normal truncate">{current.name}</h3><p class="meta mt-1">{app.progressOf(current).label}</p></div>
          </div>
          <ol class="flex flex-col gap-1.5">
            {#each journey as j, i (j.id)}
              {@const at = app.progressOf(current).index}
              <li class="flex items-center gap-2.5 text-ui {i === at ? 'text-ink' : i < at ? 'text-ink-mute' : 'text-ink-faint'}">
                <span class="w-5 h-5 grid place-items-center rounded-full font-mono text-micro {i < at ? 'bg-ink-soft text-paper' : i === at ? 'bg-accent text-on-primary' : 'border border-paper-edge'}">{#if i < at}<span class="i-solar:check-read-linear" aria-hidden="true"></span>{:else}{i + 1}{/if}</span>{j.label}<span class="meta truncate">· {j.hint}</span>
              </li>
            {/each}
          </ol>
          <span class="mt-auto grid"><Button variant="primary" size="lg" label="Resume" iconRight="i-solar:arrow-right-linear" onclick={() => go(app.resumePath)} /></span>
        </section>
      </Card>
    {:else}
      <Card class="p-5 md:p-6">
        <section aria-label="How a craft goes" class="flex flex-col gap-3">
          <p class="eyebrow">How a craft goes</p>
          <ol class="flex flex-col gap-3">
            {#each journey as j, i (j.id)}
              <li class="flex gap-3"><span class="font-mono text-micro text-accent pt-1">{String(i + 1).padStart(2, '0')}</span><span><span class="block text-body text-ink">{j.label}</span><span class="block text-ui text-ink-mute">{j.hint}</span></span></li>
            {/each}
          </ol>
          <p class="text-ui text-ink-mute">Katachi guides each step in the chat. Tell it what to change and it keeps the note with your craft.</p>
        </section>
      </Card>
    {/if}
  </div>

  <section aria-label="Recent crafts" class="flex flex-col gap-3">
    <div class="flex items-end justify-between gap-3">
      <div><p class="eyebrow">Recent crafts</p><h2 class="panel-title mt-1">Your workshop</h2></div>
      {#if app.projects.length}<a href={resolve('/crafts')} class="text-ui">See all {app.projects.length}</a>{/if}
    </div>
    {#if recent.length}
      <div class="grid gap-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {#each recent as p (p.id)}
          {@const pr = app.progressOf(p)}
          <CraftCard name={p.name} image={p.image} progress={pr} finished={pr.finished} example={p.example} updated={ago(p.updatedAt)} fallback={sample}
            onOpen={() => openCraft(p.id)} onDelete={() => app.removeCraft(p.id)} />
        {/each}
      </div>
    {:else}
      <div class="rounded-lg border border-dashed border-paper-edge p-5 flex flex-col md:flex-row gap-4 md:items-center">
        <span class="w-20 h-20 shrink-0 rounded-md overflow-hidden bg-paper-mute"><LayeredScene layers={sample} mode="full" label="" /></span>
        <p class="flex-1 text-ui text-ink-mute">Nothing here yet. Crafts you start are saved as you go and show up here. Open the example to see a finished one.</p>
        <Button style="outline" label="Open the example" onclick={() => { app.openExample(); go(app.resumePath); }} />
      </div>
    {/if}
  </section>
</div>
