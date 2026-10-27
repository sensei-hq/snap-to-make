<script lang="ts">
	/* The engraved M on birch. `variant` picks one of the three Muse Image
	   takes; `original` draws the pencil sketch. Pure drawing, no state. */
	let {
		variant,
		size = 70
	}: { variant: 'take-1' | 'take-2' | 'take-3' | 'original'; size?: number } = $props();

	const ink = 'stroke-[#5B3A1E]';
</script>

<svg viewBox="0 0 60 60" width={size} height={size} aria-hidden="true">
	{#if variant === 'original'}
		<path d="M12 48V14l18 22 18-22v34" class="stroke-[#5A5248]" stroke-width="2" fill="none" stroke-linecap="round" stroke-dasharray="3 1.5" />
		<path d="M48 14c6-6 10-5 12-10" class="stroke-[#5A5248]" stroke-width="1.5" fill="none" />
	{:else if variant === 'take-1'}
		<path d="M12 48V14l18 22 18-22v34" class={ink} stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" />
	{:else if variant === 'take-2'}
		<path d="M12 48V14l18 22 18-22v34" class={ink} stroke-width="4.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />
		<path d="M48 14c4-7 9-8 12-12-6 0-11 4-12 12Zm0 0c-2-6-6-9-11-10 1 5 5 9 11 10Z" class="fill-[#5B3A1E]" />
	{:else}
		<path d="M12 48V14l18 22 18-22v34" class={ink} stroke-width="1.6" fill="none" stroke-linejoin="round" />
		<path d="M16 48V22l14 18 14-18v26" class={ink} stroke-width="1.6" fill="none" stroke-linejoin="round" />
		<circle cx="30" cy="52" r="2" class="fill-[#5B3A1E]" />
	{/if}
</svg>
