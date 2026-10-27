<script lang="ts">
import { Card } from '@rokkit/ui';
import { pieceFinalLabel } from '../domain/gallery';
import PieceGlyph from './PieceGlyph.svelte';
let { pieces, group }: { pieces: any[]; group: any } = $props();
</script>
<section aria-label="Piece gallery" class="flex flex-col gap-2">
  <h3 class="font-semibold">Pieces gallery (cut size → final size)</h3>
  <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
    {#each pieces as p (p.name)}
      <Card>
        {#snippet header()}<PieceGlyph kind={p.kind} label={p.name} title={p.name} caption={pieceFinalLabel(p, group)} class="w-full" />{/snippet}
        <p class="text-ui">{p.name} <span class="text-ink-mute">({p.kind})</span></p>
        <p class="text-ui text-ink-mute">{p.note}</p>
      </Card>
    {/each}
  </div>
</section>
