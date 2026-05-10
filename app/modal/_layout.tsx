/**
 * Modal Layout — Wraps modal screens
 */
import React from 'react';
import { Stack } from 'expo-router';
import { useTheme } from '../../src/providers/ThemeProvider';

export default function ModalLayout() {
  const { colors } = useTheme();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
        presentation: 'modal',
      }}
    >
      <Stack.Screen name="ai-chat" />
    </Stack>
  );
}
