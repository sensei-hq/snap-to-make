<script lang="ts">
// Stand-in for the recorded burn clip: a birch blank with four coasters, one flaring. Raw colour depicts the video.
let { flareAt = 2 }: { flareAt?: number } = $props();
const spots = [[110, 92], [250, 92], [110, 182], [250, 182]];
</script>
<svg viewBox="0 0 360 260" class="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
  <rect width="360" height="260" fill="#10151C" />
  <g transform="rotate(-3 180 136)">
    <rect x="58" y="42" width="244" height="190" rx="4" fill="#C9B18A" />
    {#each spots as [x, y], i (i)}
      <circle cx={x} cy={y} r="30" fill={i === flareAt ? 'rgba(255,120,40,.35)' : 'none'} stroke={i === flareAt ? '#FF7A2E' : '#7A5A34'} stroke-width="2" />
    {/each}
  </g>
</svg>
