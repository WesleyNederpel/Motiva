import { useRouter } from 'expo-router';
import React from 'react';
import { TouchableOpacity } from 'react-native';

import { ScreenHeader } from '@/components/common/screen-header';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useThemeColors } from '@/hooks/use-themed-styles';

export function ProfileHeader() {
  const router = useRouter();
  const colors = useThemeColors();

  return (
    <ScreenHeader
      title="Profile"
      right={
        <TouchableOpacity
          onPress={() => router.push('/settings')}
          hitSlop={8}
          accessibilityLabel="Open settings"
        >
          <IconSymbol size={28} name="gear" color={colors.text} />
        </TouchableOpacity>
      }
    />
  );
}
