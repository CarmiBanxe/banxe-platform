---
description: Run Vitest tests with coverage report
---

Run unit tests with coverage:

```bash
cd /home/mmber/banxe-platform
pnpm vitest run --coverage --reporter=verbose
```

Coverage targets:
- Shared types: 100% (type-level tests)
- Web pages: ≥80% logic coverage
- Mobile screens: ≥80% logic coverage

Test files location: `tests/web/` and `tests/mobile/`
