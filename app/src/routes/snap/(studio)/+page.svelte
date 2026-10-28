<script lang="ts">
import { resolve } from '$app/paths';
import { Button, Card } from '@rokkit/ui';
import { InputField } from '@rokkit/forms';
import WorkshopShell from '$lib/components/WorkshopShell.svelte';
import SceneCard from '$lib/components/SceneCard.svelte';
import ImplPicker from '$lib/components/ImplPicker.svelte';
import PlanCard from '$lib/components/PlanCard.svelte';
import SimulateView from '$lib/components/SimulateView.svelte';
import AssemblyPlayer from '$lib/components/AssemblyPlayer.svelte';
import TraceDrawer from '$lib/components/TraceDrawer.svelte';
import ArtPicker from '$lib/components/ArtPicker.svelte';
import PreviewStage from '$lib/components/PreviewStage.svelte';
import { useApp } from '$lib/state/context';
const app = useApp();
const flow = app.flow;
let typed = $state('');
let photoInput = $state<HTMLInputElement | null>(null);
function submitTyped() { flow.conversation.ingestTranscript(typed); flow.analyse(); }
function onWindowDrop(e: DragEvent) { e.preventDefault(); if (e.dataTransfer?.files?.length) void flow.analyse(); }
function download(name: string, content: string) { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([content])); a.download = name; a.click(); }
const stageTitle = $derived(flow.design.impl ? 'Coasters for Maya' : 'Workshop');
const stageSub = $derived(flow.design.impl ? 'build plan · 6 parts' : flow.measureLabel ? 'scene · measured' : 'new project');
$effect(() => app.setScreen(stageTitle, stageSub));
</script>
<svelte:head><title>Katachi · Workshop</title></svelte:head>
<svelte:window ondragover={(e) => e.preventDefault()} ondrop={onWindowDrop} />
<div class="stage">
  <WorkshopShell listening={flow.conversation.listening} partial={flow.conversation.partial} listenLabel={flow.conversation.listenLabel}
    onMicDown={() => flow.startListen()} onMicUp={() => flow.stopListen()} />

  {#if flow.measureLabel}<SceneCard scene={flow.scene} measureLabel="Mug base Ø 82 mm" onConfirm={() => flow.plan()} />{/if}

  <div class="px-5 flex flex-col gap-2.5">
    <InputField name="typed" type="text" label="What are we making" placeholder="make four coasters 3 mm birch" bind:value={typed}
      onkeydown={(e: KeyboardEvent) => { if (e.key === 'Enter') submitTyped(); }} />
    <div class="flex gap-2.5">
      <Button style="outline" class="flex-1" icon="i-solar:ruler-linear" label="Snap & measure" onclick={submitTyped} />
      <Button style="outline" class="flex-1" icon="i-solar:camera-linear" label="Snap a photo" onclick={() => photoInput?.click()} />
      <input bind:this={photoInput} type="file" accept="image/*" aria-label="Snap a photo" class="sr-only" tabindex="-1" onchange={() => flow.analyse()} />
    </div>
  </div>

  <section aria-label="Convert a photo" class="mx-5 mt-4">
    <Card href={resolve('/snap/convert')}>
      <h2 class="font-semibold">Have a photo of something you want to make?</h2>
      <p class="text-ui text-ink-mute">Drop it in Convert — Katachi dissects it into layers or joined faces, suggests variations, and breaks it into pieces with assembly steps.</p>
      {#snippet footer()}<span class="text-ui text-accent">Convert a photo →</span>{/snippet}
    </Card>
  </section>

  <div class="mt-4"><ImplPicker value={flow.adapterId} onSelect={(id) => flow.selectAdapter(id)} /></div>
  <div class="px-5 mt-3"><Button size="lg" variant="primary" class="w-full" label="Build plan" onclick={() => flow.plan()} /></div>
  {#if flow.design.impl}<PlanCard impl={flow.design.impl} objectName={flow.design.object?.project ?? 'Design'} />{/if}
  <div class="flex gap-2.5 px-5 mt-3">
    <Button style="outline" class="flex-1" icon="i-solar:magic-stick-linear" label="Clean up my logo" onclick={() => flow.loadArt()} />
    <Button style="outline" class="flex-1" icon="i-solar:eye-linear" label="Show preview" onclick={() => flow.loadPreview()} />
  </div>
  {#if flow.artVariants.length}<ArtPicker variants={flow.artVariants} selected={flow.artSelected} onPick={(i) => { flow.artSelected = i; }} onReroll={() => flow.loadArt()} />{/if}
  {#if flow.previewLabel}<PreviewStage label={flow.previewLabel} onMake={() => flow.plan()} />{/if}
  {#if flow.playback}
    <div class="px-5 mt-4 flex flex-col gap-4">
      <SimulateView timeline={flow.playback} positionSec={flow.playback.positionSec} currentLabel={flow.playback.currentOp?.label ?? ''} playing={flow.playback.playing}
        onPlay={() => flow.playback?.play()} onPause={() => flow.playback?.pause()} onSeek={(s: number) => flow.playback?.seek(s)} onSpeed={(s: number) => flow.playback?.setSpeed(s)} />
      <AssemblyPlayer steps={flow.design.impl?.assemblyTexts ?? []} />
      <section aria-label="Make" class="flex flex-col gap-2">
        <h2 class="panel-title">Make</h2>
        <Button size="lg" variant="primary" icon="i-solar:download-linear" label="Download G-code" onclick={() => { const c = flow.download('.gcode'); if (c) download('design.gcode', c); }} />
        <span class="text-ui text-ink-mute">{flow.adapterId === 'laser' ? 'G-code + SVG ready' : 'Export is Phase 2 — preview & simulate work now'}</span>
      </section>
    </div>
  {/if}
  <TraceDrawer entries={flow.trace.entries} label={flow.trace.label} onExport={() => download('trace.json', flow.trace.exportJson())} />
</div>
