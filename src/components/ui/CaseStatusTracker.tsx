/**
 * CaseStatusTracker — Animated progress rail for case stages
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { useTheme } from '../../providers/ThemeProvider';
import { Typography, Spacing, BorderRadius } from '../../constants/theme';

interface Stage {
  label: string;
  completed: boolean;
  current: boolean;
}

interface CaseStatusTrackerProps {
  stages: Stage[];
}

export const CaseStatusTracker: React.FC<CaseStatusTrackerProps> = ({ stages }) => {
  const { colors } = useTheme();

  const currentIndex = stages.findIndex((s) => s.current);
  const progress = currentIndex >= 0 ? (currentIndex + 1) / stages.length : 0;

  return (
    <View style={styles.container}>
      {/* Progress Rail */}
      <View style={[styles.rail, { backgroundColor: colors.border }]}>
        <Animated.View
          style={[
            styles.railFill,
            { backgroundColor: colors.accent, width: `${progress * 100}%` },
          ]}
        />
      </View>

      {/* Stage Dots */}
      <View style={styles.stagesRow}>
        {stages.map((stage, i) => (
          <View key={i} style={styles.stageItem}>
            <View
              style={[
                styles.dot,
                {
                  backgroundColor: stage.completed || stage.current
                    ? colors.accent
                    : colors.border,
                  borderColor: stage.current ? colors.accent : 'transparent',
                  borderWidth: stage.current ? 2 : 0,
                },
              ]}
            >
              {stage.current && (
                <View style={[styles.dotInner, { backgroundColor: '#FFF' }]} />
              )}
            </View>
            <Text
              style={[
                Typography.caption,
                {
                  color: stage.current
                    ? colors.accent
                    : stage.completed
                    ? colors.text
                    : colors.textTertiary,
                  textAlign: 'center',
                  marginTop: 4,
                },
              ]}
              numberOfLines={2}
            >
              {stage.label}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: Spacing.sm,
  },
  rail: {
    height: 3,
    borderRadius: 2,
    marginHorizontal: Spacing.lg,
  },
  railFill: {
    height: '100%',
    borderRadius: 2,
  },
  stagesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: -6,
    paddingHorizontal: Spacing.xs,
  },
  stageItem: {
    alignItems: 'center',
    width: 60,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotInner: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
});
