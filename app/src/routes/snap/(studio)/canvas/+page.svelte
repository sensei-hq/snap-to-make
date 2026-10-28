<script lang="ts">
import { onMount } from 'svelte';
import CanvasSheet from '$lib/components/CanvasSheet.svelte';
import { useApp } from '$lib/state/context';
const app = useApp();
const canvas = app.canvas;
app.setScreen('Coasters for Maya', 'canvas · sheet 1 of 1');
onMount(() => canvas.load());
function save(name: string, content: string) { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([content])); a.download = name; a.click(); }
</script>
<svelte:head><title>Katachi · Canvas</title></svelte:head>
<div class="stage">
  <CanvasSheet plan={canvas.plan} onExportSvg={() => save('sheet.svg', canvas.svg())} onDownloadGcode={() => save('design.gcode', canvas.gcode())} />
</div>
