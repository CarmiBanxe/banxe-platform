# CLAUDE.md — packages/mobile
# Expo SDK 53 Mobile Application — BANXE AI Bank

## Stack
- Expo SDK 53 + expo-router v4 (file-based navigation)
- React Native 0.76
- NativeWind v4 (Tailwind for RN)
- Reanimated 3 (all animations — never Animated API)
- expo-local-authentication (biometric / Face ID / Touch ID)
- expo-secure-store (token storage — never AsyncStorage for auth)
- expo-haptics (haptic feedback on key actions)
- Zustand (shared stores from @banxe/shared)

## Screens (app/)
| Route | Screen | Auth |
|-------|--------|------|
| /auth/onboarding | 3-slide onboarding (Reanimated) | Public |
| /(tabs)/dashboard | Balance card + quick actions | Auth |
| /(tabs)/transfers | IBAN + biometric SCA confirmation | Auth |
| /(tabs)/transactions | FlatList with pull-to-refresh | Auth |
| /(tabs)/settings | Biometric toggle + sign out | Auth |
| /kyc/index | Document + selfie + liveness (modal) | Auth |
| /cards/index | Masked card numbers only (modal) | Auth |

## Security rules
- NEVER store tokens in AsyncStorage — use expo-secure-store only
- NEVER display full PAN — masked format only
- Biometric required for all transfers (PSD2 SCA)
- Certificate pinning: configured in app.json for production
- Haptic feedback on every important action

## Animation rules
- ALWAYS use react-native-reanimated — never Animated API
- useSharedValue + useAnimatedStyle for all animations
- withSpring / withTiming for micro-interactions
