<script lang="ts">
import 'uno.css';
import '../app.css';
import { browser } from '$app/environment';
import { vibe } from '@rokkit/states';
import { themable } from '@rokkit/actions';
import config from '../../rokkit.config.js';
let { children } = $props();
vibe.allowedStyles = ['zen-sumi'];
vibe.style = 'zen-sumi';
// Load the persisted theme before any child (ThemeSwitcherToggle) mounts and adopts vibe's default mode.
if (browser) vibe.load(config.storageKey);
</script>
<svelte:body use:themable={{ theme: vibe, storageKey: config.storageKey }} />
{@render children()}
