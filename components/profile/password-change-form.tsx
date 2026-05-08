import React, { useState } from 'react';
import { View } from 'react-native';

import { FormButtons } from '@/components/common/form-buttons';
import { PasswordInput } from '@/components/common/password-input';

interface PasswordChangeFormProps {
  onCancel: () => void;
  onSave: (input: { current: string; next: string; confirm: string }) => Promise<boolean>;
}

export function PasswordChangeForm({ onCancel, onSave }: PasswordChangeFormProps) {
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');

  const handleSave = async () => {
    const ok = await onSave({ current, next, confirm });
    if (ok) {
      setCurrent('');
      setNext('');
      setConfirm('');
      onCancel();
    }
  };

  const handleCancel = () => {
    setCurrent('');
    setNext('');
    setConfirm('');
    onCancel();
  };

  return (
    <View style={{ padding: 16 }}>
      <PasswordInput
        value={current}
        onChangeText={setCurrent}
        placeholder="Current password"
        autoFocus
      />
      <PasswordInput value={next} onChangeText={setNext} placeholder="New password" />
      <PasswordInput
        value={confirm}
        onChangeText={setConfirm}
        placeholder="Confirm new password"
      />
      <FormButtons onCancel={handleCancel} onConfirm={handleSave} confirmLabel="Update" />
    </View>
  );
}
