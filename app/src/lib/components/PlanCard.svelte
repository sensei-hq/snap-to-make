<script lang="ts">
import { Button, Card, List, Pill, ProgressBar } from '@rokkit/ui';
let { impl, objectName }: { impl: any; objectName: string } = $props();
const items = $derived((impl?.pieces ?? []).map((p: any) => ({ label: p.name, value: p.id, size: `${p.wMm} × ${p.hMm} mm` })));
const assumptions = ['Coaster = mug base + 13 mm', 'Clearance 1 mm · kerf 0.1 mm'];
</script>
<section aria-label="Build plan" class="px-4 py-4 flex flex-col gap-3.5">
  <div class="rounded-lg grid-bed bg-paper-soft border border-dashed border-paper-edge min-h-33" role="img" aria-label="Exploded build diagram">
    <p class="meta px-3 pt-2">holder · 4 walls · exploded view</p>
    <p class="font-heading text-head text-center text-ink-mute py-4">⧉ → ▭</p>
  </div>
  <div class="flex gap-2"><Pill value="Birch · 3 mm" class="swatch-birch" /><Pill value="Ray 5 · 10 W" /></div>
  <Card>
    <List {items}>
      {#snippet itemContent(proxy)}<span class="flex-1">{proxy.label}</span><span class="readout">{proxy.get('size')}</span>{/snippet}
    </List>
    {#snippet footer()}
      <p class="flex justify-between"><span>Sheet fit</span><span class="readout">{impl?.sheets ?? 1} of 1 · 300 × 300</span></p>
      <ProgressBar value={72} max={100} class="mt-2" />
    {/snippet}
  </Card>
  <p class="eyebrow">Assumptions</p>
  <Card>
    <ul class="divide-y divide-paper-edge">
      {#each assumptions as a (a)}<li class="flex items-center gap-3 min-h-12 px-3.5"><span class="flex-1">{a}</span><Button style="ghost" size="sm" icon="i-solar:pen-linear" aria-label={`Edit ${a}`} /></li>{/each}
    </ul>
  </Card>
  <p class="text-ui text-ink-mute">{items.length} pieces · {objectName}</p>
</section>
