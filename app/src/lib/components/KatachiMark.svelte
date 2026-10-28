<script lang="ts">
	/* The Katachi mark: a K built from an ink bar and three stacked layers (repo root katachi.svg).
	   Ink parts follow currentColor so the mark works in both themes; the two layer
	   colours are named brand tokens (uno.config.js: fill-brand-tan, fill-brand-stone). */
	let { size = 22, class: cls = '' }: { size?: number; class?: string } = $props();
</script>

<svg viewBox="26 26 204 204" width={size} height={size} fill="none" class={cls} aria-hidden="true">
	<path d="M168 134L220 169.532L168 206L116 169.532L168 134Z" class="fill-brand-stone" />
	<path d="M36 66.1304L96.3804 31V224.217L36 190.185V66.1304Z" fill="currentColor" />
	<path d="M168 92L220 127.039L168 163L116 127.039L168 92Z" class="fill-brand-tan" />
	<path d="M168 50L220 85.039L168 121L116 85.039L168 50Z" fill="currentColor" />
</svg>
