/**
 * HearingCard — Displays hearing information with date, court, case, and urgency
 */
import React from 'react';
import { Text, View, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useTheme } from '../../providers/ThemeProvider';
import { Typography, BorderRadius, Spacing, Elevation, AnimationConfig } from '../../constants/theme';
import { CourtBadge } from './CourtBadge';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface HearingCardProps {
  caseTitle: string;
  caseNumber: string;
  courtName: string;
  date: string;
  time?: string;
  purpose: string;
  urgency?: 'normal' | 'soon' | 'today' | 'overdue';
  onPress?: () => void;
}

const urgencyColors = {
  normal: '#1A7A4A',
  soon: '#C17D0F',
  today: '#C9A961',
  overdue: '#C0392B',
};

const urgencyLabels = {
  normal: 'Upcoming',
  soon: 'This Week',
  today: 'Today',
  overdue: 'Overdue',
};

export const HearingCard: React.FC<HearingCardProps> = ({
  caseTitle,
  caseNumber,
  courtName,
  date,
  time,
  purpose,
  urgency = 'normal',
  onPress,
}) => {
  const { colors, isDark } = useTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const urgColor = urgencyColors[urgency];

  // Parse date for display
  const dateObj = new Date(date);
  const dayNum = dateObj.getDate();
  const monthShort = dateObj.toLocaleString('en-IN', { month: 'short' }).toUpperCase();
  const dayName = dateObj.toLocaleString('en-IN', { weekday: 'short' });

  return (
    <AnimatedPressable
      style={[
        styles.card,
        animatedStyle,
        {
          backgroundColor: isDark ? colors.surfaceSecondary : colors.card,
          borderColor: isDark ? colors.border : colors.borderLight,
          borderLeftColor: urgColor,
        },
        Elevation.sm,
      ]}
      onPress={onPress}
      onPressIn={() => {
        scale.value = withSpring(0.97, AnimationConfig.spring.default);
      }}
      onPressOut={() => {
        scale.value = withSpring(1, AnimationConfig.spring.bouncy);
      }}
      accessibilityRole="button"
      accessibilityLabel={`Hearing for ${caseTitle} on ${date}`}
    >
      {/* Date block */}
      <View style={[styles.dateBlock, { backgroundColor: isDark ? colors.surfaceTertiary : '#F8F4EE' }]}>
        <Text style={[Typography.monoLarge, { color: colors.accent }]}>{dayNum}</Text>
        <Text style={[Typography.captionMedium, { color: colors.textSecondary }]}>{monthShort}</Text>
        <Text style={[Typography.caption, { color: colors.textTertiary }]}>{dayName}</Text>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[Typography.bodySmallMedium, { color: colors.text, flex: 1 }]} numberOfLines={1}>
            {caseTitle}
          </Text>
          <View style={[styles.urgencyBadge, { backgroundColor: `${urgColor}18` }]}>
            <View style={[styles.urgencyDot, { backgroundColor: urgColor }]} />
            <Text style={[Typography.caption, { color: urgColor }]}>
              {urgencyLabels[urgency]}
            </Text>
          </View>
        </View>

        <Text style={[Typography.caption, { color: colors.textTertiary, marginTop: 2 }]}>
          {caseNumber}
        </Text>

        <View style={styles.footer}>
          <CourtBadge courtName={courtName} variant="compact" />
          <View style={styles.purposeRow}>
            <Ionicons name="document-text-outline" size={12} color={colors.textTertiary} />
            <Text style={[Typography.caption, { color: colors.textTertiary, marginLeft: 4 }]} numberOfLines={1}>
              {purpose}
            </Text>
          </View>
        </View>
      </View>
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    borderRadius: BorderRadius.card,
    borderWidth: 1,
    borderLeftWidth: 3,
    overflow: 'hidden',
    minWidth: 280,
    maxWidth: 320,
  },
  dateBlock: {
    width: 64,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.sm,
  },
  content: {
    flex: 1,
    padding: Spacing.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  urgencyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BorderRadius.pill,
    marginLeft: Spacing.xs,
  },
  urgencyDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 4,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing.xs,
  },
  purposeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginLeft: Spacing.xs,
  },
});
