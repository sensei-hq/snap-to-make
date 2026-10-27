<script lang="ts">
import { goto } from '$app/navigation';
import { resolve } from '$app/paths';
import { onMount } from 'svelte';
onMount(() => goto(resolve('/snap')));
</script>
<p>Opening your workshop…</p>
