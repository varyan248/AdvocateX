/**
 * Profile & Settings — Advocate card, subscription, and settings
 */
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { useTheme } from '../../src/providers/ThemeProvider';
import { useSettingsStore } from '../../src/stores/settingsStore';
import { useTranslation } from 'react-i18next';
import {
  Typography,
  Spacing,
  BorderRadius,
  Elevation,
} from '../../src/constants/theme';
import { ParchmentCard, GoldButton } from '../../src/components/ui';

import { useAuthStore } from '../../src/stores/authStore';

export default function ProfileScreen() {
  const { colors, isDark } = useTheme();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const settings = useSettingsStore();
  const { t } = useTranslation();

  const LANG_NAMES: Record<string, string> = { gu: 'ગુજરાતી', mr: 'मराठी', hi: 'हिंदी', en: 'English' };
  const LANGUAGES = ['gu', 'mr', 'hi', 'en'];

  const MENU_SECTIONS = [
    {
      title: 'Library',
      items: [
        { id: 'bookmarks', icon: 'bookmark', label: 'Bookmarks', count: 24 },
        { id: 'highlights', icon: 'color-palette', label: 'Highlights & Notes', count: 67 },
        { id: 'templates', icon: 'document-text', label: 'My Templates', count: 5 },
        { id: 'downloads', icon: 'cloud-download', label: 'Downloaded Acts', count: 8 },
      ],
    },
    {
      title: t('profile.preferences', 'Preferences'),
      items: [
        { id: 'theme', icon: 'moon', label: t('profile.appearance', 'Appearance'), value: 'System' },
        { id: 'fontsize', icon: 'text', label: 'Font Size', value: '16px' },
        { id: 'language', icon: 'language', label: t('profile.language', 'Language'), value: LANG_NAMES[settings.defaultLanguage] || LANG_NAMES['gu'] },
        { id: 'notifications', icon: 'notifications', label: 'Notifications', toggle: true },
      ],
    },
    {
      title: 'Security',
      items: [
        { id: 'biometric', icon: 'finger-print', label: 'Biometric Lock', toggle: true },
        { id: 'autolock', icon: 'lock-closed', label: 'Auto-Lock', value: '5 min' },
        { id: 'export', icon: 'download', label: 'Export My Data' },
        { id: 'logout', icon: 'log-out', label: 'Log Out', danger: true },
        { id: 'delete', icon: 'trash', label: 'Delete Account', danger: true },
      ],
    },
    {
      title: 'Legal',
      items: [
        { id: 'privacy', icon: 'shield-checkmark', label: 'Privacy Policy' },
        { id: 'terms', icon: 'document', label: 'Terms of Service' },
        { id: 'dpdp', icon: 'lock-closed', label: 'DPDP Compliance' },
      ],
    },
    {
      title: 'Support',
      items: [
        { id: 'whatsapp', icon: 'logo-whatsapp', label: 'WhatsApp Support' },
        { id: 'faq', icon: 'help-circle', label: 'FAQ' },
        { id: 'feedback', icon: 'chatbubble-ellipses', label: 'Send Feedback' },
      ],
    },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* Advocate Card */}
        <Animated.View entering={FadeInDown.delay(100).springify()}>
          <LinearGradient
            colors={isDark ? ['#161616', '#0E0E0E'] : ['#0B1F3A', '#162D4F']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.advocateCard}
          >
            <View style={styles.advocateHeader}>
              <View style={styles.avatarLarge}>
                <LinearGradient
                  colors={['#D4B87A', '#C9A961']}
                  style={styles.avatarGradient}
                >
                  <Text style={[Typography.h2, { color: '#0B1F3A' }]}>AM</Text>
                </LinearGradient>
              </View>
              <Pressable style={styles.editButton}>
                <Ionicons name="pencil" size={16} color="#C9A961" />
              </Pressable>
            </View>

            <Text style={[Typography.h2, { color: '#FFFFFF', marginTop: Spacing.sm }]}>
              Adv. {user?.name || 'Arjun Mehta'}
            </Text>
            <Text style={[Typography.bodySmall, { color: 'rgba(255,255,255,0.7)', marginTop: 2 }]}>
              {user?.enrollmentNumber || 'GJ/1234/2019'} • High Court of Gujarat
            </Text>

            <View style={styles.advocateDetails}>
              <View style={styles.detailChip}>
                <Ionicons name="briefcase-outline" size={14} color="#C9A961" />
                <Text style={[Typography.caption, { color: 'rgba(255,255,255,0.7)', marginLeft: 4 }]}>
                  Criminal & Family Law
                </Text>
              </View>
              <View style={styles.detailChip}>
                <Ionicons name="location-outline" size={14} color="#C9A961" />
                <Text style={[Typography.caption, { color: 'rgba(255,255,255,0.7)', marginLeft: 4 }]}>
                  Ahmedabad
                </Text>
              </View>
            </View>

            {/* Verified Badge */}
            <View style={styles.verifiedBadge}>
              <Ionicons name="checkmark-circle" size={14} color="#1A7A4A" />
              <Text style={[Typography.captionMedium, { color: '#1A7A4A', marginLeft: 4 }]}>
                Verified Advocate
              </Text>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Subscription Card */}
        <Animated.View entering={FadeInDown.delay(200).springify()}>
          <ParchmentCard variant="outlined" style={styles.subscriptionCard}>
            <View style={styles.subscriptionHeader}>
              <View>
                <View style={styles.tierBadge}>
                  <Ionicons name="diamond" size={14} color="#C9A961" />
                  <Text style={[Typography.bodySemibold, { color: colors.accent, marginLeft: 4 }]}>
                    Free Plan
                  </Text>
                </View>
                <Text style={[Typography.bodySmall, { color: colors.textSecondary, marginTop: 4 }]}>
                  3 AI queries/day • 2 active cases • 5 templates
                </Text>
              </View>
            </View>
            <GoldButton
              title="Upgrade to Pro — ₹299/mo"
              onPress={() => {}}
              fullWidth
              size="md"
              icon={<Ionicons name="rocket" size={16} color="#0B1F3A" />}
              style={{ marginTop: Spacing.sm }}
            />
            <Text style={[Typography.caption, { color: colors.textTertiary, textAlign: 'center', marginTop: Spacing.xs }]}>
              14-day free trial • Cancel anytime
            </Text>
          </ParchmentCard>
        </Animated.View>

        {/* Menu Sections */}
        {MENU_SECTIONS.map((section, si) => (
          <Animated.View
            key={section.title}
            entering={FadeInDown.delay(300 + si * 80).springify()}
          >
            <Text style={[Typography.overline, { color: colors.textTertiary, marginBottom: Spacing.xs, marginTop: Spacing.md }]}>
              {section.title}
            </Text>
            <ParchmentCard variant="outlined" padding="xxs">
              {section.items.map((item, ii) => (
                <Pressable
                  key={item.id}
                  style={[
                    styles.menuItem,
                    ii < section.items.length - 1 && {
                      borderBottomWidth: 0.5,
                      borderBottomColor: colors.border,
                    },
                  ]}
                  onPress={() => {
                    if (!item.toggle) {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    }
                    if (item.id === 'language') {
                      const currentIndex = LANGUAGES.indexOf(settings.defaultLanguage);
                      const nextLang = LANGUAGES[(currentIndex + 1) % LANGUAGES.length];
                      settings.setDefaultLanguage(nextLang);
                    }
                    if (item.id === 'logout') {
                      useAuthStore.getState().signOut();
                      router.replace('/(auth)/login');
                    }
                  }}
                >
                  <View style={[styles.menuIcon, {
                    backgroundColor: item.danger ? `${colors.error}10` : `${colors.accent}10`,
                  }]}>
                    <Ionicons
                      name={item.icon as any}
                      size={18}
                      color={item.danger ? colors.error : colors.accent}
                    />
                  </View>
                  <Text style={[Typography.body, {
                    color: item.danger ? colors.error : colors.text,
                    flex: 1,
                  }]}>
                    {item.label}
                  </Text>
                  {item.count !== undefined && (
                    <View style={[styles.countBadge, { backgroundColor: `${colors.accent}15` }]}>
                      <Text style={[Typography.captionMedium, { color: colors.accent }]}>
                        {item.count}
                      </Text>
                    </View>
                  )}
                  {item.value && (
                    <Text style={[Typography.bodySmall, { color: colors.textTertiary }]}>
                      {item.value}
                    </Text>
                  )}
                  {item.toggle ? (
                    <Switch
                      value={
                        item.id === 'notifications'
                          ? settings.notificationsEnabled
                          : item.id === 'biometric'
                          ? settings.biometricEnabled
                          : false
                      }
                      onValueChange={(v) => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        if (item.id === 'notifications') settings.setNotificationsEnabled(v);
                        if (item.id === 'biometric') settings.setBiometricEnabled(v);
                      }}
                      trackColor={{ false: colors.border, true: `${colors.accent}60` }}
                      thumbColor={colors.accent}
                    />
                  ) : (
                    <Ionicons name="chevron-forward" size={16} color={colors.textTertiary} />
                  )}
                </Pressable>
              ))}
            </ParchmentCard>
          </Animated.View>
        ))}

        {/* App Version */}
        <Animated.View entering={FadeInDown.delay(700).springify()} style={styles.footer}>
          <Text style={[Typography.caption, { color: colors.textTertiary, textAlign: 'center' }]}>
            AdvocateX v1.0.0
          </Text>
          <Text style={[Typography.caption, { color: colors.textTertiary, textAlign: 'center', marginTop: 2 }]}>
            Made with ⚖️ for Indian Advocates
          </Text>
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
  advocateCard: {
    borderRadius: BorderRadius.card,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
  },
  advocateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  avatarLarge: {
    width: 72,
    height: 72,
    borderRadius: 36,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: '#C9A961',
  },
  avatarGradient: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  editButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(201,169,97,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  advocateDetails: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
  detailChip: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(26,122,74,0.15)',
    paddingHorizontal: Spacing.xs,
    paddingVertical: 4,
    borderRadius: BorderRadius.pill,
    alignSelf: 'flex-start',
    marginTop: Spacing.sm,
  },
  subscriptionCard: {
    marginBottom: Spacing.xs,
  },
  subscriptionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  tierBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.sm,
  },
  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  countBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: BorderRadius.pill,
    marginRight: Spacing.xs,
  },
  footer: {
    paddingVertical: Spacing.xl,
  },
});
