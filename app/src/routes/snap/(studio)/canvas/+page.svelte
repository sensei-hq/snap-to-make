<script lang="ts">
import { onMount } from 'svelte';
import CanvasSheet from '$lib/components/CanvasSheet.svelte';
import SimulateView from '$lib/components/SimulateView.svelte';
import AssemblyPlayer from '$lib/components/AssemblyPlayer.svelte';
import { useApp } from '$lib/state/context';
const app = useApp();
const flow = app.flow;
$effect(() => app.setScreen('Coasters for Maya', `canvas · sheet 1 of ${flow.design.impl?.sheets ?? 1}`));
onMount(() => { if (!flow.design.impl) void flow.plan(); });
function save(name: string, content: string) { if (!content) return; const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([content])); a.download = name; a.click(); }
</script>
<svelte:head><title>Katachi · Canvas</title></svelte:head>
<div class="stage">
  <CanvasSheet pieces={flow.canvasPieces} preflight={flow.coasterSet.preflight} estimateMinutes={flow.coasterSet.estimateMinutes}
    message={flow.lidMessage} lid={flow.lid} onAddLid={() => void flow.addLid()} onDeclineLid={() => void flow.declineLid()}
    onExportSvg={() => save('design.svg', flow.download('.svg'))} onDownloadGcode={() => save('design.gcode', flow.download('.gcode'))} />
  {#if flow.playback}
    <div class="px-4 pb-4 flex flex-col gap-4">
      <SimulateView timeline={flow.playback} positionSec={flow.playback.positionSec} currentLabel={flow.playback.currentOp?.label ?? ''} playing={flow.playback.playing}
        onPlay={() => flow.playback?.play()} onPause={() => flow.playback?.pause()} onSeek={(s: number) => flow.playback?.seek(s)} onSpeed={(s: number) => flow.playback?.setSpeed(s)} />
      <AssemblyPlayer steps={flow.design.impl?.assemblyTexts ?? []} />
      <p class="text-ui text-ink-mute">{flow.adapterId === 'laser' ? 'G-code + SVG ready' : 'Export is Phase 2 — preview & simulate work now'}</p>
    </div>
  {/if}
</div>
