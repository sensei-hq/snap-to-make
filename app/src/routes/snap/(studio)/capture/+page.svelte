<script lang="ts">
import SnapCapture from '$lib/components/SnapCapture.svelte';
import { useApp } from '$lib/state/context';
const capture = useApp().capture;
</script>
<svelte:head><title>Katachi · Snap</title></svelte:head>
<div class="bg-camera">
  <SnapCapture step={capture.step} hints={capture.hints} captured={capture.captured} analyzed={capture.analyzed} photoLabel={capture.photoLabel} busy={capture.busy}
    onCapture={() => capture.capture()} onAnalyze={() => capture.analyze()} onRetake={() => capture.retake()} onClose={() => history.back()} />
</div>
