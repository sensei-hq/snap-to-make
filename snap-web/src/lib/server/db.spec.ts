import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
// Stage 00 contract: dbd DDL is source of truth (one file per table), seeding via file import.
const DB = join(process.cwd(), '..', 'database');
describe('dbd snap schema files', () => {
  const tables = ['sessions', 'media', 'scenes', 'objects', 'impls', 'trace_events', 'batch_jobs', 'invites'];
  it.each(tables)('has one DDL file per table: %s', (t) => {
    expect(existsSync(join(DB, 'ddl/table/snap', `${t}.ddl`))).toBe(true);
    expect(existsSync(join(DB, 'policies/snap', `${t}.sql`))).toBe(true);
  });
  it('seeds invites via CSV + import procedure, not supabase seed', () => {
    expect(readFileSync(join(DB, 'import/staging/snap_invites.csv'), 'utf8')).toContain('DEMO-JUDGES');
    expect(existsSync(join(DB, 'ddl/procedure/staging/import_snap_invites.ddl'))).toBe(true);
  });
});
