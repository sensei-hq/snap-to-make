<script lang="ts">
	/* The Burn-E aperture mark: an ink ring with the one vermillion dot. */
	let { size = 22, class: cls = '' }: { size?: number; class?: string } = $props();
</script>

<svg viewBox="0 0 22 22" width={size} height={size} fill="none" class={cls} aria-hidden="true">
	<circle cx="11" cy="11" r="9.25" stroke="currentColor" stroke-width="1.4" />
	<circle cx="11" cy="11" r="3" class="fill-accent" />
</svg>
