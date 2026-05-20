import React, { useState } from 'react';
import { TouchableOpacity, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Task } from '@/features/tasks/types';
import {
  AddSubtaskInput,
  UpdateSubtaskInput,
  UpdateTaskInput,
} from '@/features/tasks/use-tasks';
import { useThemeColors, useThemedStyles } from '@/hooks/use-themed-styles';
import { TaskCard } from './task-card';

interface TaskSectionProps {
  title: string;
  tasks: Task[];
  defaultExpanded: boolean;
  expandedTasks: Set<string>;
  emptyMessage: string;
  onToggleTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onUpdateTask: (taskId: string, input: UpdateTaskInput) => Promise<boolean>;
  onToggleExpansion: (taskId: string) => void;
  onAddSubtask: (taskId: string, input: AddSubtaskInput) => Promise<boolean>;
  onToggleSubtask: (subtaskId: string, taskId: string) => void;
  onDeleteSubtask: (subtaskId: string, taskId: string) => void;
  onUpdateSubtask: (subtaskId: string, taskId: string, input: UpdateSubtaskInput) => Promise<boolean>;
}

export function TaskSection({
  title,
  tasks,
  defaultExpanded,
  expandedTasks,
  emptyMessage,
  onToggleTask,
  onDeleteTask,
  onUpdateTask,
  onToggleExpansion,
  onAddSubtask,
  onToggleSubtask,
  onDeleteSubtask,
  onUpdateSubtask,
}: TaskSectionProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const styles = useThemedStyles();
  const colors = useThemeColors();

  return (
    <View style={{ marginBottom: 8 }}>
      <TouchableOpacity
        onPress={() => setExpanded(prev => !prev)}
        activeOpacity={0.7}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingVertical: 10,
          paddingHorizontal: 2,
          marginBottom: 6,
        }}
      >
        <ThemedText style={{ fontSize: 16, fontWeight: '700', color: colors.text }}>
          {title}
        </ThemedText>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <View
            style={{
              backgroundColor: colors.secondary,
              borderRadius: 12,
              paddingHorizontal: 8,
              paddingVertical: 2,
            }}
          >
            <ThemedText style={{ fontSize: 12, fontWeight: '700', color: '#FFFFFF' }}>
              {tasks.length}
            </ThemedText>
          </View>

          <IconSymbol
            size={22}
            name={expanded ? 'chevron.up' : 'chevron.down'}
            color={colors.muted}
          />
        </View>
      </TouchableOpacity>

      {expanded && (
        <>
          {tasks.length === 0 ? (
            <ThemedText style={[styles.emptyText, { paddingVertical: 12, paddingHorizontal: 2 }]}>
              {emptyMessage}
            </ThemedText>
          ) : (
            tasks.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                expanded={expandedTasks.has(task.id)}
                onToggleTask={onToggleTask}
                onDeleteTask={onDeleteTask}
                onUpdateTask={onUpdateTask}
                onToggleExpansion={onToggleExpansion}
                onAddSubtask={onAddSubtask}
                onToggleSubtask={onToggleSubtask}
                onDeleteSubtask={onDeleteSubtask}
                onUpdateSubtask={onUpdateSubtask}
              />
            ))
          )}
        </>
      )}
    </View>
  );
}
