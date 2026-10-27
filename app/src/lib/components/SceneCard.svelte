<script lang="ts">
let { scene, measureLabel, onFix, onConfirm }: { scene: any; measureLabel: string; onFix?: () => void; onConfirm?: () => void } = $props();
const objects = $derived<any[]>(scene?.scene?.objects ?? []);
const labelFor = (o: any) => o.role === 'art' ? 'Sketch · art' : o.role === 'fitTarget' ? 'Mug · fit' : 'Card · ref';
</script>
<section aria-label="Scene" class="px-5 py-4 flex flex-col gap-3">
  <div class="relative rounded-xl overflow-hidden" style="background:#2A2118;min-height:220px" role="img" aria-label="Scene photo with measured masks">
    <span class="mono absolute left-3 top-3 text-xs px-2 py-1 rounded-full" style="background:#16140F;color:#F3EDE2">SAM 3.1 · {objects.length || 3} masks</span>
    <div class="absolute rounded" style="left:8%;top:16%;width:30%;height:52%;background:#F1E7D3;transform:rotate(-4deg)"><span class="font-display" style="font-size:64px;color:#3A352C;padding-left:18%">M</span></div>
    <div class="absolute rounded-full" style="right:12%;top:20%;width:88px;height:88px;background:#6B4A2F;border:6px solid #D8C6A5"></div>
    <span class="mono absolute text-xs px-2 py-1 rounded-full" style="right:10%;top:52%;background:#16140F;color:#F3EDE2">Ø 82 mm ±2</span>
    <div class="absolute rounded" style="left:38%;bottom:8%;width:26%;height:20%;background:#31597F;transform:rotate(6deg)"></div>
    <span class="mono absolute text-xs px-2 py-1 rounded-full" style="left:6%;bottom:8%;background:#16140F;color:#F3EDE2">62 × 58 mm</span>
  </div>
  <div class="flex flex-wrap gap-2">
    {#each (objects.length ? objects : [{ role: 'art' }, { role: 'fitTarget' }, { role: 'reference' }]) as o (o.role ?? o.id)}<span class="chip">{labelFor(o)}</span>{/each}
  </div>
  <div class="card divide-y" style="border-color:var(--paper-edge)">
    <p class="flex justify-between px-4 py-3"><span>Mug base</span><span class="mono">{measureLabel || 'Ø 82 mm'} ✎</span></p>
    <p class="flex justify-between px-4 py-3"><span>Logo sketch</span><span class="mono">62 × 58 mm ✎</span></p>
    <p class="px-4 py-3 text-sm" style="color:var(--ink-mute)"><span style="color:var(--success)">●</span> Scale from credit card · confidence high</p>
  </div>
  <div class="flex gap-3">
    <button type="button" class="btn-line flex-1" onclick={() => onFix?.()}>Fix a number</button>
    <button type="button" class="btn-ink flex-1" onclick={() => onConfirm?.()}>Looks right</button>
  </div>
</section>
