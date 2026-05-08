import React, { useState } from 'react';
import { TextInput, View } from 'react-native';

import { FormButtons } from '@/components/common/form-buttons';
import { useThemeColors, useThemedStyles } from '@/hooks/use-themed-styles';

interface EmailEditFormProps {
  initialEmail: string;
  onCancel: () => void;
  onSave: (newEmail: string) => Promise<boolean>;
}

export function EmailEditForm({ initialEmail, onCancel, onSave }: EmailEditFormProps) {
  const styles = useThemedStyles();
  const colors = useThemeColors();
  const [email, setEmail] = useState(initialEmail);

  const handleSave = async () => {
    const ok = await onSave(email);
    if (ok) onCancel();
  };

  return (
    <View style={{ padding: 16 }}>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        placeholderTextColor={colors.placeholder}
        autoCapitalize="none"
        keyboardType="email-address"
        autoFocus
      />
      <FormButtons onCancel={onCancel} onConfirm={handleSave} confirmLabel="Save" />
    </View>
  );
}
