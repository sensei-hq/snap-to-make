<script lang="ts">
let { label, onMake }: { label: string; onMake?: () => void } = $props();
</script>
<section aria-label="Preview" class="relative flex flex-col" style="background:#CBB99B;min-height:420px">
  <span class="mono absolute left-4 top-4 text-xs px-3 py-1.5 rounded-full z-10" style="background:#16140F;color:#F3EDE2">● AI preview · Muse Image</span>
  <span class="mono absolute left-44 top-4 text-xs px-2 py-1 rounded z-10" style="background:var(--paper)">[render placeholder]</span>
  <div class="flex-1 grid place-items-center py-16" role="img" aria-label="Photoreal preview of finished coasters in holder">
    <span class="font-display" style="font-size:120px;color:#7A5A34">M ◯</span>
  </div>
  <div class="card m-3 p-4 flex flex-col gap-3">
    <p class="text-sm">{label || "Here's how it'll look in birch. Four Ø 95 mm coasters, M engraved at 60 mm."}</p>
    <div class="flex gap-2"><span class="chip">Try another scene</span><span class="chip">Darker engraving</span></div>
    <button type="button" class="btn-ink w-full" onclick={() => onMake?.()}>Make it</button>
  </div>
</section>
