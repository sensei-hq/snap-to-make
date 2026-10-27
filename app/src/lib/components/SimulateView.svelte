<script lang="ts">
import { Button, Card, Toggle } from '@rokkit/ui';
import { InputField } from '@rokkit/forms';
let { timeline, positionSec, currentLabel, playing, onPlay, onPause, onSeek, onSpeed }: any = $props();
let speed = $state(1);
const speeds = [1, 4, 16].map((s) => ({ label: `${s}×`, value: s }));
</script>
<section aria-label="Simulate">
  <Card>
    {#snippet header()}<h2 class="panel-title">Simulate <span class="meta">no device needed</span></h2>{/snippet}
    <div class="flex flex-col gap-3">
      <div class="relative h-40 rounded grid-bed bg-paper border border-paper-edge" role="img" aria-label="Virtual bed">
        <div class="absolute w-3 h-3 -ml-1.5 rounded-full bg-accent top-[40%]" style="left:{Math.min(90, positionSec * 3)}%"></div>
        <p class="absolute bottom-2 left-3 readout">{currentLabel}</p>
      </div>
      <div class="flex items-center gap-3">
        {#if playing}<Button variant="primary" size="sm" icon="i-solar:pause-linear" label="Pause" onclick={onPause} />{:else}<Button variant="primary" size="sm" icon="i-solar:play-linear" label="Play" onclick={onPlay} />{/if}
        <InputField type="range" name="seek" label="Seek" variant="inline" class="flex-1" min={0} max={timeline.totalSec} step={0.1} value={positionSec} onchange={(v) => onSeek(Number(v))} />
      </div>
      <div class="flex items-center gap-3">
        <Toggle options={speeds} value={speed} showLabels onchange={(v) => { speed = Number(v); onSpeed(speed); }} />
        <span class="flex-1"></span><span class="readout">{positionSec.toFixed(1)} / {timeline.totalSec}s</span>
      </div>
    </div>
  </Card>
</section>
