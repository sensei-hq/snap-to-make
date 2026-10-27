<script lang="ts">
import { BatchState } from '$lib/state/batch.svelte';
import ScreenHeader from '$lib/components/ScreenHeader.svelte';
import AppNav from '$lib/components/AppNav.svelte';
import { UiState } from '$lib/state/ui.svelte';
const batch = new BatchState();
const ui = new UiState();
let names = $state('Maya, Leo, Priya');
</script>
<div class="phone-col">
  <ScreenHeader title="Batch project" subtitle="star ornaments · Muse Wonder" pill="background" onToggleMode={() => ui.toggleMode()} />
  <AppNav current="batch" />
  <main class="px-5 py-4 flex flex-col gap-4">
    <p>Star ornaments, 3 inch, birch 3 mm — runs in the background, never blocks the workshop.</p>
    <label class="flex flex-col gap-1 text-sm">Names (comma separated)
      <input bind:value={names} class="rounded-lg px-3 py-2.5" style="background:var(--paper);border:1px solid var(--paper-edge);color:var(--ink)" />
    </label>
    <button type="button" class="btn-ink" onclick={() => batch.start(names)}>Start batch job</button>
    {#if batch.job}<section aria-label="Production plan" class="card p-4">
      <h2 class="font-display text-lg">Production plan</h2>
      <ol class="list-decimal ml-5 mt-2 flex flex-col gap-1">{#each batch.job.steps as s (s)}<li>{s}</li>{/each}</ol>
      <p class="mt-2 text-sm" style="color:var(--ink-mute)">{batch.job.plan}</p>
    </section>{/if}
  </main>
</div>
