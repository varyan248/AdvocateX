/**
 * GoldButton — Primary CTA with shimmer effect on press
 */
import React, { useCallback } from 'react';
import {
  Text,
  Pressable,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withSequence,
  withTiming,
  interpolateColor,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../providers/ThemeProvider';
import { Typography, BorderRadius, Spacing, AnimationConfig } from '../../constants/theme';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface GoldButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  accessibilityLabel?: string;
  accessibilityHint?: string;
}

export const GoldButton: React.FC<GoldButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  fullWidth = false,
  style,
  textStyle,
  accessibilityLabel,
  accessibilityHint,
}) => {
  const { colors, isDark } = useTheme();
  const scale = useSharedValue(1);
  const shimmer = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = useCallback(() => {
    if (disabled || loading) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    scale.value = withSequence(
      withSpring(0.95, AnimationConfig.spring.stiff),
      withSpring(1, AnimationConfig.spring.bouncy)
    );
    shimmer.value = withSequence(
      withTiming(1, { duration: 200 }),
      withTiming(0, { duration: 300 })
    );
    onPress();
  }, [onPress, disabled, loading]);

  const sizeStyles = {
    sm: { paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs, minHeight: 36 },
    md: { paddingHorizontal: Spacing.xl, paddingVertical: Spacing.sm, minHeight: 48 },
    lg: { paddingHorizontal: Spacing['2xl'], paddingVertical: Spacing.md, minHeight: 56 },
  };

  const textSizes = {
    sm: Typography.buttonSmall,
    md: Typography.button,
    lg: Typography.button,
  };

  const getBackgroundColor = (): string => {
    if (disabled) return isDark ? '#2A2A2A' : '#D0D0D0';
    switch (variant) {
      case 'primary': return colors.accent;
      case 'secondary': return isDark ? colors.surfaceTertiary : colors.surfaceSecondary;
      case 'outline': return 'transparent';
      case 'ghost': return 'transparent';
      default: return colors.accent;
    }
  };

  const getTextColor = (): string => {
    if (disabled) return isDark ? '#5A5A5A' : '#9A9A9A';
    switch (variant) {
      case 'primary': return '#0B1F3A';
      case 'secondary': return colors.text;
      case 'outline': return colors.accent;
      case 'ghost': return colors.accent;
      default: return '#0B1F3A';
    }
  };

  const getBorderStyle = (): ViewStyle => {
    if (variant === 'outline') {
      return {
        borderWidth: 1.5,
        borderColor: disabled ? (isDark ? '#2A2A2A' : '#D0D0D0') : colors.accent,
      };
    }
    return {};
  };

  return (
    <AnimatedPressable
      style={[
        styles.button,
        sizeStyles[size],
        { backgroundColor: getBackgroundColor() },
        getBorderStyle(),
        fullWidth && styles.fullWidth,
        animatedStyle,
        style,
      ]}
      onPress={handlePress}
      disabled={disabled || loading}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || title}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: disabled || loading }}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} size="small" />
      ) : (
        <>
          {icon && iconPosition === 'left' && icon}
          <Text
            style={[
              textSizes[size],
              { color: getTextColor() },
              icon ? (iconPosition === 'left' ? styles.iconMarginLeft : styles.iconMarginRight) : null,
              textStyle,
            ]}
          >
            {title}
          </Text>
          {icon && iconPosition === 'right' && icon}
        </>
      )}
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BorderRadius.button,
  },
  fullWidth: {
    width: '100%',
  },
  iconMarginLeft: {
    marginLeft: Spacing.xs,
  },
  iconMarginRight: {
    marginRight: Spacing.xs,
  },
});
