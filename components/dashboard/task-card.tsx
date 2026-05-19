import React, { useCallback, useState } from 'react';

import { ThemedView } from '@/components/themed-view';
import { Task } from '@/features/tasks/types';
import {
  AddSubtaskInput,
  UpdateSubtaskInput,
  UpdateTaskInput,
} from '@/features/tasks/use-tasks';
import { useThemedStyles } from '@/hooks/use-themed-styles';
import { SubtaskList } from './subtask-list';
import { TaskCardHeader } from './task-card-header';
import { TaskEditForm } from './task-edit-form';
import { TaskProgress } from './task-progress';

interface TaskCardProps {
  task: Task;
  expanded: boolean;
  onToggleTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onUpdateTask: (taskId: string, input: UpdateTaskInput) => Promise<boolean>;
  onToggleExpansion: (taskId: string) => void;
  onAddSubtask: (taskId: string, input: AddSubtaskInput) => Promise<boolean>;
  onToggleSubtask: (subtaskId: string, taskId: string) => void;
  onDeleteSubtask: (subtaskId: string, taskId: string) => void;
  onUpdateSubtask: (subtaskId: string, taskId: string, input: UpdateSubtaskInput) => Promise<boolean>;
}

export const TaskCard = React.memo(function TaskCard({
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

  const handleToggleTask = useCallback(() => onToggleTask(task.id), [onToggleTask, task.id]);
  const handleDeleteTask = useCallback(() => onDeleteTask(task.id), [onDeleteTask, task.id]);
  const handleToggleExpansion = useCallback(() => onToggleExpansion(task.id), [onToggleExpansion, task.id]);
  const handleUpdateTask = useCallback(
    (input: UpdateTaskInput) => onUpdateTask(task.id, input),
    [onUpdateTask, task.id]
  );
  const handleAddSubtask = useCallback(
    (input: AddSubtaskInput) => onAddSubtask(task.id, input),
    [onAddSubtask, task.id]
  );
  const handleToggleSubtask = useCallback(
    (subtaskId: string) => onToggleSubtask(subtaskId, task.id),
    [onToggleSubtask, task.id]
  );
  const handleDeleteSubtask = useCallback(
    (subtaskId: string) => onDeleteSubtask(subtaskId, task.id),
    [onDeleteSubtask, task.id]
  );
  const handleUpdateSubtask = useCallback(
    (subtaskId: string, input: UpdateSubtaskInput) => onUpdateSubtask(subtaskId, task.id, input),
    [onUpdateSubtask, task.id]
  );
  const handleCancelEdit = useCallback(() => setIsEditing(false), []);
  const handleStartEdit = useCallback(() => setIsEditing(true), []);

  return (
    <ThemedView style={styles.taskCard}>
      {isEditing ? (
        <TaskEditForm
          task={task}
          onCancel={handleCancelEdit}
          onSave={handleUpdateTask}
        />
      ) : (
        <>
          <TaskCardHeader
            task={task}
            expanded={expanded}
            onToggle={handleToggleTask}
            onDelete={handleDeleteTask}
            onEdit={handleStartEdit}
            onToggleExpansion={handleToggleExpansion}
          />

          <TaskProgress task={task} />

          {expanded && (
            <SubtaskList
              task={task}
              onAddSubtask={handleAddSubtask}
              onToggleSubtask={handleToggleSubtask}
              onDeleteSubtask={handleDeleteSubtask}
              onUpdateSubtask={handleUpdateSubtask}
            />
          )}
        </>
      )}
    </ThemedView>
  );
});
