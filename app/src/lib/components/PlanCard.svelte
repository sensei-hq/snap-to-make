<script lang="ts">
import { List } from '@rokkit/ui';
let { impl, objectName }: { impl: any; objectName: string } = $props();
const items = $derived((impl?.pieces ?? []).map((p: any) => ({ label: p.name, value: p.id, size: `${p.wMm} × ${p.hMm} mm` })));
</script>
<section aria-label="Build plan" class="px-5 py-4 flex flex-col gap-3">
  <div class="rounded-xl" style="background:var(--paper-soft);border:1px dashed var(--paper-edge);min-height:130px" role="img" aria-label="Exploded build diagram">
    <p class="mono text-xs px-3 pt-2" style="color:var(--ink-mute)">holder · 4 walls · exploded view</p>
    <p class="font-display text-center text-3xl py-4">⧉ → ▭</p>
  </div>
  <div class="flex gap-2"><span class="chip">Birch · 3 mm</span><span class="chip"><span style="color:var(--success)">●</span> Ray 5 · 10 W</span></div>
  <div class="card px-2">
    <List {items}>
      {#snippet itemContent(proxy)}<span class="flex-1">{proxy.label}</span><span class="mono text-sm">{proxy.get('size')}</span>{/snippet}
    </List>
    <p class="flex justify-between px-2 py-2"><span>Sheet fit</span><span class="mono">{impl?.sheets ?? 1} of 1 · 300 × 300</span></p>
    <div class="mx-2 mb-3 h-1.5 rounded-full" style="background:var(--paper-mute)"><div class="h-1.5 rounded-full" style="width:72%;background:var(--ink)"></div></div>
  </div>
  <p class="mono text-xs tracking-widest" style="color:var(--ink-mute)">ASSUMPTIONS</p>
  <div class="card divide-y px-4" style="border-color:var(--paper-edge)">
    <p class="flex justify-between py-2.5"><span>Coaster = mug base + 13 mm</span><span>✎</span></p>
    <p class="flex justify-between py-2.5"><span>Clearance 1 mm · kerf 0.1 mm</span><span>✎</span></p>
  </div>
  <p class="text-sm" style="color:var(--ink-mute)">{items.length} pieces · {objectName}</p>
</section>
