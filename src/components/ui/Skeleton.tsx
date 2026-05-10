/**
 * Skeleton Loading Components — SkeletonLine, SkeletonCard, SkeletonAvatar
 */
import React, { useEffect } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  interpolate,
  Easing,
} from 'react-native-reanimated';
import { useTheme } from '../../providers/ThemeProvider';
import { BorderRadius, Spacing } from '../../constants/theme';

const useShimmer = () => {
  const shimmer = useSharedValue(0);
  useEffect(() => {
    shimmer.value = withRepeat(
      withTiming(1, { duration: 1500, easing: Easing.linear }),
      -1,
      false
    );
  }, []);
  return shimmer;
};

interface SkeletonLineProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
}

export const SkeletonLine: React.FC<SkeletonLineProps> = ({
  width = '100%',
  height = 16,
  borderRadius = 4,
  style,
}) => {
  const { colors, isDark } = useTheme();
  const shimmer = useShimmer();

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(shimmer.value, [0, 0.5, 1], [0.3, 0.7, 0.3]),
  }));

  return (
    <Animated.View
      style={[
        {
          width: width as any,
          height,
          borderRadius,
          backgroundColor: isDark ? '#1A1A1A' : '#E8E0D4',
        },
        animatedStyle,
        style,
      ]}
    />
  );
};

interface SkeletonCardProps {
  lines?: number;
  style?: ViewStyle;
}

export const SkeletonCard: React.FC<SkeletonCardProps> = ({ lines = 3, style }) => {
  const { colors, isDark } = useTheme();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: isDark ? colors.surfaceSecondary : colors.card,
          borderColor: isDark ? colors.border : colors.borderLight,
        },
        style,
      ]}
    >
      <SkeletonLine width="60%" height={20} style={{ marginBottom: Spacing.sm }} />
      {Array.from({ length: lines }).map((_, i) => (
        <SkeletonLine
          key={i}
          width={i === lines - 1 ? '40%' : '100%'}
          height={14}
          style={{ marginBottom: Spacing.xs }}
        />
      ))}
    </View>
  );
};

interface SkeletonAvatarProps {
  size?: number;
  style?: ViewStyle;
}

export const SkeletonAvatar: React.FC<SkeletonAvatarProps> = ({ size = 48, style }) => {
  const shimmer = useShimmer();
  const { isDark } = useTheme();

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(shimmer.value, [0, 0.5, 1], [0.3, 0.7, 0.3]),
  }));

  return (
    <Animated.View
      style={[
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: isDark ? '#1A1A1A' : '#E8E0D4',
        },
        animatedStyle,
        style,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  card: {
    padding: Spacing.md,
    borderRadius: BorderRadius.card,
    borderWidth: 1,
  },
});
