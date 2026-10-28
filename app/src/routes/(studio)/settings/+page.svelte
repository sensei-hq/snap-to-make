<script lang="ts">
import { vibe } from '@rokkit/states';
import { Card, List, Toggle } from '@rokkit/ui';
import { ThemeSwitcherToggle } from '@rokkit/app';
import { ADAPTERS } from '$lib/devices/registry';
import { useApp } from '$lib/state/context';
const app = useApp();
app.setScreen('Settings', 'devices · workspace');
const densities = [{ label: 'Comfortable', value: 'comfortable' }, { label: 'Compact', value: 'compact' }];
const devices = Object.values(ADAPTERS).map((a) => ({ label: a.label, value: a.id, kind: a.kind }));
</script>
<svelte:head><title>Katachi · Settings</title></svelte:head>
<div class="stage gap-4 p-4">
  <section aria-label="Devices" class="flex flex-col gap-2">
    <h2 class="panel-title">Devices</h2>
    <Card><List items={devices}>{#snippet itemContent(proxy)}<span class="flex-1">{proxy.label}</span><span class="meta">{proxy.get('kind')}</span>{/snippet}</List></Card>
  </section>
  <section aria-label="Workspace" class="flex flex-col gap-3">
    <h2 class="panel-title">Workspace</h2>
    <p class="eyebrow">Density</p>
    <Toggle options={densities} value={vibe.density} showLabels onchange={(v) => app.setDensity(v as 'comfortable' | 'compact')} />
    <p class="eyebrow">Theme</p>
    <ThemeSwitcherToggle variant="triad" />
  </section>
</div>
