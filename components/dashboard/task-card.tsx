import React, { useState } from 'react';

import { ThemedView } from '@/components/themed-view';
import { useThemedStyles } from '@/hooks/use-themed-styles';
import { Task } from '@/features/tasks/types';
import {
  AddSubtaskInput,
  UpdateSubtaskInput,
  UpdateTaskInput,
} from '@/features/tasks/use-tasks';
import { SubtaskList } from './subtask-list';
import { TaskCardHeader } from './task-card-header';
import { TaskEditForm } from './task-edit-form';
import { TaskProgress } from './task-progress';

interface TaskCardProps {
  task: Task;
  expanded: boolean;
  onToggleTask: () => void;
  onDeleteTask: () => void;
  onUpdateTask: (input: UpdateTaskInput) => Promise<boolean>;
  onToggleExpansion: () => void;
  onAddSubtask: (input: AddSubtaskInput) => Promise<boolean>;
  onToggleSubtask: (subtaskId: string) => void;
  onDeleteSubtask: (subtaskId: string) => void;
  onUpdateSubtask: (subtaskId: string, input: UpdateSubtaskInput) => Promise<boolean>;
}

export function TaskCard({
  task,
  expanded,
  onToggleTask,
  onDeleteTask,
  onUpdateTask,
  onToggleExpansion,
  onAddSubtask,
  onToggleSubtask,
  onDeleteSubtask,
  onUpdateSubtask,
}: TaskCardProps) {
  const styles = useThemedStyles();
  const [isEditing, setIsEditing] = useState(false);

  return (
    <ThemedView style={styles.taskCard}>
      {isEditing ? (
        <TaskEditForm
          task={task}
          onCancel={() => setIsEditing(false)}
          onSave={onUpdateTask}
        />
      ) : (
        <>
          <TaskCardHeader
            task={task}
            expanded={expanded}
            onToggle={onToggleTask}
            onDelete={onDeleteTask}
            onEdit={() => setIsEditing(true)}
            onToggleExpansion={onToggleExpansion}
          />

          <TaskProgress task={task} />

          {expanded && (
            <SubtaskList
              task={task}
              onAddSubtask={onAddSubtask}
              onToggleSubtask={onToggleSubtask}
              onDeleteSubtask={onDeleteSubtask}
              onUpdateSubtask={onUpdateSubtask}
            />
          )}
        </>
      )}
    </ThemedView>
  );
}
