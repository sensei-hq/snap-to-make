<script lang="ts">
// Stand-in for the live camera feed (mock SnapCapture). Raw colour depicts the photo.
let { showScene = true }: { showScene?: boolean } = $props();
</script>
<svg viewBox="0 0 366 560" class="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
  <rect width="366" height="560" fill="#2B231A" />
  {#if showScene}
    <g transform="rotate(-6 120 200)">
      <rect x="40" y="120" width="170" height="210" fill="#F3EEE3" />
      <path d="M78 280V170l47 65 47-65v110" stroke="#3A352C" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round" />
    </g>
    <circle cx="272" cy="270" r="66" fill="#E8E2D6" /><circle cx="272" cy="270" r="52" fill="#5B4A3A" />
    <g transform="rotate(8 200 430)"><rect x="140" y="390" width="128" height="81" rx="6" fill="#2D5E8C" /><rect x="156" y="420" width="22" height="16" rx="2" fill="#D9B45A" /></g>
  {/if}
  <path d="M24 24h34M24 24v34M342 24h-34M342 24v34M24 536h34M24 536v-34M342 536h-34M342 536v-34" stroke="#fff" stroke-opacity=".85" stroke-width="2.5" fill="none" stroke-linecap="round" />
</svg>
