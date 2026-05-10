/**
 * OTP Verification — 6-digit code entry with auto-fill
 */
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../src/stores/authStore';
import { Typography, Spacing, BorderRadius } from '../../src/constants/theme';

const OTP_LENGTH = 6;

export default function OTPScreen() {
  const router = useRouter();
  const { setAuthenticated, setUser } = useAuthStore();
  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(30);
  const [isVerifying, setIsVerifying] = useState(false);
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  useEffect(() => {
    if (otp.length === OTP_LENGTH) {
      handleVerify();
    }
  }, [otp]);

  const handleVerify = async () => {
    setIsVerifying(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    // Simulate verification
    setTimeout(() => {
      setIsVerifying(false);
      setAuthenticated(true);
      setUser({
        id: 'demo-user',
        name: 'Arjun Mehta',
        phone: '+919876543210',
        email: 'arjun.mehta@legal.com',
        designation: 'advocate',
        primaryCourt: 'City Civil & Sessions Court, Ahmedabad',
        highCourtJurisdiction: 'High Court of Gujarat',
        enrollmentNumber: 'GJ/1234/2019',
        isVerified: true,
        areasOfPractice: ['Criminal Law', 'Family Law'],
        preferredLanguage: 'en',
        subscriptionTier: 'free',
        barCouncilState: 'Gujarat',
      });
      router.replace('/(tabs)');
    }, 1500);
  };

  const handleResend = () => {
    if (timer > 0) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setTimer(30);
    setOtp('');
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#C9A961" />
        </Pressable>

        <Animated.View entering={FadeInDown.delay(100).springify()}>
          <Text style={styles.title}>Verify Your Number</Text>
          <Text style={styles.subtitle}>
            Enter the 6-digit code sent to{'\n'}
            <Text style={styles.phoneNumber}>+91 98765 43210</Text>
          </Text>
        </Animated.View>

        {/* OTP Input */}
        <Animated.View entering={FadeInDown.delay(250).springify()}>
          <Pressable style={styles.otpContainer} onPress={() => inputRef.current?.focus()}>
            {Array.from({ length: OTP_LENGTH }).map((_, i) => (
              <View
                key={i}
                style={[
                  styles.otpBox,
                  {
                    borderColor:
                      i === otp.length
                        ? '#C9A961'
                        : otp[i]
                        ? 'rgba(201,169,97,0.5)'
                        : 'rgba(255,255,255,0.1)',
                  },
                ]}
              >
                <Text style={styles.otpDigit}>{otp[i] || ''}</Text>
                {i === otp.length && (
                  <Animated.View entering={FadeIn} style={styles.cursor} />
                )}
              </View>
            ))}
          </Pressable>

          <TextInput
            ref={inputRef}
            style={styles.hiddenInput}
            value={otp}
            onChangeText={(text) => {
              const cleaned = text.replace(/\D/g, '');
              if (cleaned.length <= OTP_LENGTH) {
                setOtp(cleaned);
              }
            }}
            keyboardType="number-pad"
            maxLength={OTP_LENGTH}
            autoComplete="sms-otp"
            textContentType="oneTimeCode"
          />
        </Animated.View>

        {/* Timer & Resend */}
        <Animated.View entering={FadeInDown.delay(400).springify()} style={styles.timerRow}>
          {timer > 0 ? (
            <Text style={styles.timerText}>
              Resend code in{' '}
              <Text style={styles.timerCount}>{timer}s</Text>
            </Text>
          ) : (
            <Pressable onPress={handleResend}>
              <Text style={styles.resendText}>Resend OTP</Text>
            </Pressable>
          )}
        </Animated.View>

        {/* Verify Button */}
        <Animated.View entering={FadeInDown.delay(500).springify()}>
          <Pressable
            onPress={handleVerify}
            disabled={otp.length !== OTP_LENGTH || isVerifying}
            style={styles.verifyButton}
          >
            <LinearGradient
              colors={
                otp.length === OTP_LENGTH
                  ? ['#D4B87A', '#C9A961', '#A88B4A']
                  : ['rgba(201,169,97,0.3)', 'rgba(201,169,97,0.2)']
              }
              style={styles.verifyGradient}
            >
              <Text style={[styles.verifyText, { opacity: otp.length === OTP_LENGTH ? 1 : 0.5 }]}>
                {isVerifying ? 'Verifying...' : 'Verify & Continue'}
              </Text>
            </LinearGradient>
          </Pressable>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
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
    marginBottom: Spacing['3xl'],
  },
  phoneNumber: {
    color: '#C9A961',
    fontFamily: 'Inter_600SemiBold',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginBottom: Spacing.xl,
  },
  otpBox: {
    width: 48,
    height: 56,
    borderWidth: 1.5,
    borderRadius: BorderRadius.button,
    alignItems: 'center',
    justifyContent: 'center',
  },
  otpDigit: {
    fontFamily: 'JetBrainsMono_600SemiBold',
    fontSize: 24,
    color: '#FFFFFF',
  },
  cursor: {
    position: 'absolute',
    width: 2,
    height: 24,
    backgroundColor: '#C9A961',
  },
  hiddenInput: {
    position: 'absolute',
    opacity: 0,
    height: 0,
  },
  timerRow: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  timerText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: 'rgba(255,255,255,0.4)',
  },
  timerCount: {
    color: '#C9A961',
    fontFamily: 'Inter_600SemiBold',
  },
  resendText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    color: '#C9A961',
  },
  verifyButton: {
    borderRadius: BorderRadius.button,
    overflow: 'hidden',
  },
  verifyGradient: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
  },
  verifyText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    color: '#0B1F3A',
  },
});
