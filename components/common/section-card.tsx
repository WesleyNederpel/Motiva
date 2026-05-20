import React, { ReactNode } from 'react';
import { StyleProp, ViewStyle } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColors } from '@/hooks/use-themed-styles';

interface SectionCardProps {
  title?: string;
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}

export function SectionCard({ title, children, style }: SectionCardProps) {
  const colors = useThemeColors();

  return (
    <>
      {title ? (
        <ThemedText
          style={{
            fontSize: 13,
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: 0.5,
            color: colors.muted,
            marginBottom: 8,
            marginLeft: 4,
          }}
        >
          {title}
        </ThemedText>
      ) : null}
      <ThemedView
        style={[
          {
            backgroundColor: colors.surface,
            borderRadius: 16,
            marginBottom: 20,
            overflow: 'hidden',
            shadowColor: colors.shadow,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.08,
            shadowRadius: 8,
            elevation: 3,
          },
          style,
        ]}
      >
        {children}
      </ThemedView>
    </>
  );
}
