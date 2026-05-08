import React, { useState } from 'react';
import { TextInput, View } from 'react-native';

import { DateField } from '@/components/common/date-field';
import { FormButtons } from '@/components/common/form-buttons';
import { useThemeColors, useThemedStyles } from '@/hooks/use-themed-styles';
import { Subtask } from '@/features/tasks/types';
import { UpdateSubtaskInput } from '@/features/tasks/use-tasks';

interface SubtaskEditFormProps {
  subtask: Subtask;
  onCancel: () => void;
  onSave: (input: UpdateSubtaskInput) => Promise<boolean>;
}

export function SubtaskEditForm({ subtask, onCancel, onSave }: SubtaskEditFormProps) {
  const styles = useThemedStyles();
  const colors = useThemeColors();

  const [title, setTitle] = useState(subtask.title);
  const [deadline, setDeadline] = useState<Date | null>(
    subtask.deadline ? new Date(subtask.deadline) : null
  );
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleSave = async () => {
    const ok = await onSave({ title, deadline });
    if (ok) onCancel();
  };

  return (
    <View style={styles.addSubtaskContainer}>
      <TextInput
        style={styles.subtaskInput}
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
        onCancel={onCancel}
        onConfirm={handleSave}
        confirmLabel="Save"
        rowStyleKey="addSubtaskButtons"
      />
    </View>
  );
}
