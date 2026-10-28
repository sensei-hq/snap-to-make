<script lang="ts">
import { Table } from '@rokkit/ui';
import { materialPresets } from '$lib/content/materials';
import { useApp } from '$lib/state/context';
const app = useApp();
app.setScreen('Materials', 'Longer Ray 5 · starting presets');
const columns = [
  { name: 'name', label: 'Material' }, { name: 'thickness', label: 'Thickness' }, { name: 'cut', label: 'Cut' },
  { name: 'engrave', label: 'Engrave' }, { name: 'kerf', label: 'Kerf' }
];
const rows = materialPresets.map((m) => ({ id: m.id, name: m.name, thickness: `${m.thicknessMm} mm`, cut: m.cut, engrave: m.engrave, kerf: `${m.kerfMm} mm` }));
</script>
<svelte:head><title>Katachi · Materials</title></svelte:head>
<div class="stage md:max-w-[960px] gap-4 p-4">
  <p class="text-ui text-ink-mute">Starting points for a 10 W diode laser. Test on scrap: power, speed and kerf vary by batch.</p>
  <Table data={rows} {columns} caption="Material presets" />
</div>
