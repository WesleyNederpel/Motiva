import React, { useCallback, useState } from 'react';
import { FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AddTaskForm } from '@/components/dashboard/add-task-form';
import { CelebrationOverlay } from '@/components/dashboard/celebration-overlay';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { TaskCard } from '@/components/dashboard/task-card';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Task } from '@/features/tasks/types';
import { AddTaskInput, useTasks } from '@/features/tasks/use-tasks';
import { useThemedStyles } from '@/hooks/use-themed-styles';

export default function DashboardScreen() {
  const styles = useThemedStyles();
  const {
    tasks,
    loading,
    expandedTasks,
    addTask,
    toggleTask,
    deleteTask,
    updateTask,
    toggleTaskExpansion,
    addSubtask,
    toggleSubtask,
    deleteSubtask,
    updateSubtask,
  } = useTasks();

  const [showAddTask, setShowAddTask] = useState(false);

  const handleAddTask = useCallback(async (input: AddTaskInput) => {
    const ok = await addTask(input);
    if (ok) setShowAddTask(false);
    return ok;
  }, [addTask]);

  const renderItem = useCallback(({ item: task }: { item: Task }) => (
    <TaskCard
      task={task}
      expanded={expandedTasks.has(task.id)}
      onToggleTask={toggleTask}
      onDeleteTask={deleteTask}
      onUpdateTask={updateTask}
      onToggleExpansion={toggleTaskExpansion}
      onAddSubtask={addSubtask}
      onToggleSubtask={toggleSubtask}
      onDeleteSubtask={deleteSubtask}
      onUpdateSubtask={updateSubtask}
    />
  ), [
    expandedTasks,
    toggleTask, deleteTask, updateTask, toggleTaskExpansion,
    addSubtask, toggleSubtask, deleteSubtask, updateSubtask,
  ]);

  const keyExtractor = useCallback((task: Task) => task.id, []);

  return (
    <SafeAreaView style={styles.container}>
      <ThemedView style={styles.innerContainer}>
        <DashboardHeader onAdd={() => setShowAddTask(true)} />

        {showAddTask && (
          <AddTaskForm
            onCancel={() => setShowAddTask(false)}
            onSave={handleAddTask}
          />
        )}

        {loading ? (
          <ThemedView style={styles.emptyState}>
            <ThemedText style={styles.emptyText}>Loading tasks...</ThemedText>
          </ThemedView>
        ) : (
          <FlatList
            data={tasks}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            style={styles.taskList}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <ThemedView style={styles.emptyState}>
                <ThemedText style={styles.emptyText}>
                  No tasks yet. Add your first task!
                </ThemedText>
              </ThemedView>
            }
          />
        )}
      </ThemedView>
      <CelebrationOverlay />
    </SafeAreaView>
  );
}
