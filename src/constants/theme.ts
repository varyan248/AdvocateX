/**
 * AdvocateX Design System — Theme Constants
 * Color palette, typography, spacing, elevation, and animation tokens
 */

export const Colors = {
  light: {
    primary: '#0B1F3A',        // Deep Ink Navy
    accent: '#C9A961',         // Royal Gold
    accentLight: '#D4B87A',    // Lighter gold for hover states
    accentDark: '#A88B4A',     // Darker gold
    surface: '#FAF7F2',        // Ivory Parchment
    surfaceSecondary: '#F2EDE4', // Cards in light mode
    surfaceTertiary: '#EDE6D9',
    text: '#1A1A1A',           // Charcoal
    textSecondary: '#4A4A4A',
    textTertiary: '#7A7A7A',
    textInverse: '#FFFFFF',
    border: '#E0D8CB',
    borderLight: '#F0EAE0',
    success: '#1A7A4A',
    successLight: '#E8F5E9',
    warning: '#C17D0F',
    warningLight: '#FFF8E1',
    error: '#C0392B',
    errorLight: '#FFEBEE',
    info: '#1A5276',
    infoLight: '#E3F2FD',
    background: '#FAF7F2',
    card: '#FFFFFF',
    tabBar: '#FFFFFF',
    tabBarBorder: '#E0D8CB',
    statusBar: 'dark-content' as const,
    shimmer: ['#F2EDE4', '#FAF7F2', '#F2EDE4'],
    overlay: 'rgba(11, 31, 58, 0.5)',
    shadow: 'rgba(11, 31, 58, 0.08)',
  },
  dark: {
    primary: '#C9A961',        // Gold becomes primary in dark
    accent: '#C9A961',         // Royal Gold
    accentLight: '#D4B87A',
    accentDark: '#A88B4A',
    surface: '#000000',        // OLED Black
    surfaceSecondary: '#0E0E0E', // Dark mode cards
    surfaceTertiary: '#161616',  // Dark mode modals
    text: '#F5F5F5',
    textSecondary: '#B0B0B0',
    textTertiary: '#707070',
    textInverse: '#0B1F3A',
    border: '#1E1E1E',
    borderLight: '#2A2A2A',
    success: '#2ECC71',
    successLight: '#1A3A2A',
    warning: '#F39C12',
    warningLight: '#3A2F1A',
    error: '#E74C3C',
    errorLight: '#3A1A1A',
    info: '#3498DB',
    infoLight: '#1A2A3A',
    background: '#000000',
    card: '#0E0E0E',
    tabBar: '#0A0A0A',
    tabBarBorder: '#1E1E1E',
    statusBar: 'light-content' as const,
    shimmer: ['#0E0E0E', '#1A1A1A', '#0E0E0E'],
    overlay: 'rgba(0, 0, 0, 0.7)',
    shadow: 'rgba(0, 0, 0, 0.3)',
  },
} as const;

export const Typography = {
  // Display/Hero — for section headers and law act titles
  display: {
    fontFamily: 'Fraunces_700Bold',
    fontSize: 32,
    lineHeight: 40,
    letterSpacing: -0.5,
  },
  displaySmall: {
    fontFamily: 'Fraunces_600SemiBold',
    fontSize: 24,
    lineHeight: 32,
    letterSpacing: -0.3,
  },
  // Headings — for screen titles and judgment headings
  h1: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 28,
    lineHeight: 36,
    letterSpacing: -0.3,
  },
  h2: {
    fontFamily: 'PlayfairDisplay_600SemiBold',
    fontSize: 22,
    lineHeight: 28,
    letterSpacing: -0.2,
  },
  h3: {
    fontFamily: 'PlayfairDisplay_600SemiBold',
    fontSize: 18,
    lineHeight: 24,
    letterSpacing: 0,
  },
  // Body/UI — for all functional UI text
  bodyLarge: {
    fontFamily: 'Inter_500Medium',
    fontSize: 18,
    lineHeight: 28,
    letterSpacing: 0,
  },
  body: {
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0,
  },
  bodyMedium: {
    fontFamily: 'Inter_500Medium',
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0,
  },
  bodySemibold: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0,
  },
  bodySmall: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.1,
  },
  bodySmallMedium: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.1,
  },
  caption: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.2,
  },
  captionMedium: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.2,
  },
  overline: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 11,
    lineHeight: 16,
    letterSpacing: 1.5,
    textTransform: 'uppercase' as const,
  },
  // Mono — for section numbers and legal codes
  mono: {
    fontFamily: 'JetBrainsMono_500Medium',
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0,
  },
  monoLarge: {
    fontFamily: 'JetBrainsMono_600SemiBold',
    fontSize: 18,
    lineHeight: 24,
    letterSpacing: 0,
  },
  // Button text
  button: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0.5,
  },
  buttonSmall: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.5,
  },
} as const;

export const Spacing = {
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  '2xl': 32,
  '3xl': 40,
  '4xl': 48,
  '5xl': 64,
} as const;

export const BorderRadius = {
  chip: 4,
  button: 8,
  input: 8,
  card: 16,
  modal: 24,
  pill: 999,
} as const;

export const Elevation = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  xs: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    elevation: 1,
  },
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
} as const;

export const AnimationConfig = {
  spring: {
    default: { mass: 0.8, damping: 15, stiffness: 150 },
    gentle: { mass: 1, damping: 20, stiffness: 100 },
    bouncy: { mass: 0.6, damping: 12, stiffness: 200 },
    stiff: { mass: 0.8, damping: 20, stiffness: 300 },
  },
  timing: {
    fast: 150,
    normal: 300,
    slow: 500,
    shimmer: 1500,
  },
  stagger: 30, // ms between list items
} as const;

export const HapticTypes = {
  navigation: 'light' as const,
  primaryAction: 'medium' as const,
  error: 'heavy' as const,
  selection: 'light' as const,
  success: 'medium' as const,
} as const;
