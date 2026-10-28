<script lang="ts">
import { provideApp } from '$lib/state/context';
let { children } = $props();
// The one AppState for every /snap page (gate, camera and the studio sections).
provideApp();
</script>
{@render children()}
