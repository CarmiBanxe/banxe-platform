# AGENTS.md — banxe-platform

**Repository:** `~/banxe-platform/`
**Version:** 1.0 | 2026-04-12
**Purpose:** BANXE Web + Mobile UI Platform (TypeScript monorepo)
**Stack:** TypeScript 5.4, pnpm 10.33.0, Turbo 2.0, Vitest 1.6

---

## Core mission

Customer-facing web and mobile applications for BANXE AI Bank.
TypeScript strict-mode monorepo with shared types and pnpm workspaces.

---

## Four-Partner Swarm

| # | Partner | Role |
|---|---------|------|
| 1 | **Claude Code** | Architect, reviewer, orchestrator |
| 2 | **Ruflo** | Multi-step flow orchestrator |
| 3 | **Aider CLI** | Sole code executor |
| 4 | **MiroFish** | UI/UX scenario testing |

---

## Instruction hierarchy

1. Explicit user instruction
2. **I-05 invariant** — financial amounts always `string`, never `number`
3. `CLAUDE.md` — TypeScript stack context
4. `AGENTS.md` — this file
5. `~/.claude/CLAUDE.md` — global defaults

---

## Critical rules

| Rule | Details |
|------|---------|
| **I-05** | `amount: string` — never `number` for money |
| TypeScript strict | `noImplicitAny`, `strictNullChecks` — no exceptions |
| Compliance UI | EU AI Act Art.52 disclosure headers required |
| Package manager | `pnpm` only — no npm, no yarn |

---

## Development commands

```bash
pnpm dev                  # all packages watch mode
pnpm test                 # Vitest
pnpm build                # Turbo build
make quality-gate         # tsc + biome + prettier + vitest
pre-commit run --all-files
```

---

## Package responsibilities

| Package | Owner | Scope |
|---------|-------|-------|
| `packages/web` | Frontend team | React web portal |
| `packages/mobile` | Mobile team | React Native iOS/Android |
| `packages/shared` | Platform team | Types, utils, constants |

---

## Repository structure

```
banxe-platform/
├── packages/
│   ├── web/            ← React web app
│   ├── mobile/         ← React Native / Expo
│   └── shared/         ← Shared types + utils
├── tests/
│   ├── web/            ← web tests
│   └── mobile/         ← mobile tests
└── docker/             ← Docker config
```

---

## Definition of done

- [ ] `make quality-gate` passes (tsc + biome + prettier + vitest)
- [ ] `pre-commit run --all-files` green
- [ ] No `number` type for financial values
- [ ] Compliance disclosure headers present in UI
- [ ] Mobile + web both tested
