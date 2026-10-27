// Burn-E Workshop — Rokkit named-token config (Workshop style, docs/prd/07-design-language.md)
import { sumiPalette } from './src/lib/sumi-palette.js';
export default {
  palettes: sumiPalette,
  colorSpace: 'oklch',
  skin: {
    surface: { light: 'kami', dark: 'sumi' },
    ink: { light: 'kami', dark: 'sumi' },
    primary: 'shu', secondary: 'murasaki', accent: 'shu',
    success: 'hisui', warning: 'kohaku', danger: 'beni', error: 'beni', info: 'ai'
  },
  overrides: {
    paper: { light: 'kami.100', dark: 'sumi.50' },
    'paper-soft': { light: 'kami.200', dark: 'sumi.100' },
    'paper-mute': { light: 'kami.300', dark: 'sumi.200' },
    'paper-edge': { light: 'kami.400', dark: 'sumi.300' },
    ink: { light: 'kami.900', dark: 'sumi.900' },
    'ink-soft': { light: 'kami.700', dark: 'sumi.800' },
    'ink-mute': { light: 'kami.600', dark: 'sumi.700' },
    'ink-faint': { light: 'kami.500', dark: 'sumi.600' },
    accent: { light: 'shu.500', dark: 'shu.400' },
    primary: { light: 'kami.900', dark: 'sumi.900' },
    'on-primary': { light: 'kami.100', dark: 'sumi.50' },
    success: { light: 'hisui.500', dark: 'hisui.400' },
    warning: { light: 'kohaku.500', dark: 'kohaku.400' },
    danger: { light: 'beni.500', dark: 'beni.400' },
    info: { light: 'ai.500', dark: 'ai.400' },
    // Workshop tokens (PRD 07): ember primary, cut red, engrave blue, reference amber
    ember: '#FF8A1F', cut: '#E5484D', engrave: '#3E8BFF', reference: '#F5B83D',
    charcoal: '#16140F', soot: '#221F19', ash: '#3A352C', birch: '#EAD9B8'
  },
  typography: {
    sans: "'Inter Variable', 'Inter', system-ui, sans-serif",
    mono: "'JetBrains Mono', 'SF Mono', Menlo, monospace",
    display: "Georgia, 'Iowan Old Style', 'Times New Roman', serif"
  },
  shape: { radius: 'soft' },
  icons: { solar: '@iconify-json/solar/icons.json', overrides: {} },
  switcher: 'manual',
  storageKey: 'burn-e-theme'
};
