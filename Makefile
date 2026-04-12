.PHONY: install dev build test lint typecheck format quality-gate docker-up docker-down clean

# ── Setup ─────────────────────────────────────────────────────────────────────
install:
	pnpm install --frozen-lockfile

# ── Development ───────────────────────────────────────────────────────────────
dev:
	pnpm dev

# ── Build ─────────────────────────────────────────────────────────────────────
build:
	pnpm build

# ── Quality gates ─────────────────────────────────────────────────────────────
test:
	pnpm vitest run --reporter=verbose

test-coverage:
	pnpm vitest run --coverage --reporter=verbose

lint:
	pnpm lint

typecheck:
	pnpm typecheck

format:
	pnpm format

format-check:
	pnpm prettier --check "**/*.{ts,tsx,json,md}" --ignore-path .gitignore

quality-gate: typecheck lint format-check test
	@echo "✅ Quality gate PASSED"

# ── Docker ────────────────────────────────────────────────────────────────────
docker-build:
	docker build -f docker/web.Dockerfile -t banxe-web:local .

docker-up:
	docker compose up -d

docker-down:
	docker compose down

docker-logs:
	docker compose logs -f

# ── Security ──────────────────────────────────────────────────────────────────
secrets-scan:
	gitleaks detect --source . --verbose || true

semgrep:
	semgrep --config .semgrep/typescript-banking.yml --error .

# ── Clean ─────────────────────────────────────────────────────────────────────
clean:
	rm -rf node_modules packages/*/node_modules packages/*/.next packages/*/dist coverage
