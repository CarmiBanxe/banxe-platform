/**
 * packages/mobile/app/sca/index.tsx
 * BANXE AI Bank — PSD2 SCA Screen (Mobile)
 * S14-08 | S15-03 | PSD2 Directive 2015/2366 Art.97 | banxe-platform
 *
 * SCA (Strong Customer Authentication) required for:
 *   - Payments > £30 (PSR 2017 Reg.71)
 *   - Session from new device
 *   - Sensitive profile changes
 *
 * Mobile SCA methods:
 *   - BIOMETRIC: expo-local-authentication (Face ID / Touch ID) → POST /v1/auth/sca/verify
 *   - OTP: 6-digit TOTP from authenticator app → POST /v1/auth/sca/verify
 *
 * Navigation: This screen is pushed modally from any flow requiring SCA.
 * Params: challenge_id (required), method, expires_at, payment_amount
 * On success → router.back() (caller detects via useFocusEffect + store)
 */

import { useState, useCallback, useEffect } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import * as LocalAuthentication from 'expo-local-authentication'
import * as Haptics from 'expo-haptics'
import { colors, spacing, scaApi, useAuthStore } from '@banxe/shared'

type SCAMethod = 'biometric' | 'otp' | 'push'
type SCAStep = 'prompt' | 'otp_entry' | 'submitting' | 'success' | 'error'

export default function SCAScreen() {
  const router = useRouter()
  const { token } = useAuthStore()
  const params = useLocalSearchParams<{
    challenge_id: string
    method: SCAMethod
    expires_at: string
    payment_amount?: string
  }>()

  const { challenge_id, method = 'otp', payment_amount } = params

  const [step, setStep] = useState<SCAStep>('prompt')
  const [otp, setOtp] = useState('')
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [biometricAvailable, setBiometricAvailable] = useState(false)

  useEffect(() => {
    // Check biometric availability on mount
    LocalAuthentication.hasHardwareAsync().then((has) => {
      if (has) {
        LocalAuthentication.isEnrolledAsync().then(setBiometricAvailable)
      }
    })
  }, [])

  const handleBiometric = useCallback(async () => {
    if (!biometricAvailable) {
      Alert.alert('Biometrics Not Available', 'Please use your authenticator code instead.')
      setStep('otp_entry')
      return
    }

    setStep('submitting')
    setErrorMsg(null)

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: payment_amount
        ? `Authorise payment of ${payment_amount}`
        : 'Confirm your identity',
      fallbackLabel: 'Use PIN',
      cancelLabel: 'Cancel',
      disableDeviceFallback: false,
    })

    if (!result.success) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
      setErrorMsg(result.error === 'user_cancel' ? 'Authentication cancelled.' : 'Biometric failed. Try your code.')
      setStep('prompt')
      return
    }

    // Biometric confirmed locally — submit proof to backend
    const verifyResult = await scaApi.verify(token ?? '', {
      challenge_id,
      biometric_proof: `biometric:approved:${challenge_id}`,
    })

    if (!verifyResult.ok || !verifyResult.data.verified) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
      setErrorMsg(verifyResult.data?.error ?? 'Biometric verification failed. Try your code.')
      setStep('prompt')
      return
    }

    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
    setStep('success')
    router.back()
  }, [biometricAvailable, challenge_id, payment_amount, router, token])

  const handleOTPSubmit = useCallback(async () => {
    if (otp.length !== 6) {
      setErrorMsg('Please enter the 6-digit code from your authenticator app.')
      return
    }

    setStep('submitting')
    setErrorMsg(null)

    try {
      const result = await scaApi.verify(token ?? '', {
        challenge_id,
        otp_code: otp,
      })

      if (!result.ok) {
        throw new Error(result.error.detail ?? 'Verification failed')
      }

      if (!result.data.verified) {
        const remaining = result.data.attempts_remaining
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
        if (remaining === 0) {
          setErrorMsg('Too many failed attempts. Please start again.')
          setStep('prompt')
        } else {
          setErrorMsg(
            `Invalid code. ${remaining} attempt${remaining === 1 ? '' : 's'} remaining.`,
          )
          setStep('otp_entry')
        }
        return
      }

      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
      setStep('success')
      router.back()
    } catch (err) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
      setErrorMsg(err instanceof Error ? err.message : 'Invalid code. Please try again.')
      setStep('otp_entry')
    }
  }, [challenge_id, otp, router, token])

  const handleCancel = useCallback(() => {
    router.back()
  }, [router])

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.lockEmoji} accessibilityElementsHidden>🔐</Text>
        <Text style={styles.title} accessibilityRole="header">
          Security Verification
        </Text>
        <Text style={styles.subtitle}>
          {payment_amount
            ? `PSD2 SCA required to authorise payment of ${payment_amount}`
            : 'Two-factor authentication required.'}
        </Text>
      </View>

      {/* Error */}
      {errorMsg && (
        <View style={styles.errorBox} accessibilityRole="alert">
          <Text style={styles.errorText}>{errorMsg}</Text>
        </View>
      )}

      {/* Step: Prompt */}
      {step === 'prompt' && (
        <View style={styles.actions}>
          {method === 'biometric' && biometricAvailable && (
            <TouchableOpacity
              style={[styles.button, styles.primaryButton]}
              onPress={handleBiometric}
              accessibilityLabel="Use Face ID or Touch ID"
              accessibilityRole="button"
            >
              <Text style={styles.primaryButtonText}>👆  Use Biometric / Face ID</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={[styles.button, method === 'otp' ? styles.primaryButton : styles.secondaryButton]}
            onPress={() => setStep('otp_entry')}
            accessibilityLabel="Enter authenticator code"
            accessibilityRole="button"
          >
            <Text style={method === 'otp' ? styles.primaryButtonText : styles.secondaryButtonText}>
              📱  Enter Authenticator Code
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={handleCancel}
            accessibilityLabel="Cancel"
            accessibilityRole="button"
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Step: OTP Entry */}
      {step === 'otp_entry' && (
        <View style={styles.otpContainer}>
          <Text style={styles.label}>Enter Code from Authenticator App</Text>
          <TextInput
            style={styles.otpInput}
            keyboardType="number-pad"
            maxLength={6}
            value={otp}
            onChangeText={(v) => setOtp(v.replace(/\D/g, ''))}
            textAlign="center"
            placeholder="000000"
            placeholderTextColor={colors.textMuted}
            accessibilityLabel="6-digit authenticator code"
            textContentType="oneTimeCode"
            autoFocus
          />
          <Text style={styles.helperText}>
            Open your authenticator app and enter the 6-digit code.
          </Text>
          <TouchableOpacity
            style={[styles.button, styles.primaryButton, otp.length !== 6 && styles.disabledButton]}
            onPress={handleOTPSubmit}
            disabled={otp.length !== 6}
            accessibilityLabel="Verify code"
            accessibilityRole="button"
            accessibilityState={{ disabled: otp.length !== 6 }}
          >
            <Text style={styles.primaryButtonText}>Verify</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setStep('prompt')}>
            <Text style={styles.backLink}>← Back</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Step: Submitting */}
      {step === 'submitting' && (
        <View style={styles.loadingContainer} accessibilityLabel="Verifying, please wait">
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Verifying…</Text>
        </View>
      )}

      {/* Regulatory footer */}
      <Text style={styles.footer}>PSD2 Art.97 SCA · Banxe EMI FRN 900000</Text>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 32,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  lockEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
  },
  errorBox: {
    backgroundColor: colors.errorLight,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    color: colors.error,
    fontSize: 14,
  },
  actions: {
    gap: 12,
  },
  button: {
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: 'center',
    minHeight: 44,
  },
  primaryButton: {
    backgroundColor: colors.primary,
  },
  secondaryButton: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cancelButton: {
    backgroundColor: 'transparent',
  },
  disabledButton: {
    backgroundColor: colors.disabled,
  },
  primaryButtonText: {
    color: colors.textInverted,
    fontSize: 15,
    fontWeight: '600',
  },
  secondaryButtonText: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '500',
  },
  cancelButtonText: {
    color: colors.textMuted,
    fontSize: 15,
  },
  otpContainer: {
    gap: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 4,
  },
  otpInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: 12,
    backgroundColor: colors.surface,
  },
  helperText: {
    fontSize: 12,
    color: colors.textMuted,
  },
  backLink: {
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 8,
  },
  loadingContainer: {
    alignItems: 'center',
    gap: 12,
    paddingVertical: 32,
  },
  loadingText: {
    fontSize: 14,
    color: colors.textMuted,
  },
  footer: {
    marginTop: 'auto',
    fontSize: 11,
    color: colors.textMuted,
    textAlign: 'center',
  },
})
