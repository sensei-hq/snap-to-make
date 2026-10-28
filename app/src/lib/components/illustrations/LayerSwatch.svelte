<script lang="ts">
// A layer's paper or wood colour chip. The colour depicts the material, so it is raw (from the fixture).
let { colour, size = 'md' }: { colour: string; size?: 'sm' | 'md' } = $props();
</script>
<span aria-hidden="true" class="inline-block shrink-0 rounded-sm border border-paper-edge {size === 'sm' ? 'w-3 h-3' : 'w-5 h-5'}" style="background:{colour}"></span>
