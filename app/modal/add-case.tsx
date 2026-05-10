import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Pressable, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../src/providers/ThemeProvider';
import { Typography, Spacing, BorderRadius, Elevation } from '../../src/constants/theme';
import { GoldButton, ParchmentCard } from '../../src/components/ui';
import * as Haptics from 'expo-haptics';

export default function AddCaseModal() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  
  const [form, setForm] = useState({
    title: '',
    clientName: '',
    courtName: '',
    caseNumber: '',
  });

  const handleSave = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    alert('Case saved! (Local preview only)');
    router.back();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.closeBtn}>
          <Ionicons name="close" size={24} color={colors.text} />
        </Pressable>
        <Text style={[Typography.h3, { color: colors.text }]}>Add New Case</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <ParchmentCard variant="outlined" style={styles.card}>
          <Text style={[Typography.bodyMedium, { color: colors.textSecondary, marginBottom: Spacing.sm }]}>
            Case Details
          </Text>
          
          <View style={styles.inputGroup}>
            <Text style={[Typography.captionMedium, { color: colors.textSecondary }]}>Case Title</Text>
            <TextInput
              style={[styles.input, { borderColor: colors.border, color: colors.text }]}
              placeholder="e.g. State v. John Doe"
              placeholderTextColor={colors.textTertiary}
              value={form.title}
              onChangeText={(text) => setForm({ ...form, title: text })}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[Typography.captionMedium, { color: colors.textSecondary }]}>Client Name</Text>
            <TextInput
              style={[styles.input, { borderColor: colors.border, color: colors.text }]}
              placeholder="Client's full name"
              placeholderTextColor={colors.textTertiary}
              value={form.clientName}
              onChangeText={(text) => setForm({ ...form, clientName: text })}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[Typography.captionMedium, { color: colors.textSecondary }]}>Court Name</Text>
            <TextInput
              style={[styles.input, { borderColor: colors.border, color: colors.text }]}
              placeholder="e.g. District Court, Delhi"
              placeholderTextColor={colors.textTertiary}
              value={form.courtName}
              onChangeText={(text) => setForm({ ...form, courtName: text })}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[Typography.captionMedium, { color: colors.textSecondary }]}>Case Number</Text>
            <TextInput
              style={[styles.input, { borderColor: colors.border, color: colors.text }]}
              placeholder="e.g. CC No. 123/2024"
              placeholderTextColor={colors.textTertiary}
              value={form.caseNumber}
              onChangeText={(text) => setForm({ ...form, caseNumber: text })}
            />
          </View>
        </ParchmentCard>
      </ScrollView>

      <View style={[styles.footer, { borderTopColor: colors.border, backgroundColor: colors.background }]}>
        <GoldButton title="Save Case" onPress={handleSave} />
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
  footer: {
    padding: Spacing.md,
    borderTopWidth: 1,
    paddingBottom: Platform.OS === 'ios' ? Spacing.xl : Spacing.md,
  },
});
