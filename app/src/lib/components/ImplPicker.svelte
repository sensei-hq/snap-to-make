<script lang="ts">
import { Toggle } from '@rokkit/ui';
let { value, onSelect }: { value: string; onSelect: (id: string) => void } = $props();
const options = [{ label: 'Laser', value: 'laser' }, { label: 'Cricut · P2', value: 'cricut' }, { label: '3D print · P2', value: 'printer3d' }];
</script>
<fieldset class="flex flex-col gap-2 px-5"><legend class="eyebrow mb-2">Make it with…</legend>
<Toggle {options} {value} showLabels onchange={(v) => onSelect(String(v))} />
<p class="text-ui text-ink-mute">Laser exports G-code/SVG now. Cricut and 3D print preview in Phase 2.</p>
</fieldset>
