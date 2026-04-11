# Mobile Map — packages/mobile
# Expo SDK 53 + expo-router | IL-UI-01

## Screens

| Route | File | Type | Key features |
|-------|------|------|-------------|
| /auth/onboarding | app/auth/onboarding.tsx | Stack | 3-slide Reanimated animation |
| /(tabs)/dashboard | app/(tabs)/dashboard.tsx | Tab | Balance card, pull-to-refresh |
| /(tabs)/transfers | app/(tabs)/transfers.tsx | Tab | Biometric SCA (expo-local-authentication) |
| /(tabs)/transactions | app/(tabs)/transactions.tsx | Tab | FlatList, pull-to-refresh |
| /(tabs)/settings | app/(tabs)/settings.tsx | Tab | Biometric toggle, haptics |
| /kyc/index | app/kyc/index.tsx | Modal | 4-step wizard, camera capture |
| /cards/index | app/cards/index.tsx | Modal | Masked PAN only |

## Security

- Token storage: expo-secure-store (NOT AsyncStorage)
- Biometric: expo-local-authentication (Face ID / Touch ID / fingerprint)
- Haptics: expo-haptics on all key actions
- Animations: react-native-reanimated v3 only (never Animated API)

## Tests
- tests/mobile/auth.test.tsx
- tests/mobile/dashboard.test.tsx
- tests/mobile/transfers.test.tsx

*Last updated: 2026-04-11*
