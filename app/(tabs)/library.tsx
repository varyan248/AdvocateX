/**
 * Library Home — Law Library with search, categories, and act grid
 */
import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
  FlatList,
  Dimensions,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
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
import { ParchmentCard, GoldButton } from '../../src/components/ui';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const CATEGORIES = [
  { id: 'all', label: 'બધા કાયદા', icon: 'library' },
  { id: 'criminal', label: 'ફોજદારી', icon: 'shield' },
  { id: 'civil', label: 'સિવિલ', icon: 'document' },
  { id: 'constitutional', label: 'બંધારણીય', icon: 'flag' },
  { id: 'corporate', label: 'કોર્પોરેટ', icon: 'business' },
  { id: 'family', label: 'ફેમિલી', icon: 'people' },
  { id: 'labour', label: 'મજૂર', icon: 'construct' },
  { id: 'tax', label: 'કરવેરા', icon: 'calculator' },
  { id: 'ip', label: 'આઈપી', icon: 'bulb' },
  { id: 'special', label: 'ખાસ', icon: 'star' },
];

const ACTS_DATA = [
  { id: 'bns', name: 'ભારતીય ન્યાય સંહિતા', shortName: 'BNS', year: '2023', sections: 358, category: 'criminal', isNew: true, description: 'IPC 1860 નું સ્થાન લે છે. ફોજદારી ગુનાઓ અને સજા.', example: 'કલમ 103 હેઠળ હત્યા માટે સજા.', offline: true },
  { id: 'bnss', name: 'ભારતીય નાગરિક સુરક્ષા સંહિતા', shortName: 'BNSS', year: '2023', sections: 531, category: 'criminal', isNew: true, description: 'CrPC 1973 નું સ્થાન લે છે. ફોજદારી પ્રક્રિયા.', example: 'કલમ 482 હેઠળ આગોતરા જામીન.', offline: true },
  { id: 'bsa', name: 'ભારતીય સાક્ષ્ય અધિનિયમ', shortName: 'BSA', year: '2023', sections: 170, category: 'criminal', isNew: true, description: 'પુરાવા કાયદા 1872 નું સ્થાન લે છે.', example: 'ઇલેક્ટ્રોનિક રેકોર્ડ્સની સ્વીકૃતિ.', offline: true },
  { id: 'ipc', name: 'ભારતીય દંડ સંહિતા', shortName: 'IPC', year: '1860', sections: 511, category: 'criminal', isNew: false, description: 'સામાન્ય ફોજદારી ગુનાઓ. હવે BNS દ્વારા બદલવામાં આવી છે.', example: 'ચોરી, છેતરપિંડી, હત્યા.', offline: true },
  { id: 'crpc', name: 'ફોજદારી પ્રક્રિયા સંહિતા', shortName: 'CrPC', year: '1973', sections: 484, category: 'criminal', isNew: false, description: 'ફોજદારી કેસો માટેની પ્રક્રિયા. હવે BNSS દ્વારા બદલાઈ ગઈ છે.', example: 'પોલીસ ધરપકડ અને જામીનની પ્રક્રિયા.', offline: true },
  { id: 'evidence', name: 'ભારતીય પુરાવા અધિનિયમ', shortName: 'IEA', year: '1872', sections: 167, category: 'criminal', isNew: false, description: 'પુરાવાઓનો કાયદો. હવે BSA દ્વારા બદલવામાં આવ્યો છે.', example: 'કોર્ટમાં મૌખિક અને દસ્તાવેજી પુરાવા.', offline: true },
  { id: 'constitution', name: 'ભારતનું બંધારણ', shortName: 'CoI', year: '1950', sections: 448, category: 'constitutional', isNew: false, description: 'સર્વોચ્ચ કાયદો. મૂળભૂત અધિકારો અને રાજ્યના સિદ્ધાંતો.', example: 'કલમ 21 - જીવન અને સ્વતંત્રતાનો અધિકાર.', offline: true },
  { id: 'contract', name: 'ભારતીય કરાર અધિનિયમ', shortName: 'ICA', year: '1872', sections: 238, category: 'civil', isNew: false, description: 'કરારના સામાન્ય સિદ્ધાંતો.', example: 'કરારનો ભંગ અને નુકસાનીનો દાવો.', offline: true },
  { id: 'cpc', name: 'સિવિલ પ્રોસિજર કોડ', shortName: 'CPC', year: '1908', sections: 158, category: 'civil', isNew: false, description: 'સિવિલ કેસો માટે પ્રક્રિયા.', example: 'મિલકત વિવાદ માટે દાવો દાખલ કરવો.', offline: true },
  { id: 'hma', name: 'હિન્દુ લગ્ન અધિનિયમ', shortName: 'HMA', year: '1955', sections: 30, category: 'family', isNew: false, description: 'લગ્ન, છૂટાછેડા સંબંધિત કાયદો.', example: 'પરસ્પર સંમતિથી છૂટાછેડાની અરજી.', offline: true },
  { id: 'ni', name: 'નેગોશિયેબલ ઇન્સ્ટ્રુમેન્ટ્સ એક્ટ', shortName: 'NI Act', year: '1881', sections: 147, category: 'civil', isNew: false, description: 'પ્રોમિસરી નોટ્સ, ચેક અને બિલ.', example: 'ચેક બાઉન્સ (કલમ 138).', offline: true },
  { id: 'ndps', name: 'NDPS એક્ટ', shortName: 'NDPS', year: '1985', sections: 83, category: 'criminal', isNew: false, description: 'નાર્કોટિક ડ્રગ્સ નિયંત્રણ.', example: 'ગેરકાયદેસર ડ્રગ્સ રાખવા પર સજા.', offline: true },
  { id: 'pocso', name: 'પોક્સો એક્ટ', shortName: 'POCSO', year: '2012', sections: 46, category: 'criminal', isNew: false, description: 'બાળકોને જાતીય ગુનાઓથી રક્ષણ.', example: 'સગીર સાથે જાતીય સતામણી પર કડક સજા.', offline: true },
  { id: 'consumer', name: 'ગ્રાહક સુરક્ષા અધિનિયમ', shortName: 'CPA', year: '2019', sections: 107, category: 'civil', isNew: false, description: 'ગ્રાહક અધિકારો અને વિવાદો.', example: 'ખામીયુક્ત ઉત્પાદનો સામે ગ્રાહક કોર્ટમાં ફરિયાદ.', offline: true },
  { id: 'it', name: 'ઇન્ફોર્મેશન ટેકનોલોજી એક્ટ', shortName: 'IT Act', year: '2000', sections: 90, category: 'special', isNew: false, description: 'સાયબર ગુનાઓ અને ઇલેક્ટ્રોનિક રેકોર્ડ્સ.', example: 'ઓનલાઇન છેતરપિંડી કે હેકિંગ.', offline: true },
  { id: 'companies', name: 'કંપની એક્ટ', shortName: 'CA', year: '2013', sections: 470, category: 'corporate', isNew: false, description: 'કંપનીનું સંચાલન અને નિયમન.', example: 'નવી પ્રાઇવેટ લિમિટેડ કંપનીની નોંધણી.', offline: true },
  { id: 'limitation', name: 'મર્યાદા અધિનિયમ', shortName: 'LA', year: '1963', sections: 32, category: 'civil', isNew: false, description: 'દાવો દાખલ કરવાની સમય મર્યાદા.', example: 'પૈસા વસૂલવા માટે 3 વર્ષની મુદત.', offline: true },
  { id: 'arbitration', name: 'આર્બિટ્રેશન એન્ડ કોન્સિલિએશન એક્ટ', shortName: 'A&C', year: '1996', sections: 86, category: 'civil', isNew: false, description: 'કોર્ટ બહાર વિવાદ ઉકેલ પદ્ધતિ.', example: 'કરારના વિવાદો માટે આર્બિટ્રેટરની નિમણૂક.', offline: true },
  { id: 'ibc', name: 'નાદારી અને દેવાળિયા કોડ', shortName: 'IBC', year: '2016', sections: 255, category: 'corporate', isNew: false, description: 'કોર્પોરેટ નાદારી અને રિઝોલ્યુશન.', example: 'દેવાળિયા કંપનીનું લિક્વિડેશન.', offline: true },
  { id: 'rera', name: 'રેરા એક્ટ', shortName: 'RERA', year: '2016', sections: 92, category: 'civil', isNew: false, description: 'રિયલ એસ્ટેટ નિયમન અને વિકાસ.', example: 'બિલ્ડર દ્વારા પઝેશનમાં વિલંબ માટે વળતર.', offline: true },
];

export default function LibraryScreen() {
  const { colors, isDark } = useTheme();
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [selectedAct, setSelectedAct] = useState<any>(null);

  const filteredActs = ACTS_DATA.filter((act) => {
    const matchesCategory = selectedCategory === 'all' || act.category === selectedCategory;
    const matchesSearch =
      !searchQuery ||
      act.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      act.shortName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const newLaws = ACTS_DATA.filter((a) => a.isNew);

  const cardWidth = (SCREEN_WIDTH - Spacing.md * 2 - Spacing.sm) / 2;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* Header */}
        <Animated.View entering={FadeInDown.delay(100).springify()}>
          <Text style={[Typography.h1, { color: colors.text }]}>કાયદા લાઇબ્રેરી</Text>
          <Text style={[Typography.bodySmall, { color: colors.textSecondary, marginTop: 4, marginBottom: Spacing.md }]}>
            {ACTS_DATA.length} કાયદા • {ACTS_DATA.reduce((sum, a) => sum + a.sections, 0).toLocaleString()}+ કલમો • 100% ઑફલાઇન
          </Text>
        </Animated.View>

        {/* Search Bar */}
        <Animated.View entering={FadeInDown.delay(200).springify()}>
          <View
            style={[
              styles.searchBar,
              {
                backgroundColor: isDark ? colors.surfaceSecondary : '#FFF',
                borderColor: searchFocused ? colors.accent : colors.border,
                borderWidth: searchFocused ? 2 : 1,
              },
            ]}
          >
            <Ionicons
              name="search"
              size={20}
              color={searchFocused ? colors.accent : colors.textTertiary}
            />
            <TextInput
              style={[
                styles.searchInput,
                Typography.body,
                { color: colors.text },
              ]}
              placeholder="કાયદા, કલમો, કીવર્ડ્સ શોધો..."
              placeholderTextColor={colors.textTertiary}
              value={searchQuery}
              onChangeText={setSearchQuery}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              accessibilityLabel="Search law library"
              accessibilityHint="Search for acts and sections by name or keyword"
            />
            {searchQuery.length > 0 && (
              <Pressable onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={20} color={colors.textTertiary} />
              </Pressable>
            )}
            <Pressable style={styles.voiceButton}>
              <Ionicons name="mic-outline" size={20} color={colors.textTertiary} />
            </Pressable>
          </View>
        </Animated.View>

        {/* Category Pills */}
        <Animated.View entering={FadeInDown.delay(300).springify()}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesScroll}
          >
            {CATEGORIES.map((cat) => (
              <Pressable
                key={cat.id}
                style={[
                  styles.categoryPill,
                  {
                    backgroundColor:
                      selectedCategory === cat.id
                        ? colors.accent
                        : isDark
                        ? colors.surfaceSecondary
                        : colors.surfaceSecondary,
                    borderColor:
                      selectedCategory === cat.id
                        ? colors.accent
                        : colors.border,
                  },
                ]}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setSelectedCategory(cat.id);
                }}
              >
                <Ionicons
                  name={cat.icon as any}
                  size={14}
                  color={selectedCategory === cat.id ? '#0B1F3A' : colors.textSecondary}
                />
                <Text
                  style={[
                    Typography.captionMedium,
                    {
                      color: selectedCategory === cat.id ? '#0B1F3A' : colors.textSecondary,
                      marginLeft: 4,
                    },
                  ]}
                >
                  {cat.label}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </Animated.View>

        {/* New Laws Highlight */}
        {selectedCategory === 'all' && (
          <Animated.View entering={FadeInDown.delay(400).springify()}>
            <View style={styles.sectionHeader}>
              <Text style={[Typography.h3, { color: colors.text }]}>નવા ફોજદારી કાયદા 2023</Text>
              <View style={[styles.newBadge, { backgroundColor: `${colors.success}15` }]}>
                <Text style={[Typography.caption, { color: colors.success }]}>લાઇવ</Text>
              </View>
            </View>

            {/* Compare CTA Banner */}
            <Pressable
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                // Navigate to compare view
              }}
            >
              <LinearGradient
                colors={isDark ? ['#1A1A08', '#0E0E0E'] : ['#0B1F3A', '#162D4F']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.compareBanner}
              >
                <View style={styles.compareBannerContent}>
                  <Text style={[Typography.bodySemibold, { color: '#FFF' }]}>
                    જૂના ↔ નવા કાયદાઓની તુલના કરો
                  </Text>
                  <Text style={[Typography.bodySmall, { color: 'rgba(255,255,255,0.7)', marginTop: 4 }]}>
                    IPC વિ BNS • CrPC વિ BNSS • Evidence Act વિ BSA
                  </Text>
                </View>
                <View style={styles.compareBannerIcon}>
                  <Ionicons name="git-compare" size={28} color="#C9A961" />
                </View>
              </LinearGradient>
            </Pressable>
          </Animated.View>
        )}

        {/* Acts Grid */}
        <Animated.View entering={FadeInDown.delay(500).springify()}>
          <Text style={[Typography.h3, { color: colors.text, marginBottom: Spacing.sm }]}>
            {selectedCategory === 'all' ? 'બધા કાયદા' : CATEGORIES.find((c) => c.id === selectedCategory)?.label + ' કાયદા'}
          </Text>
          <View style={styles.actsGrid}>
            {filteredActs.map((act, i) => (
              <Animated.View
                key={act.id}
                entering={FadeInDown.delay(550 + i * AnimationConfig.stagger).springify()}
                style={{ width: cardWidth }}
              >
                <ParchmentCard
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setSelectedAct(act);
                  }}
                  variant="outlined"
                  padding="sm"
                  style={styles.actCard}
                >
                  <View style={styles.actCardHeader}>
                    {act.isNew && (
                      <View style={[styles.newActBadge, { backgroundColor: '#C9A96115' }]}>
                        <Text style={[Typography.caption, { color: '#C9A961', fontWeight: '600' }]}>
                          2023 Act
                        </Text>
                      </View>
                    )}
                    {act.offline && (
                      <Ionicons name="cloud-done" size={14} color={colors.success} style={{ marginLeft: 'auto' }} />
                    )}
                  </View>
                  <Text style={[Typography.bodySmallMedium, { color: colors.accent, marginTop: Spacing.xxs }]}>
                    {act.shortName}
                  </Text>
                  <Text style={[Typography.bodySmall, { color: colors.text, marginTop: 2 }]} numberOfLines={2}>
                    {act.name}
                  </Text>
                  <Text style={[Typography.caption, { color: colors.textTertiary, marginTop: Spacing.xxs }]} numberOfLines={2}>
                    {act.description}
                  </Text>
                  <View style={styles.actCardFooter}>
                    <Text style={[Typography.caption, { color: colors.textTertiary }]}>
                      {act.year}
                    </Text>
                    <Text style={[Typography.captionMedium, { color: colors.textSecondary }]}>
                      {act.sections} §
                    </Text>
                  </View>
                </ParchmentCard>
              </Animated.View>
            ))}
          </View>
        </Animated.View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Act Details Modal */}
      <Modal
        visible={!!selectedAct}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedAct(null)}
      >
        <Pressable 
          style={styles.modalOverlay}
          onPress={() => setSelectedAct(null)}
        >
          <Pressable style={[styles.modalContent, { backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF', borderColor: colors.border }]}>
            {selectedAct && (
              <>
                <View style={styles.modalHeader}>
                  <View style={{ flex: 1 }}>
                    <Text style={[Typography.h2, { color: colors.accent, marginBottom: 4 }]}>{selectedAct.shortName}</Text>
                    <Text style={[Typography.bodyMedium, { color: colors.text }]}>{selectedAct.name}</Text>
                  </View>
                  <View style={styles.modalBadge}>
                    <Text style={[Typography.captionMedium, { color: colors.accent }]}>{selectedAct.year}</Text>
                  </View>
                </View>

                <View style={styles.modalSection}>
                  <Text style={[Typography.bodySmallMedium, { color: colors.textSecondary, marginBottom: 6 }]}>વર્ણન</Text>
                  <Text style={[Typography.body, { color: colors.text }]}>{selectedAct.description}</Text>
                </View>

                <View style={styles.modalSection}>
                  <Text style={[Typography.bodySmallMedium, { color: colors.textSecondary, marginBottom: 6 }]}>ઉદાહરણ</Text>
                  <View style={[styles.exampleBox, { backgroundColor: `${colors.accent}15`, borderColor: `${colors.accent}30` }]}>
                    <Text style={[Typography.body, { color: colors.text, fontStyle: 'italic' }]}>
                      "{selectedAct.example}"
                    </Text>
                  </View>
                </View>

                <GoldButton
                  title="બંધ કરો"
                  onPress={() => setSelectedAct(null)}
                  style={{ marginTop: Spacing.md }}
                  fullWidth
                />
              </>
            )}
          </Pressable>
        </Pressable>
      </Modal>

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
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.card,
    marginBottom: Spacing.md,
    ...Elevation.sm,
  },
  searchInput: {
    flex: 1,
    marginLeft: Spacing.xs,
    paddingVertical: Spacing.xxs,
  },
  voiceButton: {
    marginLeft: Spacing.xs,
    padding: 4,
  },
  categoriesScroll: {
    gap: Spacing.xs,
    paddingBottom: Spacing.md,
  },
  categoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.pill,
    borderWidth: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginBottom: Spacing.sm,
  },
  newBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BorderRadius.pill,
  },
  compareBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.card,
    marginBottom: Spacing.xl,
    overflow: 'hidden',
  },
  compareBannerContent: {
    flex: 1,
  },
  compareBannerIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(201,169,97,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  actCard: {
    minHeight: 160,
  },
  actCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  newActBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BorderRadius.chip,
  },
  actCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 'auto',
    paddingTop: Spacing.xs,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: Spacing.xl,
    paddingBottom: Spacing.xxl,
    borderTopWidth: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
    paddingBottom: Spacing.md,
  },
  modalBadge: {
    backgroundColor: 'rgba(201,169,97,0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  modalSection: {
    marginBottom: Spacing.md,
  },
  exampleBox: {
    padding: Spacing.md,
    borderRadius: 8,
    borderLeftWidth: 3,
  },
});
