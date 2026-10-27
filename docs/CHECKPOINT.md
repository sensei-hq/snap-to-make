# Checkpoint — Snap → Make Phase 1

- Slice: Zen-Sumi theme on Rokkit components (code complete, pushed; not yet deployed).
- Done: tokens pinned to the design mock (`app/src/lib/design/tokens.spec.ts`); arch test bans raw colours, inline colour styles and emoji icons outside `illustrations/`; every screen on @rokkit/ui + @rokkit/forms (zen-sumi); fonts via @fontsource; theme persists across reloads; gate consents are native checkboxes; package + Worker renamed `snap-to-make` with custom domain `snap-to-make.sensei-hq.com`.
- Gates: 110 unit tests, 12/12 e2e, arch/lint/check 0 errors, coverage 91.4%, `deploy:dry` ok; `rokkit doctor` all PASS (chart WARN only, no charts); `dbd doctor` + `dbd inspect` clean.
- Next command: `cd app && bunx wrangler secret put META_API_KEY && bun run deploy` (new Worker needs its secrets), then retest https://snap-to-make.sensei-hq.com/snap.
- Open: Vimeo kickoff + Agents 101 transcripts are privacy-locked (403); user to export captions or run yt-dlp with browser cookies into `docs/transcripts/`. Caliper truth samples, Ray 5 burn film, final submission assembly.
- Known broken: none in code. Old Worker `burn-e-snap` still serves the previous build until the new one is deployed.
