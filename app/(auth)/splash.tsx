/**
 * Splash Screen — Animated gold scales on OLED black
 */
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withDelay,
  withSpring,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Typography, Spacing } from '../../src/constants/theme';
import { useAuthStore } from '../../src/stores/authStore';

const { width, height } = Dimensions.get('window');

export default function SplashScreen() {
  const router = useRouter();
  const { isAuthenticated, isOnboarded } = useAuthStore();

  const scaleIcon = useSharedValue(0.3);
  const opacityIcon = useSharedValue(0);
  const titleOpacity = useSharedValue(0);
  const titleTranslateY = useSharedValue(20);
  const taglineOpacity = useSharedValue(0);
  const versionOpacity = useSharedValue(0);
  const overallOpacity = useSharedValue(1);

  useEffect(() => {
    // Icon animation
    scaleIcon.value = withSpring(1, { mass: 0.8, damping: 12, stiffness: 150 });
    opacityIcon.value = withTiming(1, { duration: 400 });

    // Title animation
    titleOpacity.value = withDelay(400, withTiming(1, { duration: 500 }));
    titleTranslateY.value = withDelay(400, withSpring(0, { mass: 0.8, damping: 15 }));

    // Tagline animation
    taglineOpacity.value = withDelay(700, withTiming(1, { duration: 500 }));

    // Version
    versionOpacity.value = withDelay(900, withTiming(1, { duration: 400 }));

    // Navigate after 2s
    const timer = setTimeout(() => {
      overallOpacity.value = withTiming(0, { duration: 300 }, () => {
        runOnJS(navigate)();
      });
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const navigate = () => {
    if (isAuthenticated) {
      router.replace('/(tabs)');
    } else if (isOnboarded) {
      router.replace('/(auth)/login');
    } else {
      router.replace('/(auth)/onboarding');
    }
  };

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleIcon.value }],
    opacity: opacityIcon.value,
  }));

  const titleStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ translateY: titleTranslateY.value }],
  }));

  const taglineStyle = useAnimatedStyle(() => ({
    opacity: taglineOpacity.value,
  }));

  const versionStyle = useAnimatedStyle(() => ({
    opacity: versionOpacity.value,
  }));

  const containerStyle = useAnimatedStyle(() => ({
    opacity: overallOpacity.value,
  }));

  return (
    <Animated.View style={[styles.container, containerStyle]}>
      {/* Gold Scales Icon */}
      <Animated.View style={[styles.iconContainer, iconStyle]}>
        <LinearGradient
          colors={['#D4B87A', '#C9A961', '#A88B4A']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.iconGradient}
        >
          <Ionicons name="scale" size={56} color="#0B1F3A" />
        </LinearGradient>
      </Animated.View>

      {/* App Name */}
      <Animated.View style={titleStyle}>
        <Text style={styles.appName}>AdvocateX</Text>
      </Animated.View>

      {/* Tagline */}
      <Animated.View style={taglineStyle}>
        <Text style={styles.tagline}>Justice, Informed.</Text>
      </Animated.View>

      {/* Version */}
      <Animated.View style={[styles.versionContainer, versionStyle]}>
        <Text style={styles.version}>v1.0.0</Text>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    marginBottom: Spacing.xl,
  },
  iconGradient: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  appName: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 42,
    color: '#C9A961',
    letterSpacing: -1,
    textAlign: 'center',
  },
  tagline: {
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    color: 'rgba(201,169,97,0.6)',
    letterSpacing: 2,
    textAlign: 'center',
    marginTop: Spacing.xs,
    textTransform: 'uppercase',
  },
  versionContainer: {
    position: 'absolute',
    bottom: 60,
  },
  version: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: 'rgba(255,255,255,0.25)',
  },
});
