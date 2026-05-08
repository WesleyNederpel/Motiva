import React from 'react';
import { TouchableOpacity, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useThemeColors } from '@/hooks/use-themed-styles';

interface RadioRowProps {
  /** SF Symbol name passed to IconSymbol. */
  iconName: React.ComponentProps<typeof IconSymbol>['name'];
  label: string;
  selected: boolean;
  onPress: () => void;
  isLast?: boolean;
}

export function RadioRow({
  iconName,
  label,
  selected,
  onPress,
  isLast,
}: RadioRowProps) {
  const colors = useThemeColors();

  return (
    <TouchableOpacity
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
      <IconSymbol size={22} name={iconName} color={colors.text} />
      <ThemedText
        style={{ fontSize: 16, color: colors.text, marginLeft: 12, flex: 1 }}
      >
        {label}
      </ThemedText>
      {selected ? (
        <IconSymbol size={22} name="checkmark" color={colors.secondary} />
      ) : null}
    </TouchableOpacity>
  );
}
