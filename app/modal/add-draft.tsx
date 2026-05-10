import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Pressable, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../src/providers/ThemeProvider';
import { Typography, Spacing, BorderRadius } from '../../src/constants/theme';
import { GoldButton, ParchmentCard } from '../../src/components/ui';
import * as Haptics from 'expo-haptics';

export default function AddDraftModal() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  
  const [form, setForm] = useState({
    title: '',
    type: '',
    content: '',
  });

  const handleSave = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    alert('Draft saved! (Local preview only)');
    router.back();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.closeBtn}>
          <Ionicons name="close" size={24} color={colors.text} />
        </Pressable>
        <Text style={[Typography.h3, { color: colors.text }]}>New Draft</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <ParchmentCard variant="outlined" style={styles.card}>
          <View style={styles.inputGroup}>
            <Text style={[Typography.captionMedium, { color: colors.textSecondary }]}>Draft Title</Text>
            <TextInput
              style={[styles.input, { borderColor: colors.border, color: colors.text }]}
              placeholder="e.g. Legal Notice for Recovery"
              placeholderTextColor={colors.textTertiary}
              value={form.title}
              onChangeText={(text) => setForm({ ...form, title: text })}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[Typography.captionMedium, { color: colors.textSecondary }]}>Draft Type</Text>
            <TextInput
              style={[styles.input, { borderColor: colors.border, color: colors.text }]}
              placeholder="e.g. Civil, Criminal, Corporate"
              placeholderTextColor={colors.textTertiary}
              value={form.type}
              onChangeText={(text) => setForm({ ...form, type: text })}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[Typography.captionMedium, { color: colors.textSecondary }]}>Initial Content</Text>
            <TextInput
              style={[styles.input, styles.textArea, { borderColor: colors.border, color: colors.text }]}
              placeholder="Start typing your draft here..."
              placeholderTextColor={colors.textTertiary}
              value={form.content}
              onChangeText={(text) => setForm({ ...form, content: text })}
              multiline
              textAlignVertical="top"
            />
          </View>
        </ParchmentCard>
      </ScrollView>

      <View style={[styles.footer, { borderTopColor: colors.border, backgroundColor: colors.background }]}>
        <GoldButton title="Save Draft" onPress={handleSave} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  closeBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  content: {
    padding: Spacing.md,
  },
  card: {
    padding: Spacing.md,
  },
  inputGroup: {
    marginBottom: Spacing.md,
  },
  input: {
    borderWidth: 1,
    borderRadius: BorderRadius.input,
    paddingHorizontal: Spacing.md,
    paddingVertical: Platform.OS === 'ios' ? 12 : 8,
    marginTop: Spacing.xs,
    fontSize: 16,
  },
  textArea: {
    height: 150,
    paddingTop: Spacing.sm,
  },
  footer: {
    padding: Spacing.md,
    borderTopWidth: 1,
    paddingBottom: Platform.OS === 'ios' ? Spacing.xl : Spacing.md,
  },
});
