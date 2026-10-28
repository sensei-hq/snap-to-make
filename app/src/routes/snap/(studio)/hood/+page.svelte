<script lang="ts">
import TraceDrawer from '$lib/components/TraceDrawer.svelte';
import { useApp } from '$lib/state/context';
const app = useApp();
const trace = app.trace;
app.setScreen('Under the hood', 'every Meta model call this session');
function download(name: string, content: string) { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([content])); a.download = name; a.click(); }
</script>
<svelte:head><title>Katachi · Under the hood</title></svelte:head>
<div class="stage">
  <TraceDrawer entries={trace.entries} label={trace.label} onExport={() => download('katachi-trace.json', trace.exportJson())} />
</div>
