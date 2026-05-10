/**
 * Phone Auth — Phone number input with OTP request
 */
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { Typography, Spacing, BorderRadius } from '../../src/constants/theme';

export default function PhoneScreen() {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [focused, setFocused] = useState(false);

  const isValid = phone.length === 10 && /^[6-9]\d{9}$/.test(phone);

  const handleSendOTP = async () => {
    if (!isValid) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsLoading(true);
    // Simulate OTP send
    setTimeout(() => {
      setIsLoading(false);
      router.push('/(auth)/otp');
    }, 1500);
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.content}>
          {/* Back */}
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#C9A961" />
          </Pressable>

          {/* Header */}
          <Animated.View entering={FadeInDown.delay(100).springify()}>
            <Text style={styles.title}>Welcome to AdvocateX</Text>
            <Text style={styles.subtitle}>
              Enter your mobile number to continue. We'll send a 6-digit verification code.
            </Text>
          </Animated.View>

          {/* Phone Input */}
          <Animated.View entering={FadeInDown.delay(250).springify()}>
            <Text style={styles.label}>Mobile Number</Text>
            <View
              style={[
                styles.phoneRow,
                { borderColor: focused ? '#C9A961' : 'rgba(255,255,255,0.15)' },
              ]}
            >
              <View style={styles.countryCode}>
                <Text style={styles.flag}>🇮🇳</Text>
                <Text style={styles.codeText}>+91</Text>
              </View>
              <View style={styles.divider} />
              <TextInput
                style={styles.phoneInput}
                placeholder="98765 43210"
                placeholderTextColor="rgba(255,255,255,0.25)"
                keyboardType="phone-pad"
                maxLength={10}
                value={phone}
                onChangeText={setPhone}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                autoFocus
                accessibilityLabel="Phone number"
                accessibilityHint="Enter your 10-digit Indian mobile number"
              />
              {phone.length > 0 && (
                <Pressable onPress={() => setPhone('')}>
                  <Ionicons name="close-circle" size={20} color="rgba(255,255,255,0.3)" />
                </Pressable>
              )}
            </View>
          </Animated.View>

          {/* Send OTP Button */}
          <Animated.View entering={FadeInDown.delay(400).springify()}>
            <Pressable
              onPress={handleSendOTP}
              disabled={!isValid || isLoading}
              style={styles.otpButton}
            >
              <LinearGradient
                colors={
                  isValid
                    ? ['#D4B87A', '#C9A961', '#A88B4A']
                    : ['rgba(201,169,97,0.3)', 'rgba(201,169,97,0.2)']
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.otpButtonGradient}
              >
                <Text style={[styles.otpButtonText, { opacity: isValid ? 1 : 0.5 }]}>
                  {isLoading ? 'Sending OTP...' : 'Send OTP'}
                </Text>
                {!isLoading && (
                  <Ionicons name="arrow-forward" size={18} color="#0B1F3A" style={{ opacity: isValid ? 1 : 0.5 }} />
                )}
              </LinearGradient>
            </Pressable>
          </Animated.View>

          {/* Google OAuth */}
          <Animated.View entering={FadeInDown.delay(550).springify()}>
            <View style={styles.orRow}>
              <View style={styles.orLine} />
              <Text style={styles.orText}>or</Text>
              <View style={styles.orLine} />
            </View>

            <Pressable style={styles.googleButton}>
              <Ionicons name="logo-google" size={20} color="#FFF" />
              <Text style={styles.googleText}>Continue with Google</Text>
            </Pressable>
          </Animated.View>

          {/* Terms */}
          <Animated.View entering={FadeInDown.delay(650).springify()}>
            <Text style={styles.terms}>
              By continuing, you agree to our{' '}
              <Text style={styles.termsLink}>Terms of Service</Text>
              {' '}and{' '}
              <Text style={styles.termsLink}>Privacy Policy</Text>
            </Text>
          </Animated.View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: 60,
  },
  backButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xl,
  },
  title: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 32,
    color: '#FFFFFF',
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    color: 'rgba(255,255,255,0.5)',
    lineHeight: 24,
    marginBottom: Spacing['2xl'],
  },
  label: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    color: 'rgba(255,255,255,0.5)',
    marginBottom: Spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: BorderRadius.button,
    paddingHorizontal: Spacing.md,
    height: 56,
    marginBottom: Spacing.xl,
  },
  countryCode: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  flag: {
    fontSize: 20,
  },
  codeText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 16,
    color: '#FFF',
  },
  divider: {
    width: 1,
    height: 28,
    backgroundColor: 'rgba(255,255,255,0.15)',
    marginHorizontal: Spacing.sm,
  },
  phoneInput: {
    flex: 1,
    fontFamily: 'Inter_500Medium',
    fontSize: 18,
    color: '#FFF',
    letterSpacing: 1,
  },
  otpButton: {
    borderRadius: BorderRadius.button,
    overflow: 'hidden',
    marginBottom: Spacing.xl,
  },
  otpButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    gap: Spacing.xs,
  },
  otpButtonText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    color: '#0B1F3A',
  },
  orRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  orLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  orText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: 'rgba(255,255,255,0.3)',
    marginHorizontal: Spacing.md,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    borderRadius: BorderRadius.button,
    paddingVertical: Spacing.sm,
    gap: Spacing.xs,
    marginBottom: Spacing.xl,
  },
  googleText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 16,
    color: '#FFF',
  },
  terms: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: 'rgba(255,255,255,0.3)',
    textAlign: 'center',
    lineHeight: 18,
  },
  termsLink: {
    color: '#C9A961',
    textDecorationLine: 'underline',
  },
});
