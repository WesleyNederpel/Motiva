import React, { useState } from 'react';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AddTaskForm } from '@/components/dashboard/add-task-form';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { TaskCard } from '@/components/dashboard/task-card';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemedStyles } from '@/hooks/use-themed-styles';
import { useTasks } from '@/features/tasks/use-tasks';

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

  const handleAddTask: typeof addTask = async (input) => {
    const ok = await addTask(input);
    if (ok) setShowAddTask(false);
    return ok;
  };

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

        <ScrollView style={styles.taskList} showsVerticalScrollIndicator={false}>
          {loading ? (
            <ThemedView style={styles.emptyState}>
              <ThemedText style={styles.emptyText}>Loading tasks...</ThemedText>
            </ThemedView>
          ) : tasks.length === 0 ? (
            <ThemedView style={styles.emptyState}>
              <ThemedText style={styles.emptyText}>
                No tasks yet. Add your first task!
              </ThemedText>
            </ThemedView>
          ) : (
            tasks.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                expanded={expandedTasks.has(task.id)}
                onToggleTask={() => toggleTask(task.id)}
                onDeleteTask={() => deleteTask(task.id)}
                onUpdateTask={(input) => updateTask(task.id, input)}
                onToggleExpansion={() => toggleTaskExpansion(task.id)}
                onAddSubtask={(input) => addSubtask(task.id, input)}
                onToggleSubtask={(subtaskId) => toggleSubtask(subtaskId, task.id)}
                onDeleteSubtask={(subtaskId) => deleteSubtask(subtaskId, task.id)}
                onUpdateSubtask={(subtaskId, input) => updateSubtask(subtaskId, task.id, input)}
              />
            ))
          )}
        </ScrollView>
      </ThemedView>
    </SafeAreaView>
  );
}
