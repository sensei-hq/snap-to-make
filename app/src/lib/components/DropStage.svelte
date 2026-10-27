<script lang="ts">
let { imageUrl, imageName, dissection, group, onFile, onCamera, selectedPiece, onSelectPiece, overlayBoxes = [] }: { imageUrl?: string; imageName: string; dissection: any; group: string; onFile: (f: File) => void; onCamera: () => void; selectedPiece?: string; onSelectPiece?: (name: string) => void; overlayBoxes?: { x1: number; y1: number; x2: number; y2: number }[] } = $props();
let over = $state(false);
</script>
<!-- The drop box IS the stage: the photo appears here, and dropping again replaces it. -->
<section aria-label="Your photo" class="rounded-xl overflow-hidden lg:sticky lg:top-4 bg-paper-soft">
  <label class="block cursor-pointer relative border-2 border-dashed rounded-lg m-2 {over ? 'border-accent' : 'border-paper-edge'}"
    ondragover={(e) => { e.preventDefault(); over = true; }} ondragleave={() => (over = false)}
    ondrop={(e) => { e.preventDefault(); over = false; const f = e.dataTransfer?.files?.[0]; if (f) onFile(f); }}>
    <input type="file" accept="image/*" class="sr-only" aria-label="Upload an image"
      onchange={(e) => { const f = e.currentTarget.files?.[0]; if (f) onFile(f); }} />
    {#if imageUrl}
      <span class="relative block">
        <img src={imageUrl} alt="Your uploaded project" class="w-full max-h-[520px] object-contain block bg-paper" />
        {#each overlayBoxes as b, i (i)}
          <span aria-label="Piece region on photo" class="absolute rounded" style="left:{b.x1 / 10}%;top:{b.y1 / 10}%;width:{(b.x2 - b.x1) / 10}%;height:{(b.y2 - b.y1) / 10}%;border:2px solid var(--accent);background:color-mix(in oklch, var(--accent) 18%, transparent)"></span>
        {/each}
        {#if overlayBoxes.length}<span class="absolute left-2 top-2 rounded-full px-2 py-1 text-xs bg-accent">{selectedPiece} — SAM segment</span>{/if}
      </span>
      <span class="block text-center text-sm py-2 text-ink-mute">Drop a new image here, or click, to replace · {imageName}</span>
    {:else}
      <span class="flex flex-col items-center justify-center gap-2 py-16 px-4 text-center">
        <span aria-hidden="true" class="text-3xl text-accent">＋</span>
        <strong>Drop your image here or click to upload</strong>
        <span class="text-sm text-ink-mute">A finished piece, a sketch, anything — Burn-E will dissect it</span>
      </span>
    {/if}
  </label>
  <div class="px-3 pb-2 flex items-center justify-between">
    <span class="text-sm text-ink-mute">{group}</span>
    <button type="button" onclick={onCamera}>Use camera instead</button>
  </div>
  {#if dissection}
    <div aria-label="Dissection" class="p-3 border-t border-paper-edge">
      <p><strong>{dissection.subject}</strong> · {dissection.conversionClass} · {dissection.source === 'live' ? 'Muse Spark (live)' : 'demo analysis'}</p>
      <p class="text-sm text-ink-mute">Dissected into:</p>
      <p class="text-sm text-ink-mute">Tap a piece to inspect it:</p>
      <ul class="flex flex-wrap gap-1">{#each (dissection.pieces?.length ? dissection.pieces : dissection.piecesHint.map((n: string) => ({ name: n, kind: 'face', note: '' }))) as piece (piece.name)}
        <li><button type="button" aria-pressed={selectedPiece === piece.name} class="rounded-full px-2 py-1 text-xs {selectedPiece === piece.name ? 'bg-accent' : 'bg-paper-mute text-ink'}" onclick={() => onSelectPiece?.(piece.name)}>{piece.name}</button></li>{/each}</ul>
    </div>
  {/if}
</section>
