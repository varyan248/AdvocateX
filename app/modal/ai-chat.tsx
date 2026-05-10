/**
 * Vakil AI Chat — Full-featured AI legal assistant with streaming
 */
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInUp, FadeIn } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { useTheme } from '../../src/providers/ThemeProvider';
import { useAIChatStore, ChatMessage } from '../../src/stores/aiChatStore';
import {
  Typography,
  Spacing,
  BorderRadius,
  Elevation,
} from '../../src/constants/theme';
import { ParchmentCard, SectionPill, GoldButton } from '../../src/components/ui';

const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
  { code: 'gu', name: 'ગુજરાતી', flag: '🇮🇳' },
  { code: 'mr', name: 'मराठी', flag: '🇮🇳' },
  { code: 'ta', name: 'தமிழ்', flag: '🇮🇳' },
  { code: 'te', name: 'తెలుగు', flag: '🇮🇳' },
  { code: 'kn', name: 'ಕನ್ನಡ', flag: '🇮🇳' },
  { code: 'bn', name: 'বাংলা', flag: '🇮🇳' },
  { code: 'ml', name: 'മലയാളം', flag: '🇮🇳' },
  { code: 'pa', name: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
];

const QUICK_PROMPTS = [
  { icon: 'document-text', text: 'Draft legal notice', color: '#1A5276' },
  { icon: 'school', text: 'Explain this section', color: '#1A7A4A' },
  { icon: 'book', text: 'Summarise this judgment', color: '#6C3483' },
  { icon: 'calculator', text: 'Court fee for ₹5L claim', color: '#C17D0F' },
];

// Sample AI response for demo
const SAMPLE_AI_RESPONSE = `Under the **Bharatiya Nyaya Sanhita 2023**, Section 303 deals with theft. 

**Simple theft** is punishable with imprisonment of either description for a term which may extend to **3 years**, or with fine, or with both.

**Aggravated forms of theft** attract higher punishment:
- **§305** — Theft in a dwelling house: up to 7 years
- **§306** — Theft by servant: up to 7 years  
- **§307** — Theft after preparation for causing death: up to 10 years
- **§308** — Theft involving motor vehicle: up to 7 years

The corresponding old provision was **IPC Section 379** which had similar punishment.`;

export default function AIChatScreen() {
  const { colors, isDark } = useTheme();
  const router = useRouter();
  const scrollRef = useRef<ScrollView>(null);
  const [inputText, setInputText] = useState('');
  const [showLanguages, setShowLanguages] = useState(false);
  const { messages, addMessage, selectedLanguage, setLanguage, isStreaming } = useAIChatStore();

  const currentLang = LANGUAGES.find((l) => l.code === selectedLanguage) || LANGUAGES[0];

  const handleSend = () => {
    if (!inputText.trim()) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputText.trim(),
      timestamp: new Date().toISOString(),
      language: selectedLanguage,
    };
    addMessage(userMsg);
    setInputText('');

    // Simulate AI response
    setTimeout(() => {
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: SAMPLE_AI_RESPONSE,
        timestamp: new Date().toISOString(),
        citations: [
          { actName: 'BNS', sectionNumber: '303', sectionTitle: 'Theft' },
          { actName: 'BNS', sectionNumber: '305', sectionTitle: 'Theft in dwelling house' },
          { actName: 'IPC', sectionNumber: '379', sectionTitle: 'Punishment for theft' },
        ],
      };
      addMessage(aiMsg);
    }, 1500);

    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 200);
  };

  const isEmpty = messages.length === 0;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-down" size={24} color={colors.text} />
        </Pressable>
        <View style={styles.headerCenter}>
          <View style={styles.headerTitle}>
            <Ionicons name="sparkles" size={18} color={colors.accent} />
            <Text style={[Typography.bodySemibold, { color: colors.text, marginLeft: 6 }]}>
              Vakil AI
            </Text>
          </View>
          <Pressable
            onPress={() => setShowLanguages(!showLanguages)}
            style={[styles.langPicker, { backgroundColor: isDark ? colors.surfaceTertiary : colors.surfaceSecondary }]}
          >
            <Text style={{ fontSize: 14 }}>{currentLang.flag}</Text>
            <Text style={[Typography.caption, { color: colors.textSecondary, marginLeft: 4 }]}>
              {currentLang.name}
            </Text>
            <Ionicons name="chevron-down" size={12} color={colors.textTertiary} />
          </Pressable>
        </View>
        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            useAIChatStore.getState().clearChat();
          }}
          style={styles.clearButton}
        >
          <Ionicons name="refresh" size={20} color={colors.textTertiary} />
        </Pressable>
      </View>

      {/* Language Picker Dropdown */}
      {showLanguages && (
        <Animated.View entering={FadeInDown.duration(200)} style={[styles.langDropdown, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {LANGUAGES.map((lang) => (
            <Pressable
              key={lang.code}
              style={[
                styles.langItem,
                selectedLanguage === lang.code && { backgroundColor: `${colors.accent}10` },
              ]}
              onPress={() => {
                setLanguage(lang.code);
                setShowLanguages(false);
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
            >
              <Text style={{ fontSize: 16 }}>{lang.flag}</Text>
              <Text style={[Typography.bodySmall, { color: colors.text, marginLeft: Spacing.xs }]}>
                {lang.name}
              </Text>
              {selectedLanguage === lang.code && (
                <Ionicons name="checkmark" size={16} color={colors.accent} style={{ marginLeft: 'auto' }} />
              )}
            </Pressable>
          ))}
        </Animated.View>
      )}

      <KeyboardAvoidingView
        style={styles.chatContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <ScrollView
          ref={scrollRef}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.messagesContent}
          onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
        >
          {isEmpty ? (
            /* Empty State */
            <Animated.View entering={FadeIn.delay(200)} style={styles.emptyState}>
              <View style={styles.aiLogo}>
                <LinearGradient
                  colors={['#D4B87A', '#C9A961', '#A88B4A']}
                  style={styles.aiLogoGradient}
                >
                  <Ionicons name="sparkles" size={32} color="#0B1F3A" />
                </LinearGradient>
              </View>
              <Text style={[Typography.h2, { color: colors.text, textAlign: 'center', marginTop: Spacing.md }]}>
                Ask Vakil AI
              </Text>
              <Text style={[Typography.bodySmall, { color: colors.textSecondary, textAlign: 'center', marginTop: Spacing.xs, paddingHorizontal: Spacing.xl }]}>
                Your AI legal research assistant. Ask about Indian laws, draft documents, or get case analysis.
              </Text>

              {/* Quick Prompts */}
              <View style={styles.quickPrompts}>
                {QUICK_PROMPTS.map((prompt, i) => (
                  <Animated.View key={i} entering={FadeInDown.delay(400 + i * 80).springify()}>
                    <Pressable
                      style={[styles.quickPromptCard, {
                        backgroundColor: isDark ? colors.surfaceSecondary : '#FFF',
                        borderColor: colors.border,
                      }]}
                      onPress={() => {
                        setInputText(prompt.text);
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      }}
                    >
                      <View style={[styles.promptIcon, { backgroundColor: `${prompt.color}10` }]}>
                        <Ionicons name={prompt.icon as any} size={18} color={prompt.color} />
                      </View>
                      <Text style={[Typography.bodySmallMedium, { color: colors.text }]}>
                        {prompt.text}
                      </Text>
                    </Pressable>
                  </Animated.View>
                ))}
              </View>
            </Animated.View>
          ) : (
            /* Messages */
            messages.map((msg, i) => (
              <Animated.View
                key={msg.id}
                entering={FadeInDown.delay(i === messages.length - 1 ? 100 : 0).springify()}
              >
                <MessageBubble message={msg} />
              </Animated.View>
            ))
          )}
        </ScrollView>

        {/* Input Bar */}
        <View style={[styles.inputBar, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
          <Pressable style={styles.attachButton}>
            <Ionicons name="attach" size={22} color={colors.textTertiary} />
          </Pressable>
          <TextInput
            style={[styles.input, Typography.body, { color: colors.text, backgroundColor: isDark ? colors.surfaceSecondary : colors.surfaceSecondary }]}
            placeholder="Ask a legal question..."
            placeholderTextColor={colors.textTertiary}
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={2000}
            accessibilityLabel="Type your legal question"
          />
          <Pressable style={styles.voiceButton}>
            <Ionicons name="mic-outline" size={22} color={colors.textTertiary} />
          </Pressable>
          <Pressable
            style={[styles.sendButton, { backgroundColor: inputText.trim() ? colors.accent : `${colors.accent}40` }]}
            onPress={handleSend}
            disabled={!inputText.trim()}
          >
            <Ionicons name="send" size={18} color="#0B1F3A" />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

/* Message Bubble Component */
const MessageBubble: React.FC<{ message: ChatMessage }> = ({ message }) => {
  const { colors, isDark } = useTheme();
  const isUser = message.role === 'user';

  return (
    <View style={[styles.messageBubbleRow, isUser ? styles.userRow : styles.aiRow]}>
      {!isUser && (
        <View style={styles.aiBubbleAvatar}>
          <Ionicons name="sparkles" size={14} color="#C9A961" />
        </View>
      )}
      <View
        style={[
          styles.bubble,
          isUser
            ? [styles.userBubble, { backgroundColor: '#0B1F3A' }]
            : [styles.aiBubble, { backgroundColor: isDark ? colors.surfaceSecondary : '#FFF', borderColor: colors.border }],
        ]}
      >
        <Text style={[Typography.body, { color: isUser ? '#FFF' : colors.text }]}>
          {message.content}
        </Text>

        {/* Citations */}
        {message.citations && message.citations.length > 0 && (
          <View style={styles.citationsRow}>
            {message.citations.map((c, i) => (
              <SectionPill
                key={i}
                sectionNumber={c.sectionNumber}
                actShortName={c.actName}
                variant="citation"
                onPress={() => {}}
              />
            ))}
          </View>
        )}

        {/* AI Disclaimer */}
        {!isUser && (
          <View style={[styles.disclaimer, { borderTopColor: colors.border }]}>
            <Ionicons name="information-circle-outline" size={12} color={colors.textTertiary} />
            <Text style={[Typography.caption, { color: colors.textTertiary, marginLeft: 4, flex: 1 }]}>
              AI-generated — verify with primary sources
            </Text>
          </View>
        )}

        {/* Action buttons for AI messages */}
        {!isUser && (
          <View style={styles.messageActions}>
            {[
              { icon: 'copy-outline', label: 'Copy' },
              { icon: 'share-outline', label: 'Share' },
              { icon: 'bookmark-outline', label: 'Save' },
            ].map((action) => (
              <Pressable
                key={action.label}
                style={styles.messageAction}
                onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
              >
                <Ionicons name={action.icon as any} size={14} color={colors.textTertiary} />
                <Text style={[Typography.caption, { color: colors.textTertiary, marginLeft: 4 }]}>
                  {action.label}
                </Text>
              </Pressable>
            ))}
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 0.5,
  },
  backButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  langPicker: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: BorderRadius.pill,
    marginTop: 4,
    gap: 2,
  },
  clearButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  langDropdown: {
    position: 'absolute',
    top: 100,
    left: 40,
    right: 40,
    borderRadius: BorderRadius.card,
    borderWidth: 1,
    zIndex: 100,
    ...Elevation.lg,
  },
  langItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  chatContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: Spacing.md,
    paddingBottom: Spacing.xl,
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: Spacing['4xl'],
  },
  aiLogo: {
    width: 72,
    height: 72,
    borderRadius: 36,
    overflow: 'hidden',
  },
  aiLogoGradient: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickPrompts: {
    width: '100%',
    marginTop: Spacing['2xl'],
    gap: Spacing.xs,
  },
  quickPromptCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.sm,
    borderRadius: BorderRadius.card,
    borderWidth: 1,
  },
  promptIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  messageBubbleRow: {
    flexDirection: 'row',
    marginBottom: Spacing.sm,
  },
  userRow: {
    justifyContent: 'flex-end',
  },
  aiRow: {
    justifyContent: 'flex-start',
  },
  aiBubbleAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(201,169,97,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.xs,
    marginTop: 4,
  },
  bubble: {
    maxWidth: '80%',
    borderRadius: BorderRadius.card,
    padding: Spacing.sm,
  },
  userBubble: {
    borderBottomRightRadius: 4,
  },
  aiBubble: {
    borderBottomLeftRadius: 4,
    borderWidth: 1,
  },
  citationsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginTop: Spacing.xs,
  },
  disclaimer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.xs,
    paddingTop: Spacing.xs,
    borderTopWidth: 0.5,
  },
  messageActions: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: Spacing.xs,
  },
  messageAction: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderTopWidth: 0.5,
    gap: Spacing.xs,
  },
  attachButton: {
    width: 36,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    flex: 1,
    maxHeight: 120,
    minHeight: 40,
    borderRadius: BorderRadius.button,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  voiceButton: {
    width: 36,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
