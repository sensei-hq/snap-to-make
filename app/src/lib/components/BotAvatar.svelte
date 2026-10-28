<script lang="ts">
// Katachi the assistant: the mock's agent dot (the brand mark stays in the nav only).
let { size = 'md' }: { size?: 'sm' | 'md' } = $props();
</script>
<span aria-hidden="true" class="shrink-0 grid place-items-center rounded-full bg-accent-soft {size === 'sm' ? 'w-5 h-5' : 'w-6 h-6'}">
  <span class="w-2 h-2 rounded-full bg-accent"></span>
</span>
