import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Subtask } from '@/features/tasks/types';
import { UpdateSubtaskInput } from '@/features/tasks/use-tasks';
import { formatDeadline, isOverdue } from '@/features/tasks/utils';
import { useThemeColors, useThemedStyles } from '@/hooks/use-themed-styles';
import { SubtaskEditForm } from './subtask-edit-form';

const subtaskInnerRow = { flex: 1, flexDirection: 'row' as const, alignItems: 'center' as const };

interface SubtaskRowProps {
  subtask: Subtask;
  onToggle: () => void;
  onDelete: () => void;
  onUpdate: (input: UpdateSubtaskInput) => Promise<boolean>;
}

export const SubtaskRow = React.memo(function SubtaskRow({ subtask, onToggle, onDelete, onUpdate }: SubtaskRowProps) {
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

  const overdue = isOverdue(subtask.deadline, subtask.completed);

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
        <View style={subtaskInnerRow}>
          <ThemedText
            style={[
              styles.subtaskTitle,
              subtask.completed && styles.taskTitleCompleted,
            ]}
          >
            {subtask.title}
          </ThemedText>
          {subtask.deadline ? (
            <ThemedText
              style={[
                styles.dateLabel,
                { flex: 1, textAlign: 'center' },
                overdue && styles.overdueText,
              ]}
            >
              {formatDeadline(subtask.deadline)}
            </ThemedText>
          ) : null}
          {overdue && (
            <View style={[styles.overduePill, { marginTop: 0, marginLeft: 6 }]}>
              <Text style={styles.overduePillText}>Overdue</Text>
            </View>
          )}
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
});
