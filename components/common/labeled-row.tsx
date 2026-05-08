import React, { ReactNode } from 'react';
import { TouchableOpacity, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { useThemeColors } from '@/hooks/use-themed-styles';

interface LabeledRowProps {
  label: string;
  value?: string;
  /** Trailing UI element (icon, chevron, button). */
  trailing?: ReactNode;
  /** Makes the whole row tappable. */
  onPress?: () => void;
  /** Removes the bottom border (useful for the last row in a card). */
  isLast?: boolean;
}

export function LabeledRow({
  label,
  value,
  trailing,
  onPress,
  isLast,
}: LabeledRowProps) {
  const colors = useThemeColors();

  const Row = onPress ? TouchableOpacity : View;

  return (
    <Row
      onPress={onPress}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderBottomWidth: isLast ? 0 : 1,
        borderBottomColor: colors.border,
      }}
    >
      <View style={{ flex: 1 }}>
        <ThemedText style={{ fontSize: 13, color: colors.muted, marginBottom: 2 }}>
          {label}
        </ThemedText>
        {value !== undefined ? (
          <ThemedText style={{ fontSize: 16, color: colors.text }}>
            {value}
          </ThemedText>
        ) : null}
      </View>
      {trailing}
    </Row>
  );
}
