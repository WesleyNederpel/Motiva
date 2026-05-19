import React, { useState } from 'react';
import { TextInput, View } from 'react-native';

import { DateField } from '@/components/common/date-field';
import { FormButtons } from '@/components/common/form-buttons';
import { Task } from '@/features/tasks/types';
import { UpdateTaskInput } from '@/features/tasks/use-tasks';
import { useThemeColors, useThemedStyles } from '@/hooks/use-themed-styles';

interface TaskEditFormProps {
  task: Task;
  onCancel: () => void;
  onSave: (input: UpdateTaskInput) => Promise<boolean>;
}

export function TaskEditForm({ task, onCancel, onSave }: TaskEditFormProps) {
  const styles = useThemedStyles();
  const colors = useThemeColors();

  const [title, setTitle] = useState(task.title);
  const [deadline, setDeadline] = useState<Date | null>(
    task.deadline ? new Date(task.deadline) : null
  );
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleSave = async () => {
    const ok = await onSave({ title, deadline });
    if (ok) onCancel();
  };

  return (
    <View>
      <TextInput
        style={styles.input}
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
        style={styles.input}
      />
      <FormButtons
        onCancel={onCancel}
        onConfirm={handleSave}
        confirmLabel="Save"
        rowStyleKey="editFormButtons"
      />
    </View>
  );
}
