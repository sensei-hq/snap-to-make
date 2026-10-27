<script lang="ts">
import SnapCapture from '$lib/components/SnapCapture.svelte';
import { CaptureState } from '$lib/state/capture.svelte';
const capture = new CaptureState();
</script>
<div class="bg-camera">
  <SnapCapture step={capture.step} hints={capture.hints} captured={capture.captured} analyzed={capture.analyzed} photoLabel={capture.photoLabel} busy={capture.busy}
    onCapture={() => capture.capture()} onAnalyze={() => capture.analyze()} onRetake={() => capture.retake()} onClose={() => history.back()} />
</div>
