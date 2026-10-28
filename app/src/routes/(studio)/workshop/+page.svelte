<script lang="ts">
import { resolve } from '$app/paths';
import { goto } from '$app/navigation';
import { Button, Card, List } from '@rokkit/ui';
import { steps } from '$lib/content/layers';
import { InputField } from '@rokkit/forms';
import WorkshopShell from '$lib/components/WorkshopShell.svelte';
import { useApp } from '$lib/state/context';
const app = useApp();
const flow = app.flow;
let typed = $state('');
let photoInput = $state<HTMLInputElement | null>(null);
async function measure() { if (typed) flow.conversation.ingestTranscript(typed); await flow.analyse(); await goto(resolve('/scene')); }
function onWindowDrop(e: DragEvent) { e.preventDefault(); if (e.dataTransfer?.files?.length) void measure(); }
$effect(() => app.setScreen('Workshop', flow.measureLabel ? 'scene · measured' : 'new or open a project'));
// Start: New goes to Capture (camera or upload); Open reopens a saved project where it was left.
function startNew() { app.newProject(); void goto(resolve('/capture')); }
function openProject(id: string) { app.open(id); void goto(resolve(app.resumePath as '/workshop')); }
const ago = (t: number) => new Date(t).toLocaleString(undefined, { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
const recent = $derived(app.projects.map((p) => ({ label: p.name, value: p.id, image: p.image, meta: `${steps[Math.max(0, p.reached)]?.label ?? 'Import'} · ${ago(p.updatedAt)}` })));
</script>
<svelte:head><title>Katachi · Workshop</title></svelte:head>
<svelte:window ondragover={(e) => e.preventDefault()} ondrop={onWindowDrop} />
<div class="stage">
  <section aria-label="Start" class="px-5 pt-6 flex flex-col gap-3">
    <Button variant="primary" size="lg" icon="i-solar:add-circle-linear" label="New project" onclick={startNew} />
    {#if recent.length}
      <section aria-label="Open a project" class="flex flex-col gap-2">
        <p class="eyebrow">Open</p>
        <Card class="overflow-hidden">
          <List items={recent} label="Saved projects" onselect={(v) => openProject(String(v))}>
            {#snippet itemContent(proxy)}
              <span class="flex items-center gap-3 w-full py-1 text-left">
                <span class="w-10 h-10 shrink-0 rounded-sm bg-paper-mute overflow-hidden" aria-hidden="true">{#if proxy.get('image')}<img src={String(proxy.get('image'))} alt="" class="w-full h-full object-cover" />{/if}</span>
                <span class="flex-1 min-w-0"><span class="block text-body text-ink truncate">{proxy.label}</span><span class="meta">{proxy.get('meta')}</span></span>
              </span>
            {/snippet}
          </List>
        </Card>
      </section>
    {/if}
  </section>
  <WorkshopShell listening={flow.conversation.listening} partial={flow.conversation.partial} listenLabel={flow.conversation.listenLabel}
    onMicDown={() => flow.startListen()} onMicUp={() => flow.stopListen()} />
  <div class="px-5 flex flex-col gap-2.5">
    <InputField name="typed" type="text" label="What are we making" placeholder="make four coasters 3 mm birch" bind:value={typed}
      onkeydown={(e: KeyboardEvent) => { if (e.key === 'Enter') void measure(); }} />
    <div class="flex gap-2.5">
      <Button style="outline" class="flex-1" icon="i-solar:ruler-linear" label="Snap & measure" onclick={() => void measure()} />
      <Button style="outline" class="flex-1" icon="i-solar:camera-linear" label="Snap a photo" onclick={() => photoInput?.click()} />
      <input bind:this={photoInput} type="file" accept="image/*" aria-label="Snap a photo" class="sr-only" tabindex="-1" onchange={() => void measure()} />
    </div>
  </div>
</div>
