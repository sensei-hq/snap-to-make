<script lang="ts">
// Katachi the assistant (the brand mark stays in the nav only).
let { size = 'md' }: { size?: 'sm' | 'md' } = $props();
</script>
<span aria-hidden="true" class="shrink-0 grid place-items-center rounded-full bg-accent-soft text-accent {size === 'sm' ? 'w-5 h-5 text-ui' : 'w-7 h-7 text-lede'}">
  <span class="i-solar:stars-minimalistic-linear"></span>
</span>
