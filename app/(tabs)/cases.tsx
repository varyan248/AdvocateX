/**
 * Cases List — Case management with filters and sorting
 */
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { useTheme } from '../../src/providers/ThemeProvider';
import {
  Typography,
  Spacing,
  BorderRadius,
  Elevation,
  AnimationConfig,
} from '../../src/constants/theme';
import { ParchmentCard, CourtBadge, GoldButton } from '../../src/components/ui';

const FILTER_TABS = [
  { id: 'all', label: 'બધા' },
  { id: 'active', label: 'સક્રિય' },
  { id: 'disposed', label: 'નિકાલ' },
  { id: 'upcoming', label: 'આગામી સુનાવણી' },
];

const SAMPLE_CASES = [
  {
    id: '1',
    title: 'ગુજરાત રાજ્ય વિ. રમેશ પટેલ',
    caseNumber: 'CC No. 234/2024',
    cnr: 'GJAH01-002345-2024',
    courtName: 'સેશન્સ કોર્ટ, અમદાવાદ',
    courtType: 'district' as const,
    clientName: 'રમેશ પી.',
    nextHearing: '2025-01-15',
    stage: 'આક્ષેપ પર દલીલો',
    priority: 'high' as const,
    isActive: true,
    sections: ['BNS §103', 'BNS §61'],
  },
  {
    id: '2',
    title: 'પ્રિયા મહેતા વિ. સંજય મહેતા',
    caseNumber: 'Mat.Case No. 112/2024',
    cnr: 'GJSU01-001122-2024',
    courtName: 'ફેમિલી કોર્ટ, સુરત',
    courtType: 'district' as const,
    clientName: 'પ્રિયા એમ.',
    nextHearing: '2025-01-22',
    stage: 'ઉલટતપાસ',
    priority: 'medium' as const,
    isActive: true,
    sections: ['HMA §13'],
  },
  {
    id: '3',
    title: 'HDFC બેંક લિમિટેડ વિ. કૃષ્ણાભાઈ સોલંકી',
    caseNumber: 'CC No. 88/2024',
    cnr: 'GJVA01-000882-2024',
    courtName: 'એમએમ કોર્ટ, વડોદરા',
    courtType: 'magistrate' as const,
    clientName: 'કે. સોલંકી',
    nextHearing: '2025-02-08',
    stage: 'પુરાવા',
    priority: 'low' as const,
    isActive: true,
    sections: ['NI Act §138'],
  },
  {
    id: '4',
    title: 'MCA વિ. મહેશ બિલ્ડર્સ પ્રા. લિ.',
    caseNumber: 'SCA No. 7823/2024',
    cnr: 'GJHC01-078234-2024',
    courtName: 'હાઈકોર્ટ, ગુજરાત',
    courtType: 'high' as const,
    clientName: 'મહેશ બી.',
    nextHearing: '2025-03-18',
    stage: 'નિયમ નિસી જારી',
    priority: 'urgent' as const,
    isActive: true,
    sections: ['Art. 226 Constitution'],
  },
  {
    id: '5',
    title: 'મીના શાહ વિ. ગો ફર્સ્ટ એરલાઈન્સ',
    caseNumber: 'CC No. 45/2024',
    cnr: 'GJSU01-000453-2024',
    courtName: 'ડીસીડીઆરસી, સુરત',
    courtType: 'consumer' as const,
    clientName: 'મીના એસ.',
    nextHearing: null,
    stage: 'નિકાલ',
    priority: 'low' as const,
    isActive: false,
    sections: ['CPA §35'],
  },
];

const priorityColors = {
  low: '#1A7A4A',
  medium: '#C17D0F',
  high: '#E67E22',
  urgent: '#C0392B',
};

const priorityLabels = {
  low: 'સામાન્ય',
  medium: 'મધ્યમ',
  high: 'અગત્યનું',
  urgent: 'તાત્કાલિક',
};

export default function CasesScreen() {
  const { colors, isDark } = useTheme();
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState('all');

  const filteredCases = SAMPLE_CASES.filter((c) => {
    switch (activeFilter) {
      case 'active': return c.isActive;
      case 'disposed': return !c.isActive;
      case 'upcoming': return c.isActive && c.nextHearing;
      default: return true;
    }
  });

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <Animated.View entering={FadeInDown.delay(100).springify()} style={styles.header}>
        <Text style={[Typography.h1, { color: colors.text }]}>મારા કેસ</Text>
        <Text style={[Typography.bodySmall, { color: colors.textSecondary }]}>
          {SAMPLE_CASES.filter((c) => c.isActive).length} સક્રિય • {SAMPLE_CASES.length} કુલ
        </Text>
      </Animated.View>

      {/* Filter Tabs */}
      <Animated.View entering={FadeInDown.delay(200).springify()}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
        >
          {FILTER_TABS.map((tab) => (
            <Pressable
              key={tab.id}
              style={[
                styles.filterTab,
                {
                  backgroundColor:
                    activeFilter === tab.id
                      ? colors.accent
                      : isDark
                      ? colors.surfaceSecondary
                      : colors.surfaceSecondary,
                  borderColor:
                    activeFilter === tab.id ? colors.accent : colors.border,
                },
              ]}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setActiveFilter(tab.id);
              }}
            >
              <Text
                style={[
                  Typography.bodySmallMedium,
                  {
                    color: activeFilter === tab.id ? '#0B1F3A' : colors.textSecondary,
                  },
                ]}
              >
                {tab.label}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </Animated.View>

      {/* Cases List */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.casesList}>
        {filteredCases.length === 0 ? (
          <Animated.View entering={FadeInDown.delay(300).springify()} style={styles.emptyState}>
            <View style={[styles.emptyIcon, { backgroundColor: isDark ? colors.surfaceSecondary : colors.surfaceSecondary }]}>
              <Ionicons name="briefcase-outline" size={48} color={colors.textTertiary} />
            </View>
            <Text style={[Typography.h3, { color: colors.text, marginTop: Spacing.md }]}>
              અહીં કોઈ કેસ નથી
            </Text>
            <Text style={[Typography.bodySmall, { color: colors.textSecondary, textAlign: 'center', marginTop: Spacing.xs }]}>
              {activeFilter === 'disposed'
                ? 'હજુ સુધી કોઈ કેસનો નિકાલ થયો નથી'
                : 'તમારો પ્રથમ કેસ ઉમેરીને શરૂઆત કરો'}
            </Text>
            <GoldButton
              title="નવો કેસ ઉમેરો"
              onPress={() => router.push('/modal/add-case')}
              icon={<Ionicons name="add" size={18} color="#0B1F3A" />}
              style={{ marginTop: Spacing.lg }}
            />
          </Animated.View>
        ) : (
          filteredCases.map((caseItem, i) => (
            <Animated.View
              key={caseItem.id}
              entering={FadeInDown.delay(300 + i * AnimationConfig.stagger).springify()}
            >
              <ParchmentCard
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }}
                variant="outlined"
                style={[styles.caseCard, { borderLeftColor: priorityColors[caseItem.priority], borderLeftWidth: 3 }]}
              >
                {/* Case Header */}
                <View style={styles.caseHeader}>
                  <Text style={[Typography.bodyMedium, { color: colors.text, flex: 1 }]} numberOfLines={1}>
                    {caseItem.title}
                  </Text>
                  <View style={[styles.priorityBadge, { backgroundColor: `${priorityColors[caseItem.priority]}15` }]}>
                    <View style={[styles.priorityDot, { backgroundColor: priorityColors[caseItem.priority] }]} />
                    <Text style={[Typography.caption, { color: priorityColors[caseItem.priority] }]}>
                      {priorityLabels[caseItem.priority]}
                    </Text>
                  </View>
                </View>

                {/* Case Number & CNR */}
                <View style={styles.caseNumbers}>
                  <Text style={[Typography.mono, { color: colors.accent }]}>{caseItem.caseNumber}</Text>
                  <Text style={[Typography.caption, { color: colors.textTertiary, marginLeft: Spacing.sm }]}>
                    CNR: {caseItem.cnr}
                  </Text>
                </View>

                {/* Court & Client */}
                <View style={styles.caseDetails}>
                  <CourtBadge courtName={caseItem.courtName} variant="compact" type={caseItem.courtType} />
                  <View style={styles.clientBadge}>
                    <Ionicons name="person-outline" size={12} color={colors.textTertiary} />
                    <Text style={[Typography.caption, { color: colors.textSecondary, marginLeft: 4 }]}>
                      {caseItem.clientName}
                    </Text>
                  </View>
                </View>

                {/* Sections */}
                <View style={styles.sectionsRow}>
                  {caseItem.sections.map((s, si) => (
                    <View key={si} style={[styles.sectionChip, { backgroundColor: `${colors.accent}10` }]}>
                      <Text style={[Typography.caption, { color: colors.accent }]}>{s}</Text>
                    </View>
                  ))}
                </View>

                {/* Footer: Stage & Next Hearing */}
                <View style={styles.caseFooter}>
                  <View style={[styles.stageBadge, { backgroundColor: caseItem.isActive ? `${colors.success}15` : `${colors.textTertiary}15` }]}>
                    <Text style={[Typography.captionMedium, { color: caseItem.isActive ? colors.success : colors.textTertiary }]}>
                      {caseItem.stage}
                    </Text>
                  </View>
                  {caseItem.nextHearing && (
                    <View style={styles.nextHearing}>
                      <Ionicons name="calendar-outline" size={12} color={colors.textSecondary} />
                      <Text style={[Typography.captionMedium, { color: colors.textSecondary, marginLeft: 4 }]}>
                        {new Date(caseItem.nextHearing).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </Text>
                    </View>
                  )}
                </View>
              </ParchmentCard>
            </Animated.View>
          ))
        )}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* FAB: New Case */}
      <Pressable
        style={[styles.fab, { backgroundColor: colors.accent }]}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          router.push('/modal/add-case');
        }}
        accessibilityRole="button"
        accessibilityLabel="Add new case"
      >
        <Ionicons name="add" size={28} color="#0B1F3A" />
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.xs,
    paddingBottom: Spacing.sm,
  },
  filterScroll: {
    paddingHorizontal: Spacing.md,
    gap: Spacing.xs,
    paddingBottom: Spacing.md,
  },
  filterTab: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.pill,
    borderWidth: 1,
  },
  casesList: {
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm,
  },
  caseCard: {
    marginBottom: 0,
  },
  caseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  priorityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BorderRadius.pill,
    marginLeft: Spacing.xs,
  },
  priorityDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 4,
  },
  caseNumbers: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.xxs,
  },
  caseDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing.xs,
  },
  clientBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginTop: Spacing.xs,
  },
  sectionChip: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BorderRadius.chip,
  },
  caseFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing.sm,
    paddingTop: Spacing.xs,
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(0,0,0,0.06)',
  },
  stageBadge: {
    paddingHorizontal: Spacing.xs,
    paddingVertical: 2,
    borderRadius: BorderRadius.chip,
  },
  nextHearing: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing['5xl'],
    paddingHorizontal: Spacing.xl,
  },
  emptyIcon: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fab: {
    position: 'absolute',
    bottom: 100,
    right: Spacing.md,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    ...Elevation.lg,
  },
});
