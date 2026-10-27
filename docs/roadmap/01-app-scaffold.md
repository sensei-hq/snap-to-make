# Stage 01 — App scaffold (Dojo fork, Rokkit, PWA, no Kavach) · AUTO

Prereqs: Stage 00 exit. Reference: `~/Developer/sensei-hq/sensei/dojo` (read its `package.json`, `vite.config.ts`, `svelte.config.js`, `uno.config.js`, `rokkit.config.js`, `src/hooks.server.ts` — copy patterns, not Kavach).

## Target layout (`snap-web/`, new app)

```
snap-web/
  package.json  svelte.config.js  vite.config.ts  uno.config.js  rokkit.config.js
  playwright.config.ts  vitest.config.ts  .env.example
  src/app.html  src/app.css  src/service-worker.ts  src/app.d.ts
  src/lib/{domain,devices,state,components,server}/   (empty barrels this stage)
  src/routes/+layout.svelte  src/routes/+page.svelte (redirect /snap)
  src/routes/snap/+page.svelte  (Workshop shell placeholder, Rokkit)
  static/manifest.webmanifest  static/favicon.svg  static/icons/
  tests/e2e/smoke.spec.ts
```

## Rules

- No `@kavach/*`, no `kavach.config.js`, no `kavach()` Vite plugin, no `$kavach/*` imports. Grep gate at exit.
- Rokkit only for UI: `@rokkit/ui|app|states|actions|themes|unocss|icons` ^1.9, UnoCSS `presetRokkit`, Workshop tokens as a `workshop` style in `rokkit.config.js` (`#16140F/#221F19/#FF8A1F/#E5484D/#3E8BFF/#F5B83D`, radius 10px).
- Svelte 5 runes everywhere (`$state/$derived/$effect`, `dynamicCompileOptions` runes as Dojo). State/presentation separation starts here: routes/components never `fetch` (server calls live in `lib/server` + `+server.ts` later).
- PWA: manifest + `service-worker.ts` app-shell cache (extend Dojo's push-only worker pattern; push itself is out of P1 scope).
- Env: `PUBLIC_SUPABASE_URL`, `PUBLIC_SUPABASE_ANON_KEY` (browser, publishable), `SUPABASE_SERVICE_ROLE_KEY` + `META_API_KEY` server-only (no `PUBLIC_` prefix). `.env.example` documents all four.

## Tasks (TDD order)

1. Failing smoke test first: Playwright `tests/e2e/smoke.spec.ts` — GET `/snap` shows Workshop heading + mic button. Run red.
2. Scaffold configs (adapt Dojo files; strip kavach + paraglide unless i18n is explicitly wanted — default: strip). `bun install`.
3. Workshop shell page with Rokkit primitives only (avatar placeholder, mic button, caption area, cost pill `$0.00 · Meta AI`). Audit Rokkit equivalents for Card/Dialog/Sheet/Tabs/Progress/Btn/Chip/Banner; list gaps in checklist §2 (build missing primitives later in Rokkit style).
4. Smoke test green; `bun run check` (svelte-check) clean; `bun run test` (Vitest harness) runs.

## Exit criteria

- `bun run dev` serves `/snap`; smoke e2e green; grep finds no `kavach` in `snap-web/`; `check` clean. Record in checklist §2. Proceed to Stage 02 unattended.
