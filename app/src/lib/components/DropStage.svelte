<script lang="ts">
import { Button, Card, UploadTarget } from '@rokkit/ui';
let { imageUrl, imageName, dissection, group, onFile, onCamera, selectedPiece, onSelectPiece, overlayBoxes = [] }: { imageUrl?: string; imageName: string; dissection: any; group: string; onFile: (f: File) => void; onCamera: () => void; selectedPiece?: string; onSelectPiece?: (name: string) => void; overlayBoxes?: { x1: number; y1: number; x2: number; y2: number }[] } = $props();
const pieces = $derived<any[]>(dissection ? (dissection.pieces?.length ? dissection.pieces : dissection.piecesHint.map((n: string) => ({ name: n, kind: 'face', note: '' }))) : []);
</script>
<!-- The drop target IS the stage: the photo appears here, and dropping again replaces it. -->
<section aria-label="Your photo" class="lg:sticky lg:top-4">
  <Card>
    {#if imageUrl}
      <span class="relative block">
        <img src={imageUrl} alt="Your uploaded project" class="w-full max-h-[520px] object-contain block rounded bg-paper" />
        {#each overlayBoxes as b, i (i)}
          <span aria-label="Piece region on photo" class="absolute rounded border-2 border-accent bg-accent-soft" style="left:{b.x1 / 10}%;top:{b.y1 / 10}%;width:{(b.x2 - b.x1) / 10}%;height:{(b.y2 - b.y1) / 10}%"></span>
        {/each}
        {#if overlayBoxes.length}<span class="absolute left-2 top-2 rounded-full px-2 py-1 meta bg-accent text-on-accent">{selectedPiece} — SAM segment</span>{/if}
      </span>
    {/if}
    <UploadTarget accept="image/*" size={imageUrl ? 'small' : 'full'} onfiles={(files) => files[0] && onFile(files[0])}>
      {#snippet content(dragging)}
        <span class="flex flex-col items-center gap-1 text-center {imageUrl ? 'py-2' : 'py-12'} {dragging ? 'text-accent' : ''}">
          <span class="i-solar:upload-linear text-title text-accent" aria-hidden="true"></span>
          {#if imageUrl}<span class="text-ui text-ink-mute">Drop a new image here, or click, to replace · {imageName}</span>
          {:else}<strong class="font-medium">Drop your image here or click to upload</strong><span class="text-ui text-ink-mute">A finished piece, a sketch, anything — Katachi will dissect it</span>{/if}
        </span>
      {/snippet}
    </UploadTarget>
    {#snippet footer()}
      <div class="flex items-center justify-between"><span class="text-ui text-ink-mute">{group}</span><Button style="ghost" size="sm" icon="i-solar:camera-linear" label="Use camera instead" onclick={onCamera} /></div>
      {#if dissection}
        <div aria-label="Dissection" class="mt-3 pt-3 hair-t flex flex-col gap-1">
          <p><strong>{dissection.subject}</strong> · {dissection.conversionClass} · {dissection.source === 'live' ? 'Muse Spark (live)' : 'demo analysis'}</p>
          <p class="text-ui text-ink-mute">Dissected into — tap a piece to inspect it:</p>
          <ul class="flex flex-wrap gap-1.5">{#each pieces as piece (piece.name)}
            <li><Button size="sm" variant={selectedPiece === piece.name ? 'primary' : 'default'} style={selectedPiece === piece.name ? 'default' : 'outline'} aria-pressed={selectedPiece === piece.name} label={piece.name} onclick={() => onSelectPiece?.(piece.name)} /></li>{/each}</ul>
        </div>
      {/if}
    {/snippet}
  </Card>
</section>
