<script lang="ts">
let { steps }: { steps: string[] } = $props();
let t = $state(0);
</script>
<section aria-label="Assembly" class="card rounded-xl p-4" style="background:var(--paper-soft)">
<h2 class="font-semibold">Assembly playback</h2>
<label>Exploded ↔ Assembled <input type="range" min="0" max="100" bind:value={t} /></label>
<p>{t < 50 ? 'Exploded: flat pieces' : 'Assembled: finished object'}</p>
<ol>{#each steps as s (s)}<li>{s}</li>{/each}</ol>
</section>
