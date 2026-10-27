# Agent instructions

## Snap → Make (Meta hackathon build), read first
For any work on the hackathon feature, the source of truth is **`docs/prd/`** (start at `docs/prd/README.md`).
- Requirements are numbered `R-<module>-<n>` in `docs/prd/03-requirements.md`; cite them in commits, tests and PRs.
- Model usage and API shapes: `docs/prd/04-model-orchestration.md`. Architecture and folders: `docs/prd/05-architecture.md`.
- Rule: **models perceive, reason and imagine; code measures and builds geometry.** The LLM never emits raw coordinates.
- Meta API key lives only on the server (`META_API_KEY`); never in frontend code.
- Build order and cut lines: `docs/prd/08-roadmap.md`.
