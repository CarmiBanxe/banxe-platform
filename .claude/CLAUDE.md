# CLAUDE.md — BANXE Platform Workspace
**Repo:** CarmiBanxe/banxe-platform | **Plane:** Platform | **Updated:** 2026-04-12 (FIX-VERIFY-2)

---

## БЛОК 0: КОНТЕКСТ И ТЕРРИТОРИЯ

Это **Platform Plane** — монорепозиторий Web + Mobile UI/UX.
- Backend API → `~/banxe-emi-stack/` (отдельный терминал)
- UI прототипы → `~/banxe-ui/` (отдельный терминал)
- Архитектурные решения → `~/banxe-architecture/docs/`
- **НЕ смешивать** этот репо с другими проектами

**Перед любой работой прочитай:**
```bash
cat ~/banxe-platform/packages/shared/    # shared types и утилиты
cat ~/banxe-platform/packages/web/       # web-специфичный код
ls ~/banxe-platform/packages/            # mobile, shared, web
```

---

## БЛОК 1: ТЕХНОЛОГИЧЕСКИЙ СТЕК

```
Язык:         TypeScript 5.4 (strict mode)
Менеджер:     pnpm 10.33.0 (workspace монорепо)
Сборка:       Turbo 2.0 (build pipeline)
Тесты:        Vitest 1.6 (coverage + watch mode)
Форматирование: Prettier 3.3
Node:         ≥22.0.0
```

### Структура пакетов:
```
packages/
  mobile/   ← React Native / Expo компоненты
  shared/   ← общие типы, утилиты, constants
  web/      ← React веб-компоненты
tests/
  mobile/   ← тесты для mobile пакета
  web/      ← тесты для web пакета
```

**Запрещено:**
- `npm` или `yarn` — только `pnpm`
- Прямые зависимости в packages без turbo pipeline
- Коммиты без прохождения quality-gate
- `any` тип без обоснования

---

## БЛОК 2: КОМАНДЫ

```bash
# Разработка
pnpm dev                  # запуск всех packages в watch mode

# Quality gate (обязательно перед коммитом)
make quality-gate         # typecheck + lint + format + tests

# Тестирование
pnpm test                 # все тесты через vitest
vitest run --coverage     # тесты с coverage отчётом

# Сборка
pnpm build                # turbo build всех packages

# Форматирование
pnpm format               # prettier --write
```

---

## БЛОК 3: QUALITY GATE

Перед каждым коммитом обязательно:
```bash
make quality-gate
```

Это запускает:
1. `tsc --noEmit` — TypeScript typecheck
2. `eslint` / `biome` — lint
3. `prettier --check` — format
4. `vitest run` — 57+ тестов

**CI/CD:** `.github/workflows/ci.yml` — runs на push/PR
- gitleaks secrets scan (P0)
- TypeScript typecheck
- Vitest с coverage

---

## БЛОК 4: ПРАВИЛА РАЗРАБОТКИ

### Финансовые суммы:
- Всегда `string` или `Decimal` — НИКОГДА `number` для денег
- `"123.45"` — правильно. `123.45` — НЕПРАВИЛЬНО (I-05 invariant)

### TypeScript:
- Strict mode обязателен (`noImplicitAny: true`, `strictNullChecks: true`)
- Интерфейсы предпочтительнее type aliases для public API
- Generic типы для переиспользуемых компонентов

### Тесты:
- Каждая новая функция → минимум один юнит-тест
- Финансовые вычисления → граничные случаи (0, отрицательные, max)
- Compliance UI → тест на наличие disclosure headers (EU AI Act Art.52)

---

## БЛОК 5: AGENTЫ И АВТОМАТИЗАЦИЯ

- **Claude Code** = архитектор, ревьюер
- **Quality Gate** = `/quality-gate` command в .claude/commands/
- **Docker** = `/docker` command для контейнеризации
- **Тесты** = `/test` command

---

*Workspace: /home/mmber/banxe-platform | Stack: TypeScript + pnpm + Turbo + Vitest*
