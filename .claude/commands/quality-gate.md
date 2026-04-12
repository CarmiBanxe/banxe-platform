---
description: Run full quality gate (typecheck + lint + format + tests)
---

Run the full quality gate for banxe-platform:

```bash
cd /home/mmber/banxe-platform
make quality-gate
```

This runs: TypeScript typecheck → ESLint lint → Prettier format check → Vitest tests (57+ tests).

All checks must pass green before committing.
