import React, { ReactNode } from 'react';
import { View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { useThemedStyles } from '@/hooks/use-themed-styles';

interface ScreenHeaderProps {
  title: string;
  /** Optional element rendered to the left of the title (e.g. back button). */
  left?: ReactNode;
  /** Optional element rendered on the right (e.g. add button, cogwheel). */
  right?: ReactNode;
}

/**
 * Standard tab-screen header — same layout & typography as the dashboard.
 * Title on the left (optionally preceded by a left action), optional right slot.
 */
export function ScreenHeader({ title, left, right }: ScreenHeaderProps) {
  const styles = useThemedStyles();
  return (
    <View style={styles.header}>
      <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, gap: 8 }}>
        {left}
        <ThemedText style={styles.headerTitle}>{title}</ThemedText>
      </View>
      {right ?? <View style={{ width: 42, height: 42 }} />}
    </View>
  );
}
