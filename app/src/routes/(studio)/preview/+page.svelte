<script lang="ts">
import { resolve } from '$app/paths';
import { goto } from '$app/navigation';
import PreviewStage from '$lib/components/PreviewStage.svelte';
import { useApp } from '$lib/state/context';
const app = useApp();
const flow = app.flow;
app.setScreen('Coasters for Maya', 'preview · before any wood');
async function make() { if (!flow.design.impl) await flow.plan(); await goto(resolve('/canvas')); }
</script>
<svelte:head><title>Katachi · Preview</title></svelte:head>
<div class="stage">
  <PreviewStage label={flow.previewCaption} darker={flow.darkerEngraving} onNextScene={() => flow.nextScene()} onToggleEngraving={() => flow.toggleEngraving()} onMake={() => void make()} />
</div>
