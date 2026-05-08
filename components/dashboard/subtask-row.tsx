import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Subtask } from '@/features/tasks/types';
import { UpdateSubtaskInput } from '@/features/tasks/use-tasks';
import { formatDeadline } from '@/features/tasks/utils';
import { useThemeColors, useThemedStyles } from '@/hooks/use-themed-styles';
import { SubtaskEditForm } from './subtask-edit-form';

interface SubtaskRowProps {
  subtask: Subtask;
  onToggle: () => void;
  onDelete: () => void;
  onUpdate: (input: UpdateSubtaskInput) => Promise<boolean>;
}

export function SubtaskRow({ subtask, onToggle, onDelete, onUpdate }: SubtaskRowProps) {
  const styles = useThemedStyles();
  const colors = useThemeColors();
  const [isEditing, setIsEditing] = useState(false);

  if (isEditing) {
    return (
      <SubtaskEditForm
        subtask={subtask}
        onCancel={() => setIsEditing(false)}
        onSave={onUpdate}
      />
    );
  }

  return (
    <View style={styles.subtaskItemRow}>
      <TouchableOpacity style={styles.subtaskContent} onPress={onToggle}>
        <View
          style={[
            styles.subtaskCheckbox,
            subtask.completed && styles.subtaskCheckboxDone,
          ]}
        >
          {subtask.completed && (
            <Text style={styles.subtaskCheckmarkText}>✓</Text>
          )}
        </View>
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
          <ThemedText
            style={[
              styles.subtaskTitle,
              subtask.completed && styles.taskTitleCompleted,
            ]}
          >
            {subtask.title}
          </ThemedText>
          {subtask.deadline ? (
            <ThemedText style={[styles.dateLabel, { flex: 1, textAlign: 'center' }]}>
              {formatDeadline(subtask.deadline)}
            </ThemedText>
          ) : null}
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={styles.iconButton} onPress={() => setIsEditing(true)}>
        <IconSymbol size={20} name="pencil" color={colors.secondary} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.iconButton} onPress={onDelete}>
        <IconSymbol size={20} name="trash" color={colors.error} />
      </TouchableOpacity>
    </View>
  );
}
