import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
let bad = [];
function walk(dir) { for (const n of readdirSync(dir)) { const p = join(dir, n); if (statSync(p).isDirectory()) walk(p); else if (/\.(svelte|ts)$/.test(n) && !p.includes('+server')) { const t = readFileSync(p, 'utf8'); if (/fetch\(|\$lib\/server/.test(t)) bad.push(p); } } }
walk('src/lib/components'); walk('src/routes');
if (bad.length) { console.error('Architecture violation (fetch/server import in presentation):', bad); process.exit(1); }
console.log('arch ok: presentation has no fetch/server imports');
