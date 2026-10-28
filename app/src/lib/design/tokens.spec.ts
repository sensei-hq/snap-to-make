import { describe, expect, it } from 'vitest';
import config from '../../../rokkit.config.js';
import { sumiPalette } from './sumi-palette.js';

// The design mock (mockups/svelte/src/lib/design/katachi.uno.js) is the source of truth.
// Its roles map onto Rokkit named tokens: bg→paper, surface→paper-soft, sunken→paper-mute,
// line→paper-edge, fg→ink, muted→ink-mute, faint→ink-soft, ghost→ink-faint, action→primary.
const MOCK = {
  light: {
    paper: '0.975 0.008 85', 'paper-soft': '0.955 0.010 85', 'paper-mute': '0.920 0.012 85', 'paper-edge': '0.880 0.015 85',
    ink: '0.220 0.012 50', 'ink-mute': '0.380 0.012 50', 'ink-soft': '0.580 0.010 50', 'ink-faint': '0.750 0.008 50',
    accent: '0.580 0.150 35', primary: '0.220 0.012 50', 'on-primary': '0.975 0.008 85',
    success: '0.620 0.080 160', warning: '0.720 0.120 75', 'warning-ink': '0.55 0.130 60'
  },
  dark: {
    paper: '0.170 0.010 50', 'paper-soft': '0.210 0.012 50', 'paper-mute': '0.250 0.012 50', 'paper-edge': '0.300 0.010 50',
    ink: '0.940 0.008 85', 'ink-mute': '0.780 0.008 85', 'ink-soft': '0.600 0.010 85', 'ink-faint': '0.420 0.012 85',
    accent: '0.700 0.150 35', primary: '0.940 0.008 85', 'on-primary': '0.170 0.010 50',
    success: '0.720 0.090 160', warning: '0.780 0.120 75', 'warning-ink': '0.800 0.110 70'
  }
} as const;

type Mode = keyof typeof MOCK;
const overrides = config.overrides as Record<string, string | { light: string; dark: string }>;

/** Resolve an override side (`kami.100` palette ref or `oklch(L C H[ / a])`) to bare "L C H". */
function resolve(value: string): string {
  const raw = value.match(/^oklch\(([^/)]+)/);
  if (raw) return raw[1].trim();
  const [palette, shade] = value.split('.');
  const stops = (sumiPalette as Record<string, Record<string, string>>)[palette];
  if (!stops?.[shade]) throw new Error(`unknown palette ref ${value}`);
  return stops[shade];
}
function token(name: string, mode: Mode): string {
  const o = overrides[name];
  if (!o) throw new Error(`missing override ${name}`);
  return resolve(typeof o === 'string' ? o : o[mode]);
}

describe('rokkit.config tokens match the design mock', () => {
  for (const mode of ['light', 'dark'] as const) {
    for (const [name, value] of Object.entries(MOCK[mode])) {
      it(`${name} (${mode}) = oklch(${value})`, () => expect(token(name, mode)).toBe(value));
    }
  }

  it('ink ramp is monotonic (ink darker than ink-mute than ink-soft than ink-faint) in light', () => {
    const L = (n: string) => Number(token(n, 'light').split(' ')[0]);
    expect(L('ink')).toBeLessThan(L('ink-mute'));
    expect(L('ink-mute')).toBeLessThan(L('ink-soft'));
    expect(L('ink-soft')).toBeLessThan(L('ink-faint'));
  });

  it('cut lines use the accent and engrave lines use ink, like the mock Make screen', () => {
    for (const mode of ['light', 'dark'] as const) {
      expect(token('cut', mode)).toBe(token('accent', mode));
      expect(token('engrave', mode)).toBe(token('ink', mode));
    }
  });

  it('drops the superseded Workshop tokens', () => {
    for (const legacy of ['ember', 'charcoal', 'soot', 'ash', 'birch', 'reference']) expect(overrides[legacy]).toBeUndefined();
  });

  it('uses the mock type faces', () => {
    const t = config.typography as Record<string, string>;
    expect(t.display).toMatch(/^'Fraunces'/);
    expect(t.sans).toMatch(/^'Inter'/);
    expect(t.mono).toMatch(/^'JetBrains Mono'/);
  });
});

describe('Katachi brand tokens', () => {
  it('declares the mark layer colours from katachi.svg as named tokens (fixed in both modes)', () => {
    expect(overrides['brand-tan']).toBe('#D8AE82');
    expect(overrides['brand-stone']).toBe('#DDD8D0');
  });

  it('keeps colour out of uno.config.js (presetRokkit owns every colour)', async () => {
    const { readFileSync } = await import('node:fs');
    const uno = readFileSync(`${process.cwd()}/uno.config.js`, 'utf8');
    expect(uno).not.toMatch(/#[0-9a-fA-F]{3,8}\b/);
  });
});
