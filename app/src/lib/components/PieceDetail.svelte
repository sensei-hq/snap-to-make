<script lang="ts">
let { piece }: { piece: { name: string; kind: string; note: string } } = $props();
</script>
<section aria-label="Piece detail" class="bg-paper-soft border border-paper-edge rounded-lg p-3">
  <div class="flex gap-3 items-start">
    <svg viewBox="0 0 120 120" class="w-24 h-24 shrink-0" role="img" aria-label={piece.name}>
      <rect width="120" height="120" fill="var(--paper-soft)" />
      {#if piece.kind === 'base'}<ellipse cx="60" cy="78" rx="42" ry="12" fill="none" stroke="var(--cut)" stroke-width="2" /><rect x="34" y="34" width="52" height="44" fill="none" stroke="var(--engrave)" stroke-width="2" />
      {:else if piece.kind === 'join'}<rect x="24" y="40" width="72" height="36" fill="none" stroke="var(--cut)" stroke-width="2" /><path d="M34 76 v-10 h8 v10 h8 v-10 h8 v10 h8 v-10 h8 v10" fill="none" stroke="var(--engrave)" stroke-width="2" />
      {:else if piece.kind === 'layer'}<rect x="28" y="28" width="64" height="64" rx="4" fill="none" stroke="var(--cut)" stroke-width="2" /><rect x="38" y="38" width="44" height="44" rx="4" fill="none" stroke="var(--engrave)" stroke-width="2" />
      {:else}<rect x="28" y="22" width="64" height="76" rx="4" fill="none" stroke="var(--cut)" stroke-width="2" /><circle cx="60" cy="55" r="14" fill="none" stroke="var(--engrave)" stroke-width="2" />{/if}
    </svg>
    <div>
      <h3 class="font-semibold">{piece.name} <span class="text-sm text-ink-mute">({piece.kind})</span></h3>
      <p class="text-sm">{piece.note}</p>
      <p class="text-sm text-ink-mute">After you agree a variation, this piece appears with real dimensions in the pieces gallery, then in Workshop for measuring and Simulate.</p>
    </div>
  </div>
</section>
