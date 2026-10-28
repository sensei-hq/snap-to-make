# Katachi · Snap → Make — Product Requirements

> **Show it. Say it. Burn it.**
> Point your phone at a sketch and an object and say what you want. Katachi turns it into a measured, cut-ready design, a photoreal preview and laser G-code, then watches the burn.

Codename **meta-snap**. Built for the **Meta Global AI Developer Hackathon** (Oct 26 – Nov 4, 2026). Indie track, theme *Build for Your World* (with a nod to *Push the Frontier: manufacturing*).

This PRD is the **single source of truth** for the hackathon build. It is written so that:
1. the **app** (`app/`, SvelteKit + Svelte 5 + Rokkit) can be built screen by screen (see [05-architecture.md](05-architecture.md) and [06-screens.md](06-screens.md));
2. the **pitch deck and white paper** reuse the same story, diagrams and visual language (see [07-design-language.md](07-design-language.md) and [09-demo-and-submission.md](09-demo-and-submission.md));
3. **Muse Code** (Meta's coding agent) can implement it module by module from the requirement IDs (see [03-requirements.md](03-requirements.md) and [08-roadmap.md](08-roadmap.md)).

## Documents

| # | Doc | Answers |
|---|---|---|
| 01 | [Vision & positioning](01-vision.md) | Why, for whom, why Meta, how we make money |
| 02 | [User journeys](02-user-journeys.md) | The hero demo journey and supporting flows |
| 03 | [Requirements](03-requirements.md) | Numbered requirements `R-<module>-<n>` with phase tags and acceptance criteria |
| 04 | [Model orchestration](04-model-orchestration.md) | Which Meta model does what, the exact API shapes, prompts/schemas, fallbacks, cost |
| 05 | [Architecture](05-architecture.md) | System design, data flow, Object → Impl contracts, security, budget guard |
| 06 | [Screens](06-screens.md) | Screen-by-screen specs mapped to `app/` routes, components and state, plus design notes |
| 07 | [Design language](07-design-language.md) | Shared tokens for the app, deck and white paper |
| 08 | [Roadmap](08-roadmap.md) | The 9-day hackathon plan (day by day) and the ambitious post-hackathon phases |
| 09 | [Demo & submission](09-demo-and-submission.md) | Demo script, deck outline, white-paper outline, judging-criteria map |
| 10 | [Risks & open questions](10-risks-open-questions.md) | What could sink us and what we still need to decide |

## Phase tags used throughout
- **P1**: must ship for the demo (Nov 4). Demo-critical.
- **P1+**: stretch for the hackathon week, cut in the order given in the roadmap.
- **P2**: post-hackathon (Katachi v1 product).
- **P3**: long-term vision.

## Product principles
Every screen and requirement serves these:
1. **Voice-first workshop buddy.** Katachi is a shop mate you talk to: brief, opinionated, proposes defaults, never blocks on missing info (R-CV-6). Text input is always visible as the fallback.
2. **UI appears around the conversation.** Cards (scene, measure, plan, art, preview) are summoned by the conversation through Spark's UI toolkit tools ([04 §4.2](04-model-orchestration.md)); the user never hunts through menus.
3. **The workspace is earned.** The app opens sparse ([S1](06-screens.md)); the canvas, panels and toolbars appear only when the conversation needs them ([S6](06-screens.md)).

## Precedence
Where documents disagree: `03-requirements` > `04-model-orchestration` > `05-architecture` > `06-screens`.
