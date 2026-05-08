import React, { useState } from 'react';
import { TextInput, TouchableOpacity, View } from 'react-native';

import { IconSymbol } from '@/components/ui/icon-symbol';
import { useThemeColors, useThemedStyles } from '@/hooks/use-themed-styles';

interface PasswordInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
}

/**
 * Password text input with an eye-toggle icon to reveal/hide the value.
 */
export function PasswordInput({
  value,
  onChangeText,
  placeholder,
  autoFocus,
}: PasswordInputProps) {
  const styles = useThemedStyles();
  const colors = useThemeColors();
  const [visible, setVisible] = useState(false);

  return (
    <View style={{ position: 'relative', justifyContent: 'center' }}>
      <TextInput
        style={[styles.input, { paddingRight: 44 }]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.placeholder}
        secureTextEntry={!visible}
        autoCapitalize="none"
        autoFocus={autoFocus}
      />
      <TouchableOpacity
        onPress={() => setVisible(v => !v)}
        style={{
          position: 'absolute',
          right: 12,
          top: 0,
          bottom: 0,
          justifyContent: 'center',
          paddingBottom: 16, // counteract input's marginBottom so the icon centers vertically
        }}
        hitSlop={8}
      >
        <IconSymbol
          size={22}
          name={visible ? 'eye.slash' : 'eye'}
          color={colors.muted}
        />
      </TouchableOpacity>
    </View>
  );
}
