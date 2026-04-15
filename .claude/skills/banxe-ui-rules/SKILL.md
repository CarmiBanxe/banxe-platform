---
name: banxe-ui-rules
description: BANXE financial UX and compliance rules for all UI generation across web and mobile. Use for payment, onboarding, KYC, consent, balances, cards, transactions, disclosures, and any regulated financial interface.
---

# BANXE UI Rules

This skill defines the mandatory UX, formatting, and compliance rules for BANXE interfaces across web (`packages/web`) and mobile (`packages/mobile`).

## Source of truth
Always align with:
- `CLAUDE.md` (brand tokens, hard rules, FCA invariants)
- `packages/shared/` (types, API client, Zustand stores)
- `docs/**`
- `DESIGN.md` when available

If a generated component conflicts with these rules, these rules win.

## Core financial rules

### Money representation
- Monetary values are domain values, not primitive display numbers.
- Never use `number`, `parseFloat()`, `Number()`, or `toFixed()` for money.
- Treat all money amounts as `DecimalString` (string) from source to UI — FCA I-01, I-05.
- Formatting must preserve exact value semantics.
- Never silently round regulated values.
- Error: `#DC2626` | Success: `#16A34A` (as defined in CLAUDE.md — use tokens not hex)

### Financial display
- Always display:
  - currency symbol and code
  - amount as formatted string
  - sign or direction when relevant (debit/credit)
  - status when pending / booked / failed / locked
- Distinguish clearly:
  - available balance vs booked balance
  - pending amount (label it "Pending")
  - fees (never hide until after confirm)
  - exchange rate with direction (when applicable)
- Use tabular numerals (`font-variant-numeric: tabular-nums`) for aligned amount columns.
- Masked PAN only: `•••• •••• •••• 1234` — never raw card numbers.

### Payment flow rules (PSD2 SCA)
- PSD2-sensitive flows MUST preserve:
  1. **review** — show amount, fee, destination, FX rate
  2. **confirm** — SCA: biometric or OTP challenge
- Never collapse review and confirm into one destructive step.
- Risk, fee, FX, and destination details must be visible before confirmation.
- Auth guard on all authenticated pages (`AuthGuard` component).

### Disclosure rules
- Required disclosures must be placed **before** irreversible actions.
- EU AI Act Art.52 AI-assistance disclosures must use visible headers, not hidden footnotes.
- Important disclosures must not be placed only inside tooltips or collapsed sections.

### Consent rules (GDPR)
- GDPR consent checkboxes are mandatory on required screens.
- Consent must be explicit and **unticked by default**.
- Consent text must be near the action it governs.
- No PII in logs — GDPR compliance required server and client side.

### KYC/KYB rules
- Preserve approved regulated sequence.
- Default: ID → selfie → liveness (unless approved flow differs).
- Never present completed-state visuals before verification succeeds.
- Never imply approval before backend confirmation.

### Session rules
- Warn at 5 min inactivity.
- Auto-logout at 10 min — never remove these guards.

## UX conventions

### Clarity over decoration
- Prefer plain language over marketing language.
- Actions must be verb-based and specific:
  - ✅ "Review transfer" / "Confirm payment" / "Upload ID"
  - ❌ "Continue journey" / "Proceed"

### State hierarchy
Every financial component must explicitly support:
- `default`
- `loading`
- `empty`
- `success`
- `warning`
- `error`
- `locked` / `restricted` when applicable

### Error messaging
- Errors must say what failed and what the user can do next.
- Avoid vague messages like "Something went wrong."
- Validation errors belong near the field, not in a toast only.

### Sensitive actions — stronger confirmation UX
- Send money
- Exchange currency
- Freeze/unfreeze card
- Submit KYC/KYB
- Change personal/legal information
- Export data
- Close account

### Accessibility (WCAG 2.1 AA)
- All interactive controls need accessible labels (`aria-label` web / `accessibilityLabel` mobile).
- Don't encode meaning by color alone — use text + color.
- Status chips must have text, not just color.
- Contrast ratios must meet WCAG 2.1 AA minimum.
- Keyboard navigation must work on all interactive web elements.

## Platform alignment
Web (`packages/web`) and mobile (`packages/mobile`) must keep the same:
- business semantics and flow logic
- field requirements and validation rules
- amount formatting and rounding behavior
- disclosure content and wording
- empty/error/success state meaning

Platform differences are allowed ONLY for:
- native navigation (Next.js App Router vs expo-router)
- native gestures and touch targets
- safe-area handling
- NativeWind (mobile) vs Tailwind v4 (web) class syntax

## Anti-patterns
Never:
- Hardcode amount rounding or `toFixed(2)`
- Hide fees until after confirm step
- Show unavailable balance as spendable
- Use `float` / `number` type for money values
- Bury disclosures in collapsible content by default
- Replace required GDPR consent with passive text
- Use different wording for the same regulated action across web and mobile
- Use raw hex colors when a BANXE token or MD3 role exists

## Default instruction
When generating BANXE UI:
1. Load BANXE tokens from `CLAUDE.md`
2. Apply BANXE UI Rules (this skill)
3. Apply MD3 role mapping if Material 3 is used (`material-3` skill)
4. Generate web and mobile in sync via `ui-sync` agent
