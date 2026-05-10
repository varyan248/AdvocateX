/**
 * Drafting Studio — Template-based legal document drafting
 */
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
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
import { ParchmentCard, GoldButton } from '../../src/components/ui';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const DRAFT_CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'criminal', label: 'Criminal' },
  { id: 'civil', label: 'Civil' },
  { id: 'family', label: 'Family' },
  { id: 'commercial', label: 'Commercial' },
  { id: 'constitutional', label: 'Constitutional' },
  { id: 'notices', label: 'Notices' },
  { id: 'agreements', label: 'Agreements' },
];

const TEMPLATES = [
  { id: 't1', name: 'Vakalatnama', description: 'Authorization for advocate to appear', category: 'civil', time: '5 min', premium: false, icon: 'document-text' },
  { id: 't2', name: 'Regular Bail Application', description: 'Under BNSS Section 480', category: 'criminal', time: '15 min', premium: false, icon: 'shield-checkmark' },
  { id: 't3', name: 'Anticipatory Bail Application', description: 'Under BNSS Section 482', category: 'criminal', time: '20 min', premium: false, icon: 'shield' },
  { id: 't4', name: 'Default Bail Application', description: 'Under BNSS Section 187(2)', category: 'criminal', time: '15 min', premium: true, icon: 'timer' },
  { id: 't5', name: 'Plaint — Money Suit', description: 'Recovery of money with interest', category: 'civil', time: '25 min', premium: false, icon: 'cash' },
  { id: 't6', name: 'Written Statement', description: 'Defence reply to plaint', category: 'civil', time: '25 min', premium: true, icon: 'create' },
  { id: 't7', name: 'Writ Petition (HC)', description: 'Under Article 226 of Constitution', category: 'constitutional', time: '30 min', premium: true, icon: 'flag' },
  { id: 't8', name: 'S.138 NI Act — Legal Notice', description: 'Dishonour of cheque notice', category: 'notices', time: '10 min', premium: false, icon: 'mail' },
  { id: 't9', name: 'S.138 NI Act — Complaint', description: 'Criminal complaint for cheque bounce', category: 'commercial', time: '20 min', premium: false, icon: 'document' },
  { id: 't10', name: 'Divorce Petition (Hindu)', description: 'Under Section 13 of HMA 1955', category: 'family', time: '25 min', premium: true, icon: 'people' },
  { id: 't11', name: 'Maintenance Application', description: 'Under BNSS Section 144', category: 'family', time: '15 min', premium: false, icon: 'wallet' },
  { id: 't12', name: 'Consumer Complaint', description: 'Under Consumer Protection Act 2019', category: 'civil', time: '20 min', premium: false, icon: 'cart' },
  { id: 't13', name: 'RTI Application', description: 'Under Section 6 of RTI Act 2005', category: 'civil', time: '10 min', premium: false, icon: 'information-circle' },
  { id: 't14', name: 'Legal Notice (General)', description: 'General legal demand notice', category: 'notices', time: '15 min', premium: false, icon: 'alert-circle' },
  { id: 't15', name: 'Rent Agreement', description: 'Standard rental agreement template', category: 'agreements', time: '15 min', premium: false, icon: 'home' },
  { id: 't16', name: 'Non-Disclosure Agreement', description: 'NDA for business relationships', category: 'agreements', time: '10 min', premium: true, icon: 'lock-closed' },
  { id: 't17', name: 'Power of Attorney', description: 'General and special POA', category: 'civil', time: '15 min', premium: false, icon: 'key' },
  { id: 't18', name: 'Affidavit (General)', description: 'Sworn statement on oath', category: 'civil', time: '10 min', premium: false, icon: 'hand-right' },
];

export default function DraftsScreen() {
  const { colors, isDark } = useTheme();
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredTemplates = TEMPLATES.filter(
    (t) => selectedCategory === 'all' || t.category === selectedCategory
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* Header */}
        <Animated.View entering={FadeInDown.delay(100).springify()}>
          <Text style={[Typography.h1, { color: colors.text }]}>Drafting Studio</Text>
          <Text style={[Typography.bodySmall, { color: colors.textSecondary, marginTop: 4, marginBottom: Spacing.md }]}>
            {TEMPLATES.length} Templates • AI-assisted drafting
          </Text>
        </Animated.View>

        {/* My Recent Drafts */}
        <Animated.View entering={FadeInDown.delay(200).springify()}>
          <View style={styles.sectionHeader}>
            <Text style={[Typography.h3, { color: colors.text }]}>Recent Drafts</Text>
            <Pressable>
              <Text style={[Typography.bodySmallMedium, { color: colors.accent }]}>See All</Text>
            </Pressable>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.recentScroll}>
            {[
              { name: 'Bail Application — Patel', date: '2 hours ago', status: 'In Progress' },
              { name: 'Legal Notice — HDFC', date: 'Yesterday', status: 'Completed' },
              { name: 'Vakalatnama — Mehta', date: '3 days ago', status: 'Completed' },
            ].map((draft, i) => (
              <Animated.View key={i} entering={FadeInDown.delay(250 + i * 50).springify()}>
                <ParchmentCard
                  onPress={() => router.push('/modal/add-draft')}
                  variant="outlined"
                  padding="sm"
                  style={styles.recentDraftCard}
                >
                  <View style={styles.recentDraftIcon}>
                    <Ionicons name="document-text" size={20} color={colors.accent} />
                  </View>
                  <Text style={[Typography.bodySmallMedium, { color: colors.text }]} numberOfLines={1}>
                    {draft.name}
                  </Text>
                  <Text style={[Typography.caption, { color: colors.textTertiary }]}>{draft.date}</Text>
                  <View style={[styles.draftStatusBadge, {
                    backgroundColor: draft.status === 'Completed' ? `${colors.success}15` : `${colors.warning}15`,
                  }]}>
                    <Text style={[Typography.caption, {
                      color: draft.status === 'Completed' ? colors.success : colors.warning,
                    }]}>
                      {draft.status}
                    </Text>
                  </View>
                </ParchmentCard>
              </Animated.View>
            ))}
          </ScrollView>
        </Animated.View>

        {/* Category Filter */}
        <Animated.View entering={FadeInDown.delay(350).springify()}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
            {DRAFT_CATEGORIES.map((cat) => (
              <Pressable
                key={cat.id}
                style={[
                  styles.categoryPill,
                  {
                    backgroundColor: selectedCategory === cat.id ? colors.accent : isDark ? colors.surfaceSecondary : colors.surfaceSecondary,
                    borderColor: selectedCategory === cat.id ? colors.accent : colors.border,
                  },
                ]}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setSelectedCategory(cat.id);
                }}
              >
                <Text style={[Typography.bodySmallMedium, {
                  color: selectedCategory === cat.id ? '#0B1F3A' : colors.textSecondary,
                }]}>
                  {cat.label}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </Animated.View>

        {/* Templates List */}
        <Animated.View entering={FadeInDown.delay(450).springify()}>
          <Text style={[Typography.h3, { color: colors.text, marginBottom: Spacing.sm }]}>
            Templates
          </Text>
          {filteredTemplates.map((template, i) => (
            <Animated.View key={template.id} entering={FadeInDown.delay(500 + i * AnimationConfig.stagger).springify()}>
              <ParchmentCard
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  router.push('/modal/add-draft');
                }}
                variant="outlined"
                padding="md"
                style={styles.templateCard}
              >
                <View style={styles.templateRow}>
                  <View style={[styles.templateIcon, { backgroundColor: `${colors.accent}10` }]}>
                    <Ionicons name={template.icon as any} size={22} color={colors.accent} />
                  </View>
                  <View style={styles.templateContent}>
                    <View style={styles.templateHeader}>
                      <Text style={[Typography.bodyMedium, { color: colors.text, flex: 1 }]} numberOfLines={1}>
                        {template.name}
                      </Text>
                      {template.premium && (
                        <View style={[styles.premiumBadge, { backgroundColor: `${colors.accent}15` }]}>
                          <Ionicons name="diamond" size={10} color={colors.accent} />
                          <Text style={[Typography.caption, { color: colors.accent, marginLeft: 2 }]}>PRO</Text>
                        </View>
                      )}
                    </View>
                    <Text style={[Typography.bodySmall, { color: colors.textSecondary }]} numberOfLines={1}>
                      {template.description}
                    </Text>
                    <View style={styles.templateMeta}>
                      <Ionicons name="time-outline" size={12} color={colors.textTertiary} />
                      <Text style={[Typography.caption, { color: colors.textTertiary, marginLeft: 4 }]}>
                        ~{template.time}
                      </Text>
                    </View>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
                </View>
              </ParchmentCard>
            </Animated.View>
          ))}
        </Animated.View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: Spacing.md,
    paddingTop: Spacing.xs,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  recentScroll: {
    gap: Spacing.sm,
    paddingBottom: Spacing.lg,
  },
  recentDraftCard: {
    width: 180,
  },
  recentDraftIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(201,169,97,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xs,
  },
  draftStatusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BorderRadius.chip,
    marginTop: Spacing.xxs,
  },
  categoryScroll: {
    gap: Spacing.xs,
    paddingBottom: Spacing.lg,
  },
  categoryPill: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.pill,
    borderWidth: 1,
  },
  templateCard: {
    marginBottom: Spacing.xs,
  },
  templateRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  templateIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  templateContent: {
    flex: 1,
    marginLeft: Spacing.sm,
  },
  templateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BorderRadius.pill,
    marginLeft: Spacing.xs,
  },
  templateMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
});
