<script lang="ts">
import { Card } from '@rokkit/ui';
import PieceGlyph from './PieceGlyph.svelte';
let { piece }: { piece: { name: string; kind: string; note: string } } = $props();
</script>
<section aria-label="Piece detail">
  <Card>
    <div class="flex gap-3 items-start">
      <PieceGlyph kind={piece.kind} label={piece.name} class="w-24 h-24 shrink-0 rounded" />
      <div class="flex flex-col gap-1">
        <h3 class="font-semibold">{piece.name} <span class="text-ui text-ink-mute">({piece.kind})</span></h3>
        <p class="text-ui">{piece.note}</p>
        <p class="text-ui text-ink-mute">After you agree a variation, this piece appears with real dimensions in the pieces gallery, then in Workshop for measuring and Simulate.</p>
      </div>
    </div>
  </Card>
</section>
