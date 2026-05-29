import React, { useState } from 'react';
import { TextInput } from 'react-native';

import { DateField } from '@/components/common/date-field';
import { FormButtons } from '@/components/common/form-buttons';
import { ThemedView } from '@/components/themed-view';
import { AddTaskInput } from '@/features/tasks/use-tasks';
import { useThemeColors, useThemedStyles } from '@/hooks/use-themed-styles';

interface AddTaskFormProps {
  onCancel: () => void;
  onSave: (input: AddTaskInput) => Promise<boolean>;
}

export function AddTaskForm({ onCancel, onSave }: AddTaskFormProps) {
  const styles = useThemedStyles();
  const colors = useThemeColors();

  const [title, setTitle] = useState('');
  const [reward, setReward] = useState('');
  const [deadline, setDeadline] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleSave = async () => {
    const ok = await onSave({ title, deadline, reward });
    if (ok) {
      setTitle('');
      setReward('');
      setDeadline(null);
      setShowDatePicker(false);
    }
  };

  const handleCancel = () => {
    setTitle('');
    setReward('');
    setDeadline(null);
    setShowDatePicker(false);
    onCancel();
  };

  return (
    <ThemedView style={styles.addTaskContainer}>
      <TextInput
        style={styles.input}
        placeholder="Task title..."
        value={title}
        onChangeText={setTitle}
        placeholderTextColor={colors.placeholder}
        autoFocus
      />
      <TextInput
        style={styles.input}
        placeholder="Reward (optional)..."
        value={reward}
        onChangeText={setReward}
        placeholderTextColor={colors.placeholder}
      />
      <DateField
        value={deadline}
        onChange={setDeadline}
        show={showDatePicker}
        setShow={setShowDatePicker}
        allowPast={true}
        style={styles.input}
      />
      <FormButtons
        onCancel={handleCancel}
        onConfirm={handleSave}
        confirmLabel="Save"
        rowStyleKey="addTaskButtons"
      />
    </ThemedView>
  );
}
