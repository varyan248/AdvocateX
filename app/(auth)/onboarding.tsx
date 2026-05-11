/**
 * Onboarding — 4 swipeable slides with progress dots
 */
import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  Pressable,
  ViewToken,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInUp, FadeIn } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../src/stores/authStore';
import { Typography, Spacing, BorderRadius } from '../../src/constants/theme';

const { width, height } = Dimensions.get('window');

const SLIDES = [
  {
    id: '1',
    icon: 'library',
    iconBg: '#1A5276',
    title: 'Every Indian Act.\nOffline. Instant.',
    subtitle: 'Access BNS, BNSS, BSA, IPC, CrPC, Constitution and 20+ bare acts — all searchable in under 80ms, even without internet.',
    features: ['Full-text search', 'Section annotations', 'Cross-references'],
  },
  {
    id: '2',
    icon: 'git-compare',
    iconBg: '#C9A961',
    title: 'Old Law vs New Law.\nKnow the Difference.',
    subtitle: 'Compare IPC ↔ BNS, CrPC ↔ BNSS, Evidence Act ↔ BSA with word-level diff highlighting.',
    features: ['Word-level diffs', 'Section mapping', 'Export as PDF'],
  },
  {
    id: '3',
    icon: 'sparkles',
    iconBg: '#6C3483',
    title: 'Ask Vakil AI\nAnything. In Any Language.',
    subtitle: 'AI-powered legal research in English, Hindi, Gujarati, Marathi, Tamil, Telugu, and more.',
    features: ['10 languages', 'Citation-backed', 'Draft assistance'],
  },
  {
    id: '4',
    icon: 'calendar',
    iconBg: '#1A7A4A',
    title: 'Your Court.\nYour Calendar.\nYour Cases.',
    subtitle: 'Track hearings, manage case files, get reminders, and draft documents — all in one app.',
    features: ['Case management', 'Hearing alerts', '200+ templates'],
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { setOnboarded } = useAuthStore();

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index !== null) {
        setCurrentIndex(viewableItems[0].index);
      }
    }
  ).current;

  const handleNext = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (currentIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1, animated: true });
    } else {
      handleGetStarted();
    }
  };

  const handleSkip = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    handleGetStarted();
  };

  const handleGetStarted = () => {
    setOnboarded(true);
    router.replace('/(auth)/login');
  };

  const renderSlide = ({ item, index }: { item: typeof SLIDES[0]; index: number }) => (
    <View style={styles.slide}>
      {/* Icon */}
      <Animated.View entering={FadeInDown.delay(200).springify()}>
        <View style={[styles.slideIcon, { backgroundColor: `${item.iconBg}15` }]}>
          <LinearGradient
            colors={[`${item.iconBg}90`, item.iconBg]}
            style={styles.slideIconInner}
          >
            <Ionicons name={item.icon as any} size={44} color="#FFF" />
          </LinearGradient>
        </View>
      </Animated.View>

      {/* Title */}
      <Animated.View entering={FadeInDown.delay(350).springify()}>
        <Text style={styles.slideTitle}>{item.title}</Text>
      </Animated.View>

      {/* Subtitle */}
      <Animated.View entering={FadeInDown.delay(450).springify()}>
        <Text style={styles.slideSubtitle}>{item.subtitle}</Text>
      </Animated.View>

      {/* Features */}
      <Animated.View entering={FadeInDown.delay(550).springify()} style={styles.featuresRow}>
        {item.features.map((f, fi) => (
          <View key={fi} style={styles.featureChip}>
            <Ionicons name="checkmark-circle" size={14} color="#C9A961" />
            <Text style={styles.featureText}>{f}</Text>
          </View>
        ))}
      </Animated.View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Skip Button */}
      <Pressable style={styles.skipButton} onPress={handleSkip}>
        <Text style={styles.skipText}>Skip</Text>
      </Pressable>

      <FlatList
        ref={flatListRef}
        data={SLIDES}
        renderItem={renderSlide}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
        bounces={false}
      />

      {/* Bottom Controls */}
      <View style={styles.bottomControls}>
        {/* Progress Dots */}
        <View style={styles.dotsRow}>
          {SLIDES.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                {
                  backgroundColor: i === currentIndex ? '#C9A961' : 'rgba(201,169,97,0.25)',
                  width: i === currentIndex ? 24 : 8,
                },
              ]}
            />
          ))}
        </View>

        {/* Next / Get Started Button */}
        <Pressable style={styles.nextButton} onPress={handleNext}>
          <LinearGradient
            colors={['#D4B87A', '#C9A961', '#A88B4A']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.nextButtonGradient}
          >
            <Text style={styles.nextButtonText}>
              {currentIndex === SLIDES.length - 1 ? 'Get Started' : 'Next'}
            </Text>
            <Ionicons
              name={currentIndex === SLIDES.length - 1 ? 'arrow-forward' : 'chevron-forward'}
              size={18}
              color="#0B1F3A"
            />
          </LinearGradient>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  skipButton: {
    position: 'absolute',
    top: 60,
    right: 24,
    zIndex: 10,
  },
  skipText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 16,
    color: 'rgba(201,169,97,0.6)',
  },
  slide: {
    width,
    paddingHorizontal: 32,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 80,
  },
  slideIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing['2xl'],
  },
  slideIconInner: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  slideTitle: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 32,
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 40,
    marginBottom: Spacing.md,
  },
  slideSubtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    color: 'rgba(255,255,255,0.6)',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 16,
  },
  featuresRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.xl,
  },
  featureChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(201,169,97,0.08)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: BorderRadius.pill,
    gap: 4,
  },
  featureText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
  },
  bottomControls: {
    paddingHorizontal: 32,
    paddingBottom: 60,
    gap: Spacing.xl,
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  nextButton: {
    borderRadius: BorderRadius.button,
    overflow: 'hidden',
  },
  nextButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    gap: Spacing.xs,
  },
  nextButtonText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    color: '#0B1F3A',
  },
});
