/**
 * VakilOrb — Floating AI assistant button with pulsing gold gradient
 */
import React, { useEffect } from 'react';
import { StyleSheet, Pressable, Text } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withRepeat,
  withTiming,
  withSequence,
  interpolate,
  Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { AnimationConfig } from '../../constants/theme';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface VakilOrbProps {
  onPress: () => void;
  visible?: boolean;
}

export const VakilOrb: React.FC<VakilOrbProps> = ({ onPress, visible = true }) => {
  const pulse = useSharedValue(0);
  const scale = useSharedValue(1);
  const opacity = useSharedValue(visible ? 1 : 0);

  useEffect(() => {
    pulse.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 1500, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );
  }, []);

  useEffect(() => {
    opacity.value = withTiming(visible ? 1 : 0, { duration: 200 });
  }, [visible]);

  const pulseRingStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: interpolate(pulse.value, [0, 1], [1, 1.4]) }],
      opacity: interpolate(pulse.value, [0, 0.5, 1], [0.4, 0.15, 0]),
    };
  });

  const orbStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    scale.value = withSequence(
      withSpring(1.15, AnimationConfig.spring.bouncy),
      withSpring(1, AnimationConfig.spring.default)
    );
    onPress();
  };

  return (
    <Animated.View style={[styles.container, orbStyle]}>
      {/* Pulse ring */}
      <Animated.View style={[styles.pulseRing, pulseRingStyle]} />

      <AnimatedPressable
        onPress={handlePress}
        style={styles.orb}
        accessibilityRole="button"
        accessibilityLabel="Ask Vakil AI"
        accessibilityHint="Opens the AI legal assistant chat"
      >
        <LinearGradient
          colors={['#D4B87A', '#C9A961', '#A88B4A']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          <Ionicons name="sparkles" size={26} color="#0B1F3A" />
        </LinearGradient>
      </AnimatedPressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 90,
    right: 20,
    width: 60,
    height: 60,
    zIndex: 999,
  },
  pulseRing: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#C9A961',
  },
  orb: {
    width: 60,
    height: 60,
    borderRadius: 30,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#C9A961',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
  },
  gradient: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
