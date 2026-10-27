<script lang="ts">
// Stand-in for the captured photo with SAM outlines (mock SceneCard). Raw colour depicts the photo.
let { masks = 3, diameterLabel = 'Ø 82 mm ±2', artLabel = '62 × 58 mm' }: { masks?: number; diameterLabel?: string; artLabel?: string } = $props();
</script>
<figure class="relative m-0 h-67 rounded-lg overflow-hidden bg-[#2B231A]">
  <svg viewBox="0 0 358 268" class="absolute inset-0 w-full h-full" role="img" aria-label="Scene photo with measured masks">
    <g transform="rotate(-6 90 100)">
      <rect x="24" y="36" width="122" height="148" fill="#F3EEE3" />
      <path d="M50 150V74l35 46 35-46v76" stroke="#3A352C" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round" />
      <rect x="40" y="62" width="94" height="100" rx="3" fill="rgba(243,238,227,.1)" stroke="#F3EEE3" stroke-width="2" stroke-dasharray="5 4" />
    </g>
    <circle cx="262" cy="104" r="50" fill="#E8E2D6" /><circle cx="262" cy="104" r="39" fill="#5B4A3A" />
    <circle cx="262" cy="104" r="50" fill="rgba(217,101,63,.14)" stroke="#D9653F" stroke-width="2.2" />
    <g transform="rotate(8 196 222)"><rect x="150" y="194" width="92" height="58" rx="5" fill="#2D5E8C" stroke="#F5B83D" stroke-width="2.2" /></g>
    <path d="M212 104h100" stroke="#fff" stroke-width="1.2" stroke-dasharray="1 3" />
  </svg>
  <span class="absolute left-3 top-3 font-mono text-micro font-medium px-2 py-1 rounded-full bg-[#0B0F15cc] text-[#E6E9EF]">SAM 3.1 · {masks} masks</span>
  <span class="absolute left-54 top-41 font-mono text-micro font-semibold px-2 py-1 rounded bg-[#0B0F15cc] text-white">{diameterLabel}</span>
  <span class="absolute left-5 top-51 font-mono text-micro font-semibold px-2 py-1 rounded bg-[#0B0F15cc] text-white">{artLabel}</span>
</figure>
