<script lang="ts">
import { resolve } from '$app/paths';
import ScreenHeader from '$lib/components/ScreenHeader.svelte';
import WorkshopShell from '$lib/components/WorkshopShell.svelte';
import SceneCard from '$lib/components/SceneCard.svelte';
import AskBar from '$lib/components/AskBar.svelte';
import AppNav from '$lib/components/AppNav.svelte';
import ImplPicker from '$lib/components/ImplPicker.svelte';
import PlanCard from '$lib/components/PlanCard.svelte';
import SimulateView from '$lib/components/SimulateView.svelte';
import AssemblyPlayer from '$lib/components/AssemblyPlayer.svelte';
import TraceDrawer from '$lib/components/TraceDrawer.svelte';
import ArtPicker from '$lib/components/ArtPicker.svelte';
import PreviewStage from '$lib/components/PreviewStage.svelte';
import { FlowState } from '$lib/state/flow.svelte';
import { UiState } from '$lib/state/ui.svelte';
const flow = new FlowState();
const ui = new UiState();
let typed = $state('');
function submitTyped() { flow.conversation.ingestTranscript(typed); flow.analyse(); }
function onWindowDrop(e: DragEvent) { e.preventDefault(); if (e.dataTransfer?.files?.length) void flow.analyse(); }
function download(name: string, content: string) { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([content])); a.download = name; a.click(); }
const stageTitle = $derived(flow.design.impl ? 'Coasters for Maya' : 'Workshop');
const stageSub = $derived(flow.design.impl ? 'build plan · 6 parts' : flow.measureLabel ? 'scene · measured' : 'new project');
</script>
<svelte:window ondragover={(e) => e.preventDefault()} ondrop={onWindowDrop} />
<div class="phone-col">
  <ScreenHeader title={stageTitle} subtitle={stageSub} pill={flow.trace.label} onToggleMode={() => ui.toggleMode()} />
  <AppNav current="workshop" />
  <WorkshopShell listening={flow.conversation.listening} partial={flow.conversation.partial} listenLabel={flow.conversation.listenLabel}
    onMicDown={() => flow.startListen()} onMicUp={() => flow.stopListen()} />

  {#if flow.measureLabel}<SceneCard scene={flow.scene} measureLabel="Mug base Ø 82 mm" onConfirm={() => flow.plan()} />{/if}

  <div class="px-5 flex flex-col gap-2">
    <label class="sr-only" for="typed">What are we making</label>
    <input id="typed" bind:value={typed} onkeydown={(e)=>{ if (e.key==='Enter') submitTyped(); }} placeholder="make four coasters 3 mm birch" class="rounded-lg px-3 py-2.5 text-sm" style="background:var(--paper);border:1px solid var(--paper-edge);color:var(--ink)" />
    <div class="flex gap-2">
      <button type="button" class="btn-line flex-1" onclick={submitTyped}>Snap & measure</button>
      <label class="btn-line flex-1 cursor-pointer">Snap a photo<input type="file" accept="image/*" class="sr-only" onchange={() => flow.analyse()} /></label>
    </div>
  </div>

  <section aria-label="Convert a photo" class="card mx-5 mt-4 p-4">
    <h2 class="font-semibold">Have a photo of something you want to make?</h2>
    <p class="text-sm" style="color:var(--ink-mute)">Drop it in Convert — Burn-E dissects it into layers or joined faces, suggests variations, and breaks it into pieces with assembly steps.</p>
    <a href={resolve('/snap/convert')}>Convert a photo →</a>
  </section>

  <div class="mt-4"><ImplPicker value={flow.adapterId} onSelect={(id)=>flow.selectAdapter(id)} /></div>
  <div class="px-5 mt-3"><button type="button" class="btn-ink w-full" onclick={()=>flow.plan()}>Build plan</button></div>
  {#if flow.design.impl}<PlanCard impl={flow.design.impl} objectName={flow.design.object?.project ?? 'Design'} />{/if}
  <div class="flex gap-2 px-5"><button type="button" class="btn-line flex-1" onclick={() => flow.loadArt()}>Clean up my logo</button><button type="button" class="btn-line flex-1" onclick={() => flow.loadPreview()}>Show preview</button></div>
  {#if flow.artVariants.length}<ArtPicker variants={flow.artVariants} selected={flow.artSelected} onPick={(i) => { flow.artSelected = i; }} onReroll={() => flow.loadArt()} />{/if}
  {#if flow.previewLabel}<PreviewStage label={flow.previewLabel} onMake={() => flow.plan()} />{/if}
  {#if flow.playback}
    <div class="px-5 flex flex-col gap-4">
      <SimulateView timeline={flow.playback} positionSec={flow.playback.positionSec} currentLabel={flow.playback.currentOp?.label ?? ''} playing={flow.playback.playing}
        onPlay={()=>flow.playback?.play()} onPause={()=>flow.playback?.pause()} onSeek={(s:number)=>flow.playback?.seek(s)} onSpeed={(s:number)=>flow.playback?.setSpeed(s)} />
      <AssemblyPlayer steps={flow.design.impl?.assemblyTexts ?? []} />
      <section aria-label="Make" class="flex flex-col gap-2">
        <h2 class="font-semibold">Make</h2>
        <button type="button" class="btn-ink" onclick={()=>{ const c = flow.download('.gcode'); if (c) download('design.gcode', c); }}>Download G-code</button>
        <span class="text-sm" style="color:var(--ink-mute)">{flow.adapterId==='laser' ? 'G-code + SVG ready' : 'Export is Phase 2 — preview & simulate work now'}</span>
      </section>
    </div>
  {/if}
  <TraceDrawer entries={flow.trace.entries} label={flow.trace.label} onExport={() => download('trace.json', flow.trace.exportJson())} />
  <div class="flex-1"></div>
  <AskBar onSubmit={(v) => { flow.conversation.ingestTranscript(v); flow.analyse(); }} onMicDown={() => flow.startListen()} onMicUp={() => flow.stopListen()} onCamera={() => { location.href = '/snap/capture'; }} />
</div>
