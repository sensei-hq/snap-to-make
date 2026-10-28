import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const presentation = ['src/lib/components', 'src/routes'];
// Illustrations draw stand-ins for photographs (wood, mug, card); raw colour is the subject there, not UI chrome.
const illustrations = 'src/lib/components/illustrations';

const rawColour = /#[0-9a-fA-F]{3,8}\b|\b(?:rgba?|hsla?|oklch)\(/;
const inlineColourStyle = /style="[^"]*\b(?:color|background|border(?:-[a-z]+)?|outline|fill|stroke)\s*:/;
const emojiIcon = /[\u{1F300}-\u{1FAFF}☀-➿]/u;

const failures = { fetch: [], colour: [], style: [], emoji: [], state: [], link: [] };
// Rokkit Button renders target="_self" by default; SvelteKit treats any target as external and reloads
// the page (wiping AppState). Every Button link must pass target="".
const buttonLink = /<Button\b[^\n]*\bhref=/;
// Pages read the shared AppState (useApp()); only the snap layout constructs state.
const stateOwner = 'src/routes/snap/+layout.svelte';
const newState = /new [A-Z][A-Za-z]*State\(/;
function walk(dir) {
  for (const n of readdirSync(dir)) {
    const p = join(dir, n);
    if (statSync(p).isDirectory()) { walk(p); continue; }
    if (!/\.(svelte|ts)$/.test(n) || /\.spec\.ts$/.test(n) || p.includes('+server')) continue;
    const t = readFileSync(p, 'utf8');
    if (/fetch\(|\$lib\/server/.test(t)) failures.fetch.push(p);
    if (p.startsWith('src/routes') && p !== stateOwner && newState.test(t)) failures.state.push(p);
    if (!n.endsWith('.svelte') || p.startsWith(illustrations)) continue;
    t.split('\n').forEach((line, i) => {
      const at = `${p}:${i + 1}`;
      if (rawColour.test(line)) failures.colour.push(at);
      if (inlineColourStyle.test(line)) failures.style.push(at);
      if (emojiIcon.test(line)) failures.emoji.push(at);
      if (buttonLink.test(line) && !/target=""/.test(line)) failures.link.push(at);
    });
  }
}
presentation.forEach(walk);

const messages = {
  fetch: 'fetch/server import in presentation',
  colour: 'raw colour literal outside src/lib/components/illustrations (use a named token)',
  style: 'inline colour style (use token utilities: bg-paper, text-ink-mute, border-paper-edge…)',
  emoji: 'emoji used as an icon (use a Solar icon class)',
  state: 'page constructs its own state (read the shared AppState via useApp())',
  link: 'Rokkit Button link without target="" (its default target="_self" makes SvelteKit reload the page)'
};
let failed = false;
for (const [k, list] of Object.entries(failures)) {
  if (!list.length) continue;
  failed = true;
  console.error(`Architecture violation — ${messages[k]}:\n  ${list.join('\n  ')}`);
}
if (failed) process.exit(1);
console.log('arch ok: presentation has no fetch/server imports, raw colours, inline colour styles or emoji icons');
