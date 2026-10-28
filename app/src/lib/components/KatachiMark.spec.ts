import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import config from '../../../rokkit.config.js';

// Markup check (component rendering needs Svelte's browser build, which this jsdom suite does not load).
const source = readFileSync(`${process.cwd()}/src/lib/components/KatachiMark.svelte`, 'utf8');

describe('KatachiMark keeps the logo colours of katachi.svg in both themes', () => {
  it('fills every shape with a brand colour, never the theme ink', () => {
    const fills = [...source.matchAll(/<path [^>]*class="([^"]+)"/g)].map((m) => m[1]);
    expect(fills).toEqual(['fill-brand-stone', 'fill-brand-ink', 'fill-brand-tan', 'fill-brand-ink']);
    expect(source).not.toMatch(/fill="currentColor"/);
  });
  it('declares the logo ink #25282D as a brand token', () => {
    expect((config.overrides as unknown as Record<string, string>)['brand-ink']).toBe('#25282D');
  });
});
