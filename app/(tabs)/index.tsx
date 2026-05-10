/**
 * Home Dashboard — Main screen with greetings, hearings, quick actions, and briefing
 */
import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Dimensions,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  FadeInDown,
  FadeInRight,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { useTheme } from '../../src/providers/ThemeProvider';
import { useAuthStore } from '../../src/stores/authStore';
import {
  Typography,
  Spacing,
  BorderRadius,
  Elevation,
  AnimationConfig,
} from '../../src/constants/theme';
import { ParchmentCard, HearingCard, GoldButton } from '../../src/components/ui';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Sample data
const SAMPLE_HEARINGS = [
  {
    id: '1',
    caseTitle: 'ગુજરાત રાજ્ય વિ. રમેશ પટેલ',
    caseNumber: 'CC No. 234/2024',
    courtName: 'સેશન્સ કોર્ટ, અમદાવાદ',
    date: '2025-01-15',
    purpose: 'આક્ષેપ પર દલીલો',
    urgency: 'today' as const,
  },
  {
    id: '2',
    caseTitle: 'પ્રિયા મહેતા વિ. સંજય મહેતા',
    caseNumber: 'Mat.Case No. 112/2024',
    courtName: 'ફેમિલી કોર્ટ, સુરત',
    date: '2025-01-22',
    purpose: 'ઉલટતપાસ',
    urgency: 'soon' as const,
  },
  {
    id: '3',
    caseTitle: 'HDFC બેંક વિ. કે. સોલંકી',
    caseNumber: 'CC No. 88/2024',
    courtName: 'એમએમ કોર્ટ, વડોદરા',
    date: '2025-02-08',
    purpose: 'પુરાવા',
    urgency: 'normal' as const,
  },
];

const QUICK_ACTIONS = [
  { id: 'search', icon: 'search', label: 'કાયદો શોધો', color: '#1A5276', route: '/(tabs)/library' },
  { id: 'case', icon: 'add-circle', label: 'નવો કેસ', color: '#1A7A4A', route: '/(tabs)/cases' },
  { id: 'ai', icon: 'sparkles', label: 'AI ને પૂછો', color: '#C9A961', route: '/modal/ai-chat' },
  { id: 'draft', icon: 'create', label: 'નવો ડ્રાફ્ટ', color: '#6C3483', route: '/(tabs)/drafts' },
];

const AI_PROMPTS = [
  'BNSS હેઠળ જામીન અરજીનો ડ્રાફ્ટ બનાવો',
  'BNS કલમ 103 સમજાવો',
  'મની સૂટ રિકવરી માટે સમય મર્યાદા',
];

export default function HomeScreen() {
  const { colors, isDark } = useTheme();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'સુપ્રભાત';
    if (hour < 17) return 'શુભ બપોર';
    return 'શુભ સાંજ';
  }, []);

  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <Animated.View entering={FadeInDown.delay(100).springify()} style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={[Typography.h2, { color: colors.text }]}>
              {greeting},{' '}
              <Text style={{ color: colors.accent }}>
                Adv. {user?.name || 'Arjun'}
              </Text>
            </Text>
            <Text style={[Typography.bodySmall, { color: colors.textSecondary, marginTop: 4 }]}>
              {today}
            </Text>
          </View>
          <Pressable
            style={[styles.avatarContainer, { borderColor: colors.accent }]}
            onPress={() => router.push('/(tabs)/profile')}
            accessibilityRole="button"
            accessibilityLabel="View profile"
          >
            <LinearGradient
              colors={isDark ? ['#1A1A1A', '#0E0E0E'] : ['#F2EDE4', '#E8E0D4']}
              style={styles.avatar}
            >
              <Text style={[Typography.bodySemibold, { color: colors.accent }]}>
                {user?.name?.[0] || 'A'}M
              </Text>
            </LinearGradient>
          </Pressable>
        </Animated.View>

        {/* Announcement Banner */}
        <Animated.View entering={FadeInDown.delay(200).springify()}>
          <LinearGradient
            colors={isDark ? ['#1A1508', '#0E0E0E'] : ['#FBF5E8', '#FAF7F2']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.banner, { borderColor: `${colors.accent}30` }]}
          >
            <View style={styles.bannerIcon}>
              <Ionicons name="megaphone" size={20} color={colors.accent} />
            </View>
            <View style={styles.bannerContent}>
              <Text style={[Typography.bodySmallMedium, { color: colors.text }]}>
                BNS, BNSS & BSA now live
              </Text>
              <Text style={[Typography.caption, { color: colors.textSecondary }]}>
                All 3 new criminal laws with IPC/CrPC comparison mapping
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={colors.textTertiary} />
          </LinearGradient>
        </Animated.View>

        {/* Today's Hearings */}
        <Animated.View entering={FadeInDown.delay(300).springify()}>
          <View style={styles.sectionHeader}>
            <Text style={[Typography.h3, { color: colors.text }]}>
              આજની સુનાવણી
            </Text>
            <Pressable onPress={() => router.push('/(tabs)/cases')}>
              <Text style={[Typography.bodySmallMedium, { color: colors.accent }]}>
                બધા જુઓ
              </Text>
            </Pressable>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.hearingsScroll}
            decelerationRate="fast"
            snapToInterval={300}
          >
            {SAMPLE_HEARINGS.map((hearing, i) => (
              <Animated.View
                key={hearing.id}
                entering={FadeInRight.delay(400 + i * AnimationConfig.stagger).springify()}
              >
                <HearingCard
                  {...hearing}
                  onPress={() => router.push(`/(tabs)/cases`)}
                />
              </Animated.View>
            ))}
          </ScrollView>
        </Animated.View>

        {/* Quick Actions */}
        <Animated.View entering={FadeInDown.delay(500).springify()}>
          <Text style={[Typography.h3, { color: colors.text, marginBottom: Spacing.sm }]}>
            ઝડપી ક્રિયાઓ
          </Text>
          <View style={styles.actionsGrid}>
            {QUICK_ACTIONS.map((action, i) => (
              <QuickActionButton
                key={action.id}
                icon={action.icon as any}
                label={action.label}
                color={action.color}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  router.push(action.route as any);
                }}
                delay={600 + i * 50}
              />
            ))}
          </View>
        </Animated.View>

        {/* Vakil AI Quick Prompts */}
        <Animated.View entering={FadeInDown.delay(700).springify()}>
          <ParchmentCard
            style={[styles.aiPromptsCard]}
            variant="outlined"
          >
            <View style={styles.aiPromptsHeader}>
              <Ionicons name="sparkles" size={18} color={colors.accent} />
              <Text style={[Typography.bodyMedium, { color: colors.text, marginLeft: Spacing.xs }]}>
                વકીલ AI ને પૂછો
              </Text>
            </View>
            {AI_PROMPTS.map((prompt, i) => (
              <Pressable
                key={i}
                style={[
                  styles.promptChip,
                  { borderColor: colors.border, backgroundColor: isDark ? colors.surfaceTertiary : colors.surfaceSecondary },
                ]}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  router.push('/modal/ai-chat');
                }}
              >
                <Text style={[Typography.bodySmall, { color: colors.textSecondary }]}>
                  "{prompt}"
                </Text>
                <Ionicons name="arrow-forward" size={14} color={colors.accent} />
              </Pressable>
            ))}
          </ParchmentCard>
        </Animated.View>

        {/* Daily Briefing */}
        <Animated.View entering={FadeInDown.delay(800).springify()}>
          <Text style={[Typography.h3, { color: colors.text, marginBottom: Spacing.sm }]}>
            દૈનિક બ્રીફિંગ
          </Text>
          <ParchmentCard variant="outlined">
            <View style={styles.briefingHeader}>
              <View style={[styles.briefingBadge, { backgroundColor: `${colors.accent}20` }]}>
                <Ionicons name="newspaper" size={14} color={colors.accent} />
                <Text style={[Typography.captionMedium, { color: colors.accent, marginLeft: 4 }]}>
                  સુપ્રીમ કોર્ટનો ચુકાદો
                </Text>
              </View>
              <Text style={[Typography.caption, { color: colors.textTertiary }]}>આજે</Text>
            </View>
            <Text style={[Typography.bodyMedium, { color: colors.text, marginTop: Spacing.xs }]}>
              સુપ્રીમ કોર્ટે BNSS કલમ 482 હેઠળ આગોતરા જામીનના અવકાશની સ્પષ્ટતા કરી
            </Text>
            <Text style={[Typography.bodySmall, { color: colors.textSecondary, marginTop: Spacing.xxs }]} numberOfLines={2}>
              ત્રણ ન્યાયાધીશોની બેન્ચે ચુકાદો આપ્યો કે કલમ 482 BNSS હેઠળની મુનસફીનો ઉપયોગ ગુનાની પ્રકૃતિ અને ગંભીરતાને ધ્યાનમાં રાખીને થવો જોઈએ...
            </Text>
            <Pressable style={styles.briefingCta}>
              <Text style={[Typography.bodySmallMedium, { color: colors.accent }]}>
                સંપૂર્ણ સારાંશ વાંચો
              </Text>
              <Ionicons name="arrow-forward" size={14} color={colors.accent} />
            </Pressable>
          </ParchmentCard>
        </Animated.View>

        {/* Recently Read */}
        <Animated.View entering={FadeInDown.delay(900).springify()}>
          <Text style={[Typography.h3, { color: colors.text, marginBottom: Spacing.sm }]}>
            વાંચન ચાલુ રાખો
          </Text>
          <View style={styles.recentGrid}>
            {[
              { act: 'BNS', section: '103', title: 'ખૂન', chapter: 'પ્રકરણ VI — માનવ શરીરને અસર કરતા ગુનાઓ' },
              { act: 'BNSS', section: '482', title: 'આગોતરા જામીન', chapter: 'પ્રકરણ XXXIII — જામીન અને બોન્ડ્સ' },
              { act: 'Constitution', section: '21', title: 'જીવનનો અધિકાર', chapter: 'ભાગ III — મૂળભૂત અધિકારો' },
            ].map((item, i) => (
              <ParchmentCard
                key={i}
                onPress={() => router.push('/(tabs)/library')}
                variant="outlined"
                padding="sm"
                style={styles.recentCard}
              >
                <View style={[styles.recentActBadge, { backgroundColor: `${colors.accent}15` }]}>
                  <Text style={[Typography.captionMedium, { color: colors.accent }]}>
                    {item.act}
                  </Text>
                </View>
                <Text style={[Typography.monoLarge, { color: colors.accent, marginTop: Spacing.xxs }]}>
                  §{item.section}
                </Text>
                <Text style={[Typography.bodySmallMedium, { color: colors.text }]} numberOfLines={1}>
                  {item.title}
                </Text>
                <Text style={[Typography.caption, { color: colors.textTertiary }]} numberOfLines={1}>
                  {item.chapter}
                </Text>
              </ParchmentCard>
            ))}
          </View>
        </Animated.View>

        {/* Limitation Reminders */}
        <Animated.View entering={FadeInDown.delay(1000).springify()}>
          <ParchmentCard
            variant="outlined"
            style={[styles.limitationCard, { borderColor: `${colors.error}30` }]}
            onPress={() => router.push('/(tabs)/cases')}
          >
            <View style={styles.limitationHeader}>
              <View style={[styles.limitationBadge, { backgroundColor: `${colors.error}15` }]}>
                <Ionicons name="alert-circle" size={16} color={colors.error} />
              </View>
              <View style={{ flex: 1, marginLeft: Spacing.sm }}>
                <Text style={[Typography.bodySmallMedium, { color: colors.error }]}>
                  સમયમર્યાદા નજીક આવી રહી છે
                </Text>
                <Text style={[Typography.caption, { color: colors.textSecondary }]}>
                  HDFC બેંક વિ. સોલંકી — 5 દિવસમાં જવાબ બાકી
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={colors.textTertiary} />
            </View>
          </ParchmentCard>
        </Animated.View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// Quick Action Button Component
interface QuickActionButtonProps {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  label: string;
  color: string;
  onPress: () => void;
  delay: number;
}

const QuickActionButton: React.FC<QuickActionButtonProps> = ({
  icon,
  label,
  color,
  onPress,
  delay,
}) => {
  const { colors, isDark } = useTheme();
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View entering={FadeInDown.delay(delay).springify()}>
      <Pressable
        onPress={onPress}
        onPressIn={() => {
          scale.value = withSpring(0.93, AnimationConfig.spring.default);
        }}
        onPressOut={() => {
          scale.value = withSpring(1, AnimationConfig.spring.bouncy);
        }}
        style={styles.actionButtonWrap}
      >
        <Animated.View style={animStyle}>
          <View
            style={[
              styles.actionButton,
              {
                backgroundColor: isDark ? colors.surfaceSecondary : `${color}0D`,
                borderColor: isDark ? colors.border : `${color}20`,
              },
            ]}
          >
            <View style={[styles.actionIconWrap, { backgroundColor: `${color}15` }]}>
              <Ionicons name={icon} size={22} color={color} />
            </View>
            <Text
              style={[
                Typography.captionMedium,
                { color: colors.text, marginTop: Spacing.xs },
              ]}
            >
              {label}
            </Text>
          </View>
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.md,
    paddingTop: Spacing.xs,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  headerLeft: {
    flex: 1,
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    overflow: 'hidden',
  },
  avatar: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.sm,
    borderRadius: BorderRadius.card,
    borderWidth: 1,
    marginBottom: Spacing.lg,
  },
  bannerIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(201,169,97,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerContent: {
    flex: 1,
    marginLeft: Spacing.sm,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  hearingsScroll: {
    paddingRight: Spacing.md,
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  actionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.xl,
  },
  actionButtonWrap: {
    width: (SCREEN_WIDTH - Spacing.md * 2 - Spacing.sm * 3) / 4,
  },
  actionButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.card,
    borderWidth: 1,
  },
  actionIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiPromptsCard: {
    marginBottom: Spacing.xl,
  },
  aiPromptsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  promptChip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.button,
    borderWidth: 1,
    marginBottom: Spacing.xs,
  },
  briefingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  briefingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.xs,
    paddingVertical: 2,
    borderRadius: BorderRadius.chip,
  },
  briefingCta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: Spacing.sm,
    paddingTop: Spacing.sm,
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  recentGrid: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  recentCard: {
    flex: 1,
  },
  recentActBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BorderRadius.chip,
    alignSelf: 'flex-start',
  },
  limitationCard: {
    marginBottom: Spacing.lg,
  },
  limitationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  limitationBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
