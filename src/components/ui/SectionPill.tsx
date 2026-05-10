/**
 * SectionPill — Law section number badge component
 */
import React from 'react';
import { Text, View, StyleSheet, Pressable } from 'react-native';
import { useTheme } from '../../providers/ThemeProvider';
import { Typography, BorderRadius, Spacing } from '../../constants/theme';

interface SectionPillProps {
  sectionNumber: string;
  actShortName?: string;
  onPress?: () => void;
  variant?: 'default' | 'compact' | 'citation';
  highlighted?: boolean;
}

export const SectionPill: React.FC<SectionPillProps> = ({
  sectionNumber,
  actShortName,
  onPress,
  variant = 'default',
  highlighted = false,
}) => {
  const { colors, isDark } = useTheme();

  const bgColor = highlighted
    ? colors.accent
    : isDark
    ? colors.surfaceTertiary
    : colors.surfaceSecondary;

  const textColor = highlighted ? '#0B1F3A' : colors.accent;

  const content = (
    <View
      style={[
        styles.pill,
        variant === 'compact' && styles.compact,
        variant === 'citation' && styles.citation,
        { backgroundColor: bgColor },
      ]}
    >
      <Text
        style={[
          variant === 'compact' ? Typography.captionMedium : Typography.mono,
          { color: textColor },
        ]}
      >
        {actShortName ? `${actShortName} §${sectionNumber}` : `§${sectionNumber}`}
      </Text>
    </View>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={`Section ${sectionNumber}${actShortName ? ` of ${actShortName}` : ''}`}
      >
        {content}
      </Pressable>
    );
  }

  return content;
};

const styles = StyleSheet.create({
  pill: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xxs,
    borderRadius: BorderRadius.chip,
    alignSelf: 'flex-start',
  },
  compact: {
    paddingHorizontal: Spacing.xs,
    paddingVertical: 2,
  },
  citation: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xxs,
    borderRadius: BorderRadius.pill,
  },
});
