/**
 * ParchmentCard — Primary card component with glassmorphic dark variant
 */
import React from 'react';
import {
  View,
  StyleSheet,
  Pressable,
  ViewStyle,
  AccessibilityProps,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useTheme } from '../../providers/ThemeProvider';
import { BorderRadius, Elevation, AnimationConfig, Spacing } from '../../constants/theme';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface ParchmentCardProps extends AccessibilityProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: keyof typeof Spacing;
  borderRadius?: keyof typeof BorderRadius;
  disabled?: boolean;
}

export const ParchmentCard: React.FC<ParchmentCardProps> = ({
  children,
  onPress,
  style,
  variant = 'default',
  padding = 'md',
  borderRadius = 'card',
  disabled = false,
  ...accessibilityProps
}) => {
  const { colors, isDark } = useTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    if (onPress) {
      scale.value = withSpring(0.97, AnimationConfig.spring.default);
    }
  };

  const handlePressOut = () => {
    if (onPress) {
      scale.value = withSpring(1, AnimationConfig.spring.bouncy);
    }
  };

  const cardStyle: ViewStyle = {
    backgroundColor: isDark ? colors.surfaceSecondary : colors.card,
    borderRadius: BorderRadius[borderRadius],
    padding: Spacing[padding],
    ...(variant === 'elevated' && Elevation.md),
    ...(variant === 'outlined' && {
      borderWidth: 1,
      borderColor: colors.border,
    }),
    ...(isDark && variant === 'default' && {
      borderWidth: 1,
      borderColor: colors.border,
    }),
  };

  if (onPress) {
    return (
      <AnimatedPressable
        style={[cardStyle, animatedStyle, style]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        accessibilityRole="button"
        {...accessibilityProps}
      >
        {children}
      </AnimatedPressable>
    );
  }

  return (
    <Animated.View style={[cardStyle, style]} {...accessibilityProps}>
      {children}
    </Animated.View>
  );
};
