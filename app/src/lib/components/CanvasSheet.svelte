<script lang="ts">
let { plan, onExportSvg, onDownloadGcode }: { plan: any; onExportSvg?: () => void; onDownloadGcode?: () => void } = $props();
</script>
<section aria-label="Canvas" class="px-5 py-4 flex flex-col gap-3">
  <div class="relative rounded-lg" style="background:var(--paper-soft);border:1px solid var(--paper-edge)" role="img" aria-label="Nested sheet layout 300 by 300 millimetres">
    <svg viewBox="0 0 300 300" class="w-full block">
      <rect x="6" y="6" width="288" height="288" fill="none" stroke="var(--paper-edge)" />
      {#each plan?.pieces ?? [] as p (p.id)}
        {#if p.kind === 'circle'}<circle cx={p.xMm + p.wMm / 2} cy={p.yMm + p.hMm / 2} r={p.wMm / 2} fill="none" stroke="var(--danger, #C93A3A)" stroke-width="1.4" />{#if p.label}<text x={p.xMm + p.wMm / 2} y={p.yMm + p.hMm / 2 + 7} text-anchor="middle" font-size="22" fill="var(--ink)">{p.label}</text>{/if}
        {:else}<rect x={p.xMm} y={p.yMm} width={p.wMm} height={p.hMm} fill="none" stroke="var(--danger, #C93A3A)" stroke-width="1.4" />{/if}
      {/each}
    </svg>
    <span class="mono absolute right-2 top-2 text-xs px-2 py-1 rounded" style="background:var(--paper)"><span style="color:var(--danger,#C93A3A)">—</span> cut · <span style="color:var(--ink)">—</span> engrave</span>
    <span class="mono absolute right-2 bottom-2 text-xs" style="color:var(--ink-mute)">300 × 300 mm</span>
  </div>
  <p class="text-sm"><span aria-hidden="true" class="inline-block w-5 h-5 rounded-full text-center mr-2" style="background:var(--paper-mute)">●</span>{plan?.suggestion ?? ''} <button type="button" class="chip ml-2">Add lid</button> <button type="button" class="chip">No</button></p>
  <div>
    <p class="flex justify-between"><span class="mono text-xs tracking-widest" style="color:var(--ink-mute)">PREFLIGHT</span><span class="mono text-sm">est. {plan?.estMin ?? 0} min</span></p>
    <p class="text-sm mt-1">{#each plan?.preflight ?? [] as c (c.label)}<span class="mr-3"><span style="color:var(--success)">✓</span> {c.label}</span>{/each}</p>
    <p class="mono text-xs mt-1" style="color:var(--ink-mute)">{plan?.deviceLabel ?? ''}</p>
  </div>
  <div class="flex gap-3">
    <button type="button" class="btn-line flex-1" onclick={() => onExportSvg?.()}>Export SVG</button>
    <button type="button" class="btn-ink flex-1" onclick={() => onDownloadGcode?.()}>Download G-code</button>
  </div>
</section>
