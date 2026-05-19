import React, { ReactNode } from 'react';
import { View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { useThemedStyles } from '@/hooks/use-themed-styles';

interface ScreenHeaderProps {
  title: string;
  left?: ReactNode;
  right?: ReactNode;
}

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
