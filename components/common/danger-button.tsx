import React from 'react';
import { TouchableOpacity } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { useThemeColors } from '@/hooks/use-themed-styles';

interface DangerButtonProps {
  label: string;
  onPress: () => void;
  /** When true, uses a filled red background; otherwise transparent with red text. */
  filled?: boolean;
  disabled?: boolean;
}

export function DangerButton({
  label,
  onPress,
  filled = false,
  disabled = false,
}: DangerButtonProps) {
  const colors = useThemeColors();

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={{
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderRadius: 12,
        alignItems: 'center',
        backgroundColor: filled ? colors.error : 'transparent',
        opacity: disabled ? 0.5 : 1,
      }}
    >
      <ThemedText
        style={{
          fontSize: 16,
          fontWeight: '600',
          color: filled ? '#FFFFFF' : colors.error,
        }}
      >
        {label}
      </ThemedText>
    </TouchableOpacity>
  );
}
