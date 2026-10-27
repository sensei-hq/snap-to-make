<script lang="ts">
import { pieceFinalLabel } from '../domain/gallery';
let { pieces, group }: { pieces: any[]; group: any } = $props();
</script>
<section aria-label="Piece gallery">
  <h3 class="text-ink font-semibold mb-2">Pieces gallery (cut size → final size)</h3>
  <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
    {#each pieces as p (p.name)}
      <figure class="bg-paper-soft border border-paper-edge rounded-lg overflow-hidden">
        <svg viewBox="0 0 120 120" role="img" aria-label={p.name} class="w-full">
          <rect width="120" height="120" fill="var(--paper-soft)" />
          {#if p.kind === 'wheel'}
            <circle cx="60" cy="56" r="36" fill="none" stroke="var(--cut)" stroke-width="2" />
            <circle cx="60" cy="56" r="22" fill="none" stroke="var(--engrave)" stroke-width="2" />
            <circle cx="60" cy="56" r="4" fill="var(--cut)" />
            {#each [0, 60, 120, 180, 240, 300] as a (a)}<line x1="60" y1="56" x2={60 + 22 * Math.cos(a * Math.PI / 180)} y2={56 + 22 * Math.sin(a * Math.PI / 180)} stroke="var(--engrave)" stroke-width="1" />{/each}
            <rect x="48" y="24" width="24" height="12" fill="none" stroke="var(--cut)" stroke-width="1.5" />
          {:else if p.kind === 'face'}
            <rect x="26" y="20" width="68" height="72" rx="4" fill="none" stroke="var(--cut)" stroke-width="2" />
            <rect x="38" y="34" width="16" height="12" fill="none" stroke="var(--engrave)" stroke-width="1.5" />
            <rect x="66" y="34" width="16" height="12" fill="none" stroke="var(--engrave)" stroke-width="1.5" />
            <circle cx="60" cy="68" r="10" fill="none" stroke="var(--engrave)" stroke-width="1.5" />
          {:else if p.kind === 'base'}
            <ellipse cx="60" cy="80" rx="40" ry="12" fill="none" stroke="var(--cut)" stroke-width="2" />
            <path d="M38 80 v-28 h44 v28" fill="none" stroke="var(--engrave)" stroke-width="1.5" />
          {:else if p.kind === 'join'}
            <rect x="22" y="44" width="76" height="28" fill="none" stroke="var(--cut)" stroke-width="2" />
            <path d="M32 72 v-9 h8 v9 h8 v-9 h8 v9 h8 v-9 h8 v9" fill="none" stroke="var(--engrave)" stroke-width="2" />
          {:else if p.kind === 'layer'}
            <rect x="30" y="26" width="60" height="60" rx="4" fill="none" stroke="var(--cut)" stroke-width="2" />
            <rect x="38" y="34" width="60" height="60" rx="4" fill="none" stroke="var(--engrave)" stroke-width="1.5" opacity="0.7" />
          {:else}
            <rect x="28" y="24" width="64" height="68" rx="4" fill="none" stroke="var(--cut)" stroke-width="2" />
            <circle cx="60" cy="58" r="12" fill="none" stroke="var(--engrave)" stroke-width="1.5" />
          {/if}
          <text x="60" y="108" text-anchor="middle" fill="var(--ink)" font-family="monospace" font-size="8">{pieceFinalLabel(p, group)}</text>
          <text x="60" y="13" text-anchor="middle" fill="var(--ink-mute)" font-family="sans-serif" font-size="7">{p.name}</text>
        </svg>
        <figcaption class="p-2 text-sm text-ink">{p.name} <span class="text-ink-mute">({p.kind})</span><br /><span class="text-ink-mute">{p.note}</span></figcaption>
      </figure>
    {/each}
  </div>
</section>
