/**
 * Tab Layout — 5-tab bottom navigation with morphing indicator
 */
import React from 'react';
import { Tabs } from 'expo-router';
import { StyleSheet, View, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../src/providers/ThemeProvider';
import { Typography, Elevation } from '../../src/constants/theme';
import { VakilOrb } from '../../src/components/ui/VakilOrb';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

interface TabIconProps {
  name: IoniconsName;
  color: string;
  focused: boolean;
  size: number;
}

const TabIcon: React.FC<TabIconProps> = ({ name, color, focused, size }) => {
  return (
    <View style={styles.tabIconContainer}>
      {focused && (
        <View style={[styles.activeIndicator, { backgroundColor: `${color}20` }]} />
      )}
      <Ionicons name={name} size={size} color={color} />
    </View>
  );
};

export default function TabLayout() {
  const { colors, isDark } = useTheme();
  const router = useRouter();
  const { t } = useTranslation();

  const activeColor = colors.accent;
  const inactiveColor = isDark ? '#5A5A5A' : '#9A9A9A';

  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: activeColor,
          tabBarInactiveTintColor: inactiveColor,
          tabBarStyle: {
            backgroundColor: colors.tabBar,
            borderTopColor: colors.tabBarBorder,
            borderTopWidth: 0.5,
            height: Platform.OS === 'ios' ? 88 : 68,
            paddingBottom: Platform.OS === 'ios' ? 28 : 8,
            paddingTop: 8,
            ...Elevation.xs,
          },
          tabBarLabelStyle: {
            ...Typography.caption,
            fontSize: 11,
            marginTop: 2,
          },
        }}
        screenListeners={{
          tabPress: () => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: t('tabs.dashboard', 'Home'),
            tabBarIcon: ({ color, focused, size }) => (
              <TabIcon
                name={focused ? 'home' : 'home-outline'}
                color={color}
                focused={focused}
                size={22}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="library"
          options={{
            title: t('tabs.library', 'Library'),
            tabBarIcon: ({ color, focused, size }) => (
              <TabIcon
                name={focused ? 'book' : 'book-outline'}
                color={color}
                focused={focused}
                size={22}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="cases"
          options={{
            title: t('tabs.cases', 'Cases'),
            tabBarIcon: ({ color, focused, size }) => (
              <TabIcon
                name={focused ? 'briefcase' : 'briefcase-outline'}
                color={color}
                focused={focused}
                size={22}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="drafts"
          options={{
            title: 'Drafts',
            tabBarIcon: ({ color, focused, size }) => (
              <TabIcon
                name={focused ? 'document-text' : 'document-text-outline'}
                color={color}
                focused={focused}
                size={22}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: t('tabs.profile', 'Profile'),
            tabBarIcon: ({ color, focused, size }) => (
              <TabIcon
                name={focused ? 'person' : 'person-outline'}
                color={color}
                focused={focused}
                size={22}
              />
            ),
          }}
        />
      </Tabs>

      {/* Floating Vakil AI Orb */}
      <VakilOrb onPress={() => router.push('/modal/ai-chat')} />
    </>
  );
}

const styles = StyleSheet.create({
  tabIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 44,
    height: 28,
  },
  activeIndicator: {
    position: 'absolute',
    width: 44,
    height: 28,
    borderRadius: 14,
  },
});
