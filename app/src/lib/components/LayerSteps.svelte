<script lang="ts">
// Phone step strip (mockups/mobile 01–07): one bar per step, then "04 / 07 · Layers" and "next · gaps".
let { step }: { step: { n: number; total: number; label: string; next: string | null } } = $props();
const pad = (n: number) => String(n).padStart(2, '0');
</script>
<nav aria-label="Image to layers steps" class="px-4 pt-2.5">
  <div class="flex gap-1" aria-hidden="true">
    {#each Array.from({ length: step.total }, (_, i) => i + 1) as i (i)}
      <span class="flex-1 h-[3px] rounded-sm {i < step.n ? 'bg-ink-soft' : i === step.n ? 'bg-accent' : 'bg-paper-edge'}"></span>
    {/each}
  </div>
  <p class="flex justify-between mt-1.75"><span class="meta text-ink">{pad(step.n)} / {pad(step.total)} · {step.label}</span><span class="meta">{step.next ? `next · ${step.next}` : 'last step'}</span></p>
</nav>
