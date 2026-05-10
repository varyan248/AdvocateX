/**
 * CourtBadge — Court name with icon indicator
 */
import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../providers/ThemeProvider';
import { Typography, BorderRadius, Spacing } from '../../constants/theme';

interface CourtBadgeProps {
  courtName: string;
  variant?: 'default' | 'compact';
  type?: 'supreme' | 'high' | 'district' | 'magistrate' | 'tribunal' | 'consumer';
}

const courtIcons: Record<string, string> = {
  supreme: 'business',
  high: 'business-outline',
  district: 'home',
  magistrate: 'home-outline',
  tribunal: 'clipboard',
  consumer: 'people',
};

const courtColors: Record<string, string> = {
  supreme: '#C9A961',
  high: '#1A5276',
  district: '#1A7A4A',
  magistrate: '#4A4A4A',
  tribunal: '#C17D0F',
  consumer: '#6C3483',
};

export const CourtBadge: React.FC<CourtBadgeProps> = ({
  courtName,
  variant = 'default',
  type = 'district',
}) => {
  const { colors, isDark } = useTheme();
  const iconColor = courtColors[type] || colors.textSecondary;

  return (
    <View
      style={[
        styles.badge,
        variant === 'compact' && styles.compact,
        {
          backgroundColor: isDark ? colors.surfaceTertiary : `${iconColor}10`,
          borderColor: isDark ? colors.border : `${iconColor}30`,
        },
      ]}
    >
      <Ionicons
        name={courtIcons[type] as any}
        size={variant === 'compact' ? 12 : 14}
        color={iconColor}
      />
      <Text
        style={[
          variant === 'compact' ? Typography.caption : Typography.bodySmallMedium,
          { color: colors.textSecondary, marginLeft: Spacing.xxs },
        ]}
        numberOfLines={1}
      >
        {courtName}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.xs,
    paddingVertical: Spacing.xxs,
    borderRadius: BorderRadius.chip,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  compact: {
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
});
