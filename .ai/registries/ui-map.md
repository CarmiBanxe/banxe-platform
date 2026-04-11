# UI Map — banxe-platform
# IL-UI-01 | Created: 2026-04-11

## Monorepo overview

| Package | Path | Tech | Entry |
|---------|------|------|-------|
| @banxe/shared | packages/shared/ | TypeScript | src/index.ts |
| @banxe/web | packages/web/ | Next.js 15 | src/app/layout.tsx |
| @banxe/mobile | packages/mobile/ | Expo 53 | app/_layout.tsx |

## Backend integration

| Backend | URL | Usage |
|---------|-----|-------|
| banxe-emi-stack API | http://localhost:8000 | All API calls via @banxe/shared api-client |
| MCP Server | http://localhost:9100/mcp | 28 tools for AI agent integration |
| Frankfurter FX | http://localhost:8181 | FX rates (via backend) |

## Brand tokens

Primary: #1A2B6B · Accent: #00C6AE · BG: #F5F7FA · Surface: #FFFFFF

## Infrastructure

| Component | File |
|-----------|------|
| Semgrep SAST | .semgrep/typescript-banking.yml |
| Docker | docker/web.Dockerfile |
| Grafana | infra/grafana/dashboards/frontend-metrics.json |
| n8n | n8n/workflows/ui-deploy-notification.json |
| Soul | .ai/soul.md |

*Last updated: 2026-04-11 (IL-UI-01 initial scaffold)*
