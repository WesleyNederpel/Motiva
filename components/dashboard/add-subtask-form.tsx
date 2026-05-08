import React, { useState } from 'react';
import { TextInput, View } from 'react-native';

import { DateField } from '@/components/common/date-field';
import { FormButtons } from '@/components/common/form-buttons';
import { useThemeColors, useThemedStyles } from '@/hooks/use-themed-styles';
import { AddSubtaskInput } from '@/features/tasks/use-tasks';

interface AddSubtaskFormProps {
  onCancel: () => void;
  onSave: (input: AddSubtaskInput) => Promise<boolean>;
}

export function AddSubtaskForm({ onCancel, onSave }: AddSubtaskFormProps) {
  const styles = useThemedStyles();
  const colors = useThemeColors();

  const [title, setTitle] = useState('');
  const [deadline, setDeadline] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleSave = async () => {
    const ok = await onSave({ title, deadline });
    if (ok) {
      setTitle('');
      setDeadline(null);
      setShowDatePicker(false);
    }
  };

  const handleCancel = () => {
    setTitle('');
    setDeadline(null);
    setShowDatePicker(false);
    onCancel();
  };

  return (
    <View style={styles.addSubtaskContainer}>
      <TextInput
        style={styles.subtaskInput}
        placeholder="Subtask title..."
        value={title}
        onChangeText={setTitle}
        placeholderTextColor={colors.placeholder}
        autoFocus
      />
      <DateField
        value={deadline}
        onChange={setDeadline}
        show={showDatePicker}
        setShow={setShowDatePicker}
        style={styles.subtaskInput}
      />
      <FormButtons
        onCancel={handleCancel}
        onConfirm={handleSave}
        confirmLabel="Add"
        rowStyleKey="addSubtaskButtons"
      />
    </View>
  );
}
