import React, { useState } from 'react';
import { TouchableOpacity, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { useThemedStyles } from '@/hooks/use-themed-styles';
import { Task } from '@/features/tasks/types';
import {
  AddSubtaskInput,
  UpdateSubtaskInput,
} from '@/features/tasks/use-tasks';
import { AddSubtaskForm } from './add-subtask-form';
import { SubtaskRow } from './subtask-row';

interface SubtaskListProps {
  task: Task;
  onAddSubtask: (input: AddSubtaskInput) => Promise<boolean>;
  onToggleSubtask: (subtaskId: string) => void;
  onDeleteSubtask: (subtaskId: string) => void;
  onUpdateSubtask: (subtaskId: string, input: UpdateSubtaskInput) => Promise<boolean>;
}

export function SubtaskList({
  task,
  onAddSubtask,
  onToggleSubtask,
  onDeleteSubtask,
  onUpdateSubtask,
}: SubtaskListProps) {
  const styles = useThemedStyles();
  const [showAdd, setShowAdd] = useState(false);

  const handleAdd = async (input: AddSubtaskInput) => {
    const ok = await onAddSubtask(input);
    if (ok) setShowAdd(false);
    return ok;
  };

  return (
    <View style={styles.subtasksSection}>
      {showAdd && (
        <AddSubtaskForm onCancel={() => setShowAdd(false)} onSave={handleAdd} />
      )}

      {task.subtasks?.map(subtask => (
        <SubtaskRow
          key={subtask.id}
          subtask={subtask}
          onToggle={() => onToggleSubtask(subtask.id)}
          onDelete={() => onDeleteSubtask(subtask.id)}
          onUpdate={(input) => onUpdateSubtask(subtask.id, input)}
        />
      ))}

      {!showAdd && (
        <TouchableOpacity
          style={styles.addSubtaskButton}
          onPress={() => setShowAdd(true)}
        >
          <ThemedText style={styles.addSubtaskButtonText}>+ Add Subtask</ThemedText>
        </TouchableOpacity>
      )}
    </View>
  );
}
