<script lang="ts">
import { onMount } from 'svelte';
import ScreenHeader from '$lib/components/ScreenHeader.svelte';
import CanvasSheet from '$lib/components/CanvasSheet.svelte';
import AskBar from '$lib/components/AskBar.svelte';
import AppNav from '$lib/components/AppNav.svelte';
import { CanvasState } from '$lib/state/canvas.svelte';
const canvas = new CanvasState();
onMount(() => canvas.load());
function save(name: string, content: string) { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([content])); a.download = name; a.click(); }
</script>
<div class="phone-col">
  <ScreenHeader title="Coasters for Maya" subtitle="canvas · sheet 1 of 1" pill="$0.11 · 5 models" />
  <AppNav current="canvas" />
  <CanvasSheet plan={canvas.plan} onExportSvg={() => save('sheet.svg', canvas.svg())} onDownloadGcode={() => save('design.gcode', canvas.gcode())} />
  <div class="flex-1"></div>
  <AskBar placeholder="Make the walls 5 mm taller" />
</div>
