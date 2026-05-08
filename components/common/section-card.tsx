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

/**
 * Themed surface with rounded corners and an optional title above.
 * Used for Account Info, Stats, Danger Zone, Appearance, etc.
 */
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
            borderRadius: 12,
            marginBottom: 20,
            overflow: 'hidden',
          },
          style,
        ]}
      >
        {children}
      </ThemedView>
    </>
  );
}
