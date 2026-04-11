# Mobile vs Web Gap Analysis
# IL-UI-01 | Generated: 2026-04-11

## Feature parity

| Feature | Web | Mobile | Gap |
|---------|-----|--------|-----|
| Login | ✅ email+PIN | ✅ via onboarding | Web has standalone login page |
| Dashboard | ✅ balance + quick actions | ✅ balance card + quick actions | Parity |
| Send money | ✅ IBAN form + OTP SCA | ✅ IBAN form + biometric SCA | Mobile uses biometric; web uses OTP |
| Transactions | ✅ paginated + filters | ✅ FlatList + pull-to-refresh | Web has status filter chips |
| KYC | ✅ 4-step wizard | ✅ 4-step modal | Camera capture: placeholder on both |
| Compliance | ✅ full dashboard | ❌ not implemented | **Gap: mobile missing compliance screen** |
| Statements | ✅ period selector + PDF | ❌ not implemented | **Gap: mobile missing statements** |
| Cards | ✅ via dashboard link | ✅ masked PAN modal | Parity (masked PAN on both) |
| Settings | ✅ biometric toggle | ✅ biometric toggle + haptics | Mobile has haptics |

## Gaps to address (P1)

1. **Mobile: Compliance screen** — add `/compliance` tab or modal showing ReconStatus + breach count
2. **Mobile: Statements** — add statement download flow (share PDF via expo-sharing)
3. **Web: SCA biometric** — web uses OTP; should add WebAuthn for biometric on supported browsers
4. **Both: Real camera** — KYC camera capture is placeholder; integrate expo-camera (mobile) / browser MediaDevices (web)
5. **Both: Error boundaries** — add React ErrorBoundary components
6. **Both: Offline mode** — add service worker (web) / NetInfo handling (mobile)

## Security parity

| Control | Web | Mobile |
|---------|-----|--------|
| Session timeout | ✅ 5min warn + 10min auto-logout | ❌ not implemented |
| Token storage | localStorage (needs upgrade to httpOnly cookie) | ✅ expo-secure-store |
| PAN masking | ✅ | ✅ |
| PSD2 SCA | ✅ OTP step | ✅ biometric |
| Certificate pinning | ❌ N/A (browser) | ✅ configured in app.json |

## Recommendation

Priority for Phase 7.1:
1. Add mobile compliance + statements screens
2. Upgrade web token storage to httpOnly cookies via Next.js route handler
3. Implement real camera capture for KYC (expo-camera)
4. Add session timeout to mobile
