<script lang="ts">
let { imageUrl, pieces }: { imageUrl?: string; pieces: { name: string; kind: string }[] } = $props();
</script>
<!-- How the photo splits: source, then pieces front-to-back as an exploded stack -->
<section aria-label="How the photo splits" class="bg-paper-soft border border-paper-edge rounded-lg p-3">
  <h3 class="text-ink font-semibold mb-2">How the photo splits into segments</h3>
  <div class="flex items-center gap-2 overflow-x-auto pb-1">
    {#if imageUrl}<img src={imageUrl} alt="Source" class="w-20 h-20 object-cover rounded-md shrink-0" />{/if}
    {#each pieces as p, i (p.name)}
      <span aria-hidden="true" class="text-ink-faint shrink-0">→</span>
      <div class="rounded-lg px-3 py-2 shrink-0 text-center" style="background:var(--paper-mute);transform:translateY({(i % 3) * 4 - 4}px)">
        <p class="text-xs text-ink-mute">{p.kind}</p><p class="text-sm text-ink">{p.name}</p>
      </div>
    {/each}
  </div>
  <p class="text-ink-mute text-sm mt-1">Front pieces first, joins and base last — the order you will cut and stack them.</p>
</section>
