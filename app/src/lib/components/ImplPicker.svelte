<script lang="ts">
import { Toggle } from '@rokkit/ui';
let { value, onSelect }: { value: string; onSelect: (id: string) => void } = $props();
const options = [{ text: 'Laser', value: 'laser' }, { text: 'Cricut · P2', value: 'cricut' }, { text: '3D print · P2', value: 'printer3d' }];
</script>
<fieldset class="flex flex-col gap-2 px-5"><legend class="font-semibold">Make it with…</legend>
<Toggle {options} {value} onchange={(v) => onSelect(String(v))} />
<p class="text-xs" style="color:var(--ink-mute)">Laser exports G-code/SVG now. Cricut and 3D print preview in Phase 2.</p>
</fieldset>
