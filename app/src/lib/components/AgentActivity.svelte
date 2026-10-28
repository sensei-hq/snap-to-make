<script lang="ts">
// What the Meta models and agents did on this step, for this craft. Presentation only: AppState.activity() feeds it.
// Placeholder jobs are labelled so nobody mistakes a fixture for a live model result.
let { items }: { items: { key: string; model: string; status: 'running' | 'done' | 'placeholder' | 'failed'; summary: string }[] } = $props();
const icon = { running: 'i-solar:refresh-linear animate-spin', done: 'i-solar:check-circle-linear text-success', placeholder: 'i-solar:check-circle-linear text-ink-soft', failed: 'i-solar:danger-triangle-linear text-danger' } as const;
</script>
{#if items.length}
  <ul aria-label="Katachi's models on this step" class="flex flex-wrap gap-x-4 gap-y-1 px-4 py-1.5 md:px-5 bg-paper-soft hair-b" aria-live="polite">
    {#each items as t (t.key)}
      <li class="flex items-center gap-1.5 text-ui text-ink-mute min-w-0">
        <span class="{icon[t.status]} shrink-0" aria-hidden="true"></span>
        <span class="meta text-ink whitespace-nowrap">{t.model}</span>
        <span class="truncate">{t.summary}</span>
        {#if t.status === 'placeholder'}<span class="meta rounded-full border border-paper-edge px-1.5" title="Returns a fixture in the live call's shape until this model is wired">placeholder</span>{/if}
      </li>
    {/each}
  </ul>
{/if}
