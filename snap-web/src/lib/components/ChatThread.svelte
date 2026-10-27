<script lang="ts">
let { messages }: { messages: { role: string; text: string }[] } = $props();
</script>
<section aria-label="Guided chat" class="flex flex-col gap-2">
  {#each messages as m, i (i)}
    <div class="flex gap-2 {m.role === 'user' ? 'justify-end' : ''}">
      {#if m.role === 'burn-e'}<span aria-hidden="true" class="w-6 h-6 rounded-full shrink-0 bg-accent"></span>{/if}
      <p class="rounded-xl px-3 py-2 max-w-[85%] {m.role === 'user' ? 'bg-paper-mute text-ink' : 'bg-paper-soft text-ink'}">{m.text}</p>
    </div>
  {/each}
</section>
