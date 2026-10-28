import { describe, expect, it } from 'vitest';
import { MemoryStorage, ProjectStore, projectName, type ProjectRecord } from './project.svelte';

const rec = (id: string, updatedAt: number, name = id): ProjectRecord => ({
  id, name, createdAt: updatedAt, updatedAt, reached: 0, kind: 'flat', path: '/make/import', image: '', choices: {}
});

describe('project name from the first step', () => {
  it('an upload is named after its file', () => {
    expect(projectName({ fileName: 'alpine-forest.png', at: new Date(2026, 9, 28, 14, 5) })).toBe('Alpine forest');
    expect(projectName({ fileName: 'IMG_2041.HEIC', at: new Date(2026, 9, 28, 14, 5) })).toBe('IMG 2041');
  });
  it('a camera shot is named by when it was taken', () => {
    expect(projectName({ at: new Date(2026, 9, 28, 14, 5) })).toBe('Photo · 28 Oct, 14:05');
  });
});

describe('ProjectStore · saved projects (browser storage)', () => {
  it('saves, lists newest first, loads and remembers the current one', () => {
    const store = new ProjectStore(new MemoryStorage());
    store.save(rec('a', 1)); store.save(rec('b', 3)); store.save(rec('c', 2));
    expect(store.list().map((p) => p.id)).toEqual(['b', 'c', 'a']);
    store.save({ ...rec('a', 5), name: 'Renamed' });
    expect(store.list()[0]).toMatchObject({ id: 'a', name: 'Renamed' });
    expect(store.list()).toHaveLength(3);
    expect(store.load('c')?.updatedAt).toBe(2);
    store.setCurrent('c');
    expect(store.current()).toBe('c');
    store.remove('c');
    expect([store.load('c'), store.current()]).toEqual([null, null]);
  });
  it('survives corrupt storage', () => {
    const s = new MemoryStorage(); s.setItem('katachi.projects', '{nope');
    expect(new ProjectStore(s).list()).toEqual([]);
  });
});
