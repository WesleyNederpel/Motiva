import React, { useCallback, useMemo, useState } from 'react';
import { KeyboardAvoidingView, Platform, RefreshControl, ScrollView, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { AddTaskForm } from '@/components/dashboard/add-task-form';
import { CelebrationOverlay } from '@/components/dashboard/celebration-overlay';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { TaskSection } from '@/components/dashboard/task-section';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useTasksContext } from '@/features/tasks/tasks-context';
import { AddTaskInput } from '@/features/tasks/use-tasks';
import { useThemeColors, useThemedStyles } from '@/hooks/use-themed-styles';

export default function DashboardScreen() {
  const styles = useThemedStyles();
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  const {
    tasks,
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
    refresh,
  } = useTasksContext();

  const [showAddTask, setShowAddTask] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refresh();
    } finally {
      setRefreshing(false);
    }
  }, [refresh]);

  const handleAddTask = useCallback(async (input: AddTaskInput) => {
    const ok = await addTask(input);
    if (ok) setShowAddTask(false);
    return ok;
  }, [addTask]);

  const openTasks = useMemo(() => tasks.filter(t => !t.completed), [tasks]);
  const completedTasks = useMemo(() => tasks.filter(t => t.completed), [tasks]);

  const sharedCallbacks = {
    onToggleTask: toggleTask,
    onDeleteTask: deleteTask,
    onUpdateTask: updateTask,
    onToggleExpansion: toggleTaskExpansion,
    onAddSubtask: addSubtask,
    onToggleSubtask: toggleSubtask,
    onDeleteSubtask: deleteSubtask,
    onUpdateSubtask: updateSubtask,
  };

  return (
    <SafeAreaView style={styles.container}>
      <ThemedView style={styles.innerContainer}>
        <DashboardHeader onAdd={() => setShowAddTask(true)} />

        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView
            style={styles.taskList}
            contentContainerStyle={{ paddingBottom: insets.bottom + 16 }}
            automaticallyAdjustKeyboardInsets
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                tintColor={colors.tint}
                colors={[colors.tint]}
              />
            }
          >
            {showAddTask && (
              <AddTaskForm
                onCancel={() => setShowAddTask(false)}
                onSave={handleAddTask}
              />
            )}
            {tasks.length === 0 ? (
              <ThemedView style={styles.emptyState}>
                <ThemedText style={styles.emptyText}>
                  No tasks yet. Add your first task!
                </ThemedText>
              </ThemedView>
            ) : (
              <>
                <TaskSection
                  title="Open"
                  tasks={openTasks}
                  defaultExpanded={true}
                  expandedTasks={expandedTasks}
                  emptyMessage="No open tasks 🎉"
                  {...sharedCallbacks}
                />

                <View style={{ height: 1, backgroundColor: colors.border, marginVertical: 8 }} />

                <TaskSection
                  title="Completed"
                  tasks={completedTasks}
                  defaultExpanded={false}
                  expandedTasks={expandedTasks}
                  emptyMessage="Nothing completed yet."
                  {...sharedCallbacks}
                />
              </>
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      </ThemedView>
      <CelebrationOverlay />
    </SafeAreaView>
  );
}
