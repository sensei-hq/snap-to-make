import type { Kind } from '../content/layers';

/** One saved piece of work: what was captured, how far the flow got, and every choice made on the way. */
export interface ProjectRecord {
  id: string;
  name: string;
  createdAt: number;
  updatedAt: number;
  /** index into the flow steps of the furthest step reached (-1 = nothing captured yet) */
  reached: number;
  kind: Kind;
  /** the flow page last open, so Open lands where you left off */
  path: string;
  /** a downscaled copy of the first captured image (data URL), or '' */
  image: string;
  /** LayerFlowState.snapshot() */
  choices: Record<string, unknown>;
}

/** The slice of the Web Storage API the store needs (localStorage in the browser, memory in tests and SSR). */
export interface KeyValueStorage { getItem(key: string): string | null; setItem(key: string, value: string): void; removeItem(key: string): void }

export class MemoryStorage implements KeyValueStorage {
  private data: Record<string, string> = {};
  getItem(key: string) { return this.data[key] ?? null; }
  setItem(key: string, value: string) { this.data[key] = value; }
  removeItem(key: string) { delete this.data[key]; }
}

const LIST = 'katachi.projects';
const CURRENT = 'katachi.current';

/** Saved projects in browser storage (server-side projects are P2, R-PL-6). */
export class ProjectStore {
  constructor(private storage: KeyValueStorage = new MemoryStorage()) {}
  private read(): ProjectRecord[] {
    try {
      const v = JSON.parse(this.storage.getItem(LIST) ?? '[]');
      return Array.isArray(v) ? v : [];
    } catch { return []; }
  }
  private write(list: ProjectRecord[]) { this.storage.setItem(LIST, JSON.stringify(list)); }
  /** newest first */
  list(): ProjectRecord[] { return this.read().sort((a, b) => b.updatedAt - a.updatedAt); }
  load(id: string): ProjectRecord | null { return this.read().find((p) => p.id === id) ?? null; }
  save(p: ProjectRecord) { this.write([...this.read().filter((x) => x.id !== p.id), p]); }
  remove(id: string) {
    this.write(this.read().filter((p) => p.id !== id));
    if (this.current() === id) this.storage.removeItem(CURRENT);
  }
  current(): string | null { return this.storage.getItem(CURRENT); }
  setCurrent(id: string | null) { if (id) this.storage.setItem(CURRENT, id); else this.storage.removeItem(CURRENT); }
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const two = (n: number) => String(n).padStart(2, '0');

/** A project is named by its first step: an upload after its file, a camera shot by when it was taken. */
export function projectName({ fileName, at }: { fileName?: string; at: Date }): string {
  const base = fileName?.replace(/\.[a-z0-9]+$/i, '').replace(/[-_]+/g, ' ').trim();
  if (base) return base[0].toUpperCase() + base.slice(1);
  return `Photo · ${at.getDate()} ${MONTHS[at.getMonth()]}, ${two(at.getHours())}:${two(at.getMinutes())}`;
}
