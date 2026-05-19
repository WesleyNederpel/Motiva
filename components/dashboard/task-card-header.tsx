import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Task } from '@/features/tasks/types';
import { useThemeColors, useThemedStyles } from '@/hooks/use-themed-styles';

interface TaskCardHeaderProps {
  task: Task;
  expanded: boolean;
  onToggle: () => void;
  onDelete: () => void;
  onEdit: () => void;
  onToggleExpansion: () => void;
}

export const TaskCardHeader = React.memo(function TaskCardHeader({
  task,
  expanded,
  onToggle,
  onDelete,
  onEdit,
  onToggleExpansion,
}: TaskCardHeaderProps) {
  const styles = useThemedStyles();
  const colors = useThemeColors();

  return (
    <View style={styles.taskCardHeader}>
      <TouchableOpacity
        style={[styles.checkbox, task.completed && styles.checkboxChecked]}
        onPress={onToggle}
      >
        {task.completed && <Text style={styles.checkmark}>✓</Text>}
      </TouchableOpacity>
      <TouchableOpacity style={styles.taskTitleArea} onPress={onToggle}>
        <ThemedText
          style={[styles.taskTitle, task.completed && styles.taskTitleCompleted]}
        >
          {task.title}
        </ThemedText>
      </TouchableOpacity>
      <View style={styles.taskIcons}>
        <TouchableOpacity style={styles.iconButton} onPress={onEdit}>
          <IconSymbol size={22} name="pencil" color={colors.secondary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton} onPress={onDelete}>
          <IconSymbol size={22} name="trash" color={colors.error} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton} onPress={onToggleExpansion}>
          <IconSymbol
            size={22}
            name={expanded ? 'chevron.up' : 'chevron.down'}
            color={colors.text}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
});
