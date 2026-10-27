<script lang="ts">
import 'uno.css';
import '../app.css';
import { vibe } from '@rokkit/states';
import { themable } from '@rokkit/actions';
let { children } = $props();
vibe.allowedStyles = ['zen-sumi'];
vibe.style = 'zen-sumi';
vibe.mode = 'light';
vibe.density = 'comfortable';
</script>
<svelte:body use:themable={{ theme: vibe, storageKey: 'burn-e-theme' }} />
{@render children()}
