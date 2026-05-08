import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ScreenHeader } from '@/components/common/screen-header';
import { ThemePicker } from '@/components/settings/theme-picker';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useThemeColors, useThemedStyles } from '@/hooks/use-themed-styles';

export default function SettingsScreen() {
  const router = useRouter();
  const styles = useThemedStyles();
  const colors = useThemeColors();

  const handleBack = () => {
    if (router.canGoBack()) router.back();
    else router.replace('/(tabs)/profile');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ThemedView style={styles.innerContainer}>
        <ScreenHeader
          title="Settings"
          left={
            <TouchableOpacity
              onPress={handleBack}
              hitSlop={8}
              accessibilityLabel="Back"
              style={{ width: 42, height: 42, alignItems: 'center', justifyContent: 'center' }}
            >
              <IconSymbol size={28} name="chevron.left" color={colors.text} />
            </TouchableOpacity>
          }
        />
        <ScrollView showsVerticalScrollIndicator={false}>
          <ThemePicker />
        </ScrollView>
      </ThemedView>
    </SafeAreaView>
  );
}
