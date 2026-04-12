# banxe-platform

**BANXE AI Bank — Web + Mobile UI Platform**

TypeScript monorepo (pnpm + Turbo) for BANXE customer-facing applications. Includes React web app and React Native mobile app with shared types and utilities.

---

## Quick Start

```bash
# Install dependencies
pnpm install

# Development (all packages in watch mode)
pnpm dev

# Quality gate (required before commit)
make quality-gate
```

---

## Architecture

```
banxe-platform/
├── packages/
│   ├── web/        ← React web application
│   ├── mobile/     ← React Native / Expo
│   └── shared/     ← Shared types, utils, constants
├── tests/
│   ├── web/        ← Vitest tests for web
│   └── mobile/     ← Vitest tests for mobile
├── docker/         ← Docker configuration
└── infra/          ← Infrastructure config
```

### Package structure

| Package | Stack | Purpose |
|---------|-------|---------|
| `packages/web` | React 18, TypeScript | Customer web portal |
| `packages/mobile` | React Native, Expo | iOS + Android app |
| `packages/shared` | TypeScript | Shared types + utils |

---

## Development

```bash
pnpm dev                  # all packages watch mode
pnpm test                 # Vitest all tests
pnpm build                # Turbo build
pnpm format               # Prettier --write
make quality-gate         # tsc + eslint + prettier + vitest
```

### Tech Stack

```
Language:   TypeScript 5.4 (strict)
Package:    pnpm 10.33.0 (workspace monorepo)
Build:      Turbo 2.0
Tests:      Vitest 1.6
Node:       ≥22.0.0
```

---

## Key Rules

- Financial amounts: always `string` or `Decimal` — **never** `number` (I-05 invariant)
- TypeScript strict mode: `noImplicitAny: true`, `strictNullChecks: true`
- Compliance UI: disclosure headers required (EU AI Act Art.52)

---

## CI/CD

- `.github/workflows/ci.yml` — gitleaks + typecheck + Vitest + coverage
- Quality gate: `make quality-gate` (tsc + biome + prettier + vitest)
