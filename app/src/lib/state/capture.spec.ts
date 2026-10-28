import { describe, expect, it } from 'vitest';
import { CaptureState } from './capture.svelte';

const img = (n: string) => `data:image/png;base64,${n}`;

describe('CaptureState · one wizard for camera and upload', () => {
  it('defaults to a single shot from the camera with the grid guide off', () => {
    const c = new CaptureState();
    expect([c.mode, c.source, c.showGrid]).toEqual(['single', 'camera', false]);
    expect(c.slots.map((s) => s.id)).toEqual(['photo']);
    expect(c.current?.id).toBe('photo');
    expect(c.done).toBe(false);
  });

  it('a shot fills the current slot; single mode is then done', () => {
    const c = new CaptureState();
    c.capture(img('a'));
    expect(c.slots[0]).toMatchObject({ id: 'photo', url: img('a'), source: 'camera' });
    expect(c.done).toBe(true);
    expect(c.media.map((m) => m.url)).toEqual([img('a')]);
  });

  it('multi-shot walks the six sides in order and says which side is next', () => {
    const c = new CaptureState();
    c.setMode('multi');
    expect(c.slots.map((s) => s.id)).toEqual(['front', 'right', 'back', 'left', 'top', 'base']);
    expect(c.prompt).toBe('Shoot the front · 1 of 6');
    c.capture(img('f')); c.capture(img('r'));
    expect(c.current?.id).toBe('back');
    expect(c.prompt).toBe('Shoot the back · 3 of 6');
  });

  it('retake clears a side and makes it current', () => {
    const c = new CaptureState();
    c.setMode('multi');
    c.capture(img('f')); c.capture(img('r')); c.capture(img('b'));
    c.retake('right');
    expect(c.slots.find((s) => s.id === 'right')?.url).toBeUndefined();
    expect(c.current?.id).toBe('right');
    c.capture(img('r2'));
    expect(c.slots.find((s) => s.id === 'right')?.url).toBe(img('r2'));
    expect(c.current?.id).toBe('left');
  });

  it('uploads fill empty slots in order and mix with camera shots', () => {
    const c = new CaptureState();
    c.setMode('multi');
    c.capture(img('f'));
    c.setSource('upload');
    c.upload([img('u1'), img('u2')]);
    expect(c.slots.slice(0, 3).map((s) => [s.id, s.url, s.source])).toEqual([
      ['front', img('f'), 'camera'], ['right', img('u1'), 'upload'], ['back', img('u2'), 'upload']
    ]);
  });

  it('switching mode carries shots over (the single photo becomes the front)', () => {
    const c = new CaptureState();
    c.capture(img('a'));
    c.setMode('multi');
    expect(c.slots[0]).toMatchObject({ id: 'front', url: img('a') });
    expect(c.current?.id).toBe('right');
    c.setMode('single');
    expect(c.slots[0]).toMatchObject({ id: 'photo', url: img('a') });
  });

  it('selects a captured image to view it full size, and toggles the 3×3 grid', () => {
    const c = new CaptureState();
    c.setMode('multi');
    c.capture(img('f')); c.capture(img('r'));
    c.view('front');
    expect(c.viewing?.url).toBe(img('f'));
    c.toggleGrid();
    expect(c.showGrid).toBe(true);
  });
});

describe('the capture stage shows what was captured', async () => {
  const { CaptureState } = await import('./capture.svelte');
  it('the photo appears as soon as it is taken; a picked slot wins', () => {
    const c = new CaptureState();
    expect(c.shown).toBeNull();
    c.upload(['data:a']);
    expect(c.shown?.url).toBe('data:a');
    c.setMode('multi');
    expect(c.shown).toBeNull();
    c.view('front');
    expect(c.shown?.url).toBe('data:a');
  });
});
