<script lang="ts">
import { onMount } from 'svelte';
import CanvasSheet from '$lib/components/CanvasSheet.svelte';
import SimulateView from '$lib/components/SimulateView.svelte';
import AssemblyPlayer from '$lib/components/AssemblyPlayer.svelte';
import EditorToolbar from '$lib/components/editor/EditorToolbar.svelte';
import PropertiesPanel from '$lib/components/editor/PropertiesPanel.svelte';
import { useApp } from '$lib/state/context';
const app = useApp();
const flow = app.flow;
const ed = app.editor;
$effect(() => app.setScreen('Work area', `manual edits · demo sheet`));
onMount(() => { if (!flow.design.impl) void flow.plan(); });
function save(name: string, content: string) { if (!content) return; const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([content])); a.download = name; a.click(); }
</script>
<svelte:head><title>Katachi · Canvas</title></svelte:head>
<!-- Phone: the canvas column. Studio (≥ md): editor toolbar above, properties panel beside (one right panel at a time with the chat). -->
<div class="md:flex md:h-full md:min-h-0">
  <div class="flex-1 min-w-0 md:overflow-auto">
    <div class="lt-md:hidden"><EditorToolbar tool={ed.tool} zoomLabel={ed.zoomLabel} showGrid={ed.showGrid} statusLine={ed.statusLine} propsOpen={app.propsOpen}
      onTool={(t) => ed.setTool(t)} onZoomIn={() => ed.zoomIn()} onZoomOut={() => ed.zoomOut()} onToggleGrid={() => ed.toggleGrid()} onToggleProps={() => app.toggleProps()} /></div>
    <div class="stage md:max-w-[880px]">
      <CanvasSheet pieces={flow.canvasPieces} preflight={flow.coasterSet.preflight} estimateMinutes={flow.coasterSet.estimateMinutes}
        zoom={ed.zoom} showGrid={ed.showGrid}
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
  </div>
  {#if app.propsOpen}
    <div class="lt-md:hidden flex">
      <PropertiesPanel tab={ed.tab} op={ed.op} params={ed.params} airAssist={ed.airAssist} pieces={flow.canvasPieces} preflight={flow.coasterSet.preflight}
        estimateMinutes={flow.coasterSet.estimateMinutes} onTab={(t) => ed.setTab(t)} onOp={(o) => ed.setOp(o)} onParam={(k, v) => ed.setParam(k, v)}
        onToggleAir={() => ed.toggleAir()} onClose={() => app.toggleProps()} onDownloadGcode={() => save('design.gcode', flow.download('.gcode'))} />
    </div>
  {/if}
</div>
