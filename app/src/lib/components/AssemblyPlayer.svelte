<script lang="ts">
import { Card, Timeline } from '@rokkit/ui';
import { InputField } from '@rokkit/forms';
let { steps }: { steps: string[] } = $props();
let t = $state(0);
const timeline = $derived(steps.map((s) => ({ label: s })));
</script>
<section aria-label="Assembly">
  <Card>
    {#snippet header()}<h2 class="panel-title">Assembly playback</h2>{/snippet}
    <div class="flex flex-col gap-3">
      <InputField type="range" name="assembly" label="Exploded ↔ Assembled" min={0} max={100} bind:value={t} />
      <p>{t < 50 ? 'Exploded: flat pieces' : 'Assembled: finished object'}</p>
      <Timeline items={timeline} />
    </div>
  </Card>
</section>
