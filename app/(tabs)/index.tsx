import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColors, useThemedStyles } from '@/hooks/use-themed-styles';
import { supabase } from '@/lib/supabase';

interface Task {
  id: string;
  title: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
  deadline?: string | null;
  reward?: string | null;
  subtasks?: Subtask[];
}

interface Subtask {
  id: string;
  task_id: string;
  title: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
  deadline?: string | null;
}

export default function DashboardScreen() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [showAddTask, setShowAddTask] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set());
  const [newSubtaskTitles, setNewSubtaskTitles] = useState<{ [key: string]: string }>({});
  const [showAddSubtask, setShowAddSubtask] = useState<{ [key: string]: boolean }>({});
  const [newTaskDeadline, setNewTaskDeadline] = useState<Date | null>(null);
  const [newTaskReward, setNewTaskReward] = useState('');
  const [newSubtaskDeadlines, setNewSubtaskDeadlines] = useState<{ [key: string]: Date | null }>({});
  const [showTaskDatePicker, setShowTaskDatePicker] = useState(false);
  const [showSubtaskDatePicker, setShowSubtaskDatePicker] = useState<{ [key: string]: boolean }>({});

  // Theme-aware styles
  const styles = useThemedStyles();
  const colors = useThemeColors();

  // Progress bar component
  const ProgressBar = ({ task }: { task: Task }) => {
    let percentage = 0;

    if (task.subtasks && task.subtasks.length > 0) {
      // Calculate based on subtasks
      const completed = task.subtasks.filter(st => st.completed).length;
      percentage = Math.round((completed / task.subtasks.length) * 100);
    } else {
      // Use task completion when no subtasks
      percentage = task.completed ? 100 : 0;
    }

    return (
      <ThemedView style={styles.progressContainer}>
        <ThemedView style={styles.progressBar}>
          <ThemedView
            style={[
              styles.progressFill,
              { width: `${percentage}%` }
            ]}
          />
        </ThemedView>
        <ThemedText style={styles.progressText}>
          {percentage}%
        </ThemedText>
      </ThemedView>
    );
  };

  // Check user authentication
  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
    if (!user) {
      Alert.alert('Authentication Required', 'Please log in to access your tasks');
      setLoading(false);
      return false;
    }
    return true;
  };

  // Fetch tasks from Supabase
  const fetchTasks = async () => {
    try {
      const isAuthenticated = await checkUser();
      if (!isAuthenticated) return;

      const { data, error } = await supabase
        .from('tasks')
        .select(`
          *,
          subtasks (*)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching tasks:', error);
        Alert.alert('Error', 'Failed to load tasks');
        return;
      }

      setTasks(data || []);
    } catch (error) {
      console.error('Unexpected error:', error);
      Alert.alert('Error', 'An unexpected error occurred');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Load tasks when component mounts
  useEffect(() => {
    fetchTasks();
  }, []);

  const addTask = async () => {
    if (newTaskTitle.trim() === '') {
      Alert.alert('Error', 'Please enter a task title');
      return;
    }

    try {
      const isAuthenticated = await checkUser();
      if (!isAuthenticated) return;

      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        Alert.alert('Error', 'User authentication failed');
        return;
      }

      const { data, error } = await supabase
        .from('tasks')
        .insert({
          title: newTaskTitle.trim(),
          completed: false,
          user_id: user.id,
          deadline: newTaskDeadline ? newTaskDeadline.toISOString() : null,
          reward: newTaskReward.trim() || null,
        })
        .select()
        .single();

      if (error) {
        console.error('Error adding task:', error);
        Alert.alert('Error', 'Failed to add task');
        return;
      }

      setTasks([data, ...tasks]);
      setNewTaskTitle('');
      setNewTaskDeadline(null);
      setNewTaskReward('');
      setShowAddTask(false);
    } catch (error) {
      console.error('Unexpected error:', error);
      Alert.alert('Error', 'An unexpected error occurred');
    }
  };

  const toggleTask = async (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const newCompletedState = !task.completed;

    try {
      // Update main task
      const { error: taskError } = await supabase
        .from('tasks')
        .update({ completed: newCompletedState })
        .eq('id', taskId);

      if (taskError) {
        console.error('Error updating task:', taskError);
        Alert.alert('Error', 'Failed to update task');
        return;
      }

      // If task has subtasks, update all subtasks to match the main task state
      if (task.subtasks && task.subtasks.length > 0) {
        const { error: subtaskError } = await supabase
          .from('subtasks')
          .update({ completed: newCompletedState })
          .eq('task_id', taskId);

        if (subtaskError) {
          console.error('Error updating subtasks:', subtaskError);
          Alert.alert('Error', 'Failed to update subtasks');
          return;
        }
      }

      // Update local state
      setTasks(tasks.map(t => {
        if (t.id === taskId) {
          return {
            ...t,
            completed: newCompletedState,
            subtasks: t.subtasks?.map(s => ({ ...s, completed: newCompletedState }))
          };
        }
        return t;
      }));
    } catch (error) {
      console.error('Unexpected error:', error);
      Alert.alert('Error', 'An unexpected error occurred');
    }
  };

  const deleteTask = async (taskId: string) => {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task and all its subtasks?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const { error } = await supabase
                .from('tasks')
                .delete()
                .eq('id', taskId);

              if (error) {
                console.error('Error deleting task:', error);
                Alert.alert('Error', 'Failed to delete task');
                return;
              }

              setTasks(tasks.filter(task => task.id !== taskId));
            } catch (error) {
              console.error('Unexpected error:', error);
              Alert.alert('Error', 'An unexpected error occurred');
            }
          },
        },
      ]
    );
  };

  const toggleTaskExpansion = (taskId: string) => {
    const newExpanded = new Set(expandedTasks);
    if (newExpanded.has(taskId)) {
      newExpanded.delete(taskId);
    } else {
      newExpanded.add(taskId);
    }
    setExpandedTasks(newExpanded);
  };

  const addSubtask = async (taskId: string) => {
    const title = newSubtaskTitles[taskId]?.trim();
    const deadline = newSubtaskDeadlines[taskId];

    if (title === '') {
      Alert.alert('Error', 'Please enter a subtask title');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('subtasks')
        .insert({
          task_id: taskId,
          title: title,
          completed: false,
          deadline: deadline ? deadline.toISOString() : null,
        })
        .select()
        .single();

      if (error) {
        console.error('Error adding subtask:', error);
        Alert.alert('Error', 'Failed to add subtask');
        return;
      }

      // Update local state
      setTasks(tasks.map(task => {
        if (task.id === taskId) {
          return {
            ...task,
            subtasks: [...(task.subtasks || []), data]
          };
        }
        return task;
      }));

      // Clear input and hide form
      setNewSubtaskTitles(prev => ({ ...prev, [taskId]: '' }));
      setNewSubtaskDeadlines(prev => ({ ...prev, [taskId]: null }));
      setShowAddSubtask(prev => ({ ...prev, [taskId]: false }));
    } catch (error) {
      console.error('Unexpected error:', error);
      Alert.alert('Error', 'An unexpected error occurred');
    }
  };

  const toggleSubtask = async (subtaskId: string, taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    const subtask = task?.subtasks?.find(s => s.id === subtaskId);
    if (!subtask) return;

    const newSubtaskCompleted = !subtask.completed;

    try {
      // Update the subtask
      const { error: subtaskError } = await supabase
        .from('subtasks')
        .update({ completed: newSubtaskCompleted })
        .eq('id', subtaskId);

      if (subtaskError) {
        console.error('Error updating subtask:', subtaskError);
        Alert.alert('Error', 'Failed to update subtask');
        return;
      }

      // Update local state first to calculate the new task state
      const updatedTasks = tasks.map(task => {
        if (task.id === taskId) {
          const updatedSubtasks = task.subtasks?.map(s =>
            s.id === subtaskId ? { ...s, completed: newSubtaskCompleted } : s
          );

          // Check if all subtasks are now completed
          const allSubtasksCompleted = updatedSubtasks && updatedSubtasks.length > 0 &&
            updatedSubtasks.every(s => s.completed);

          return {
            ...task,
            subtasks: updatedSubtasks,
            completed: allSubtasksCompleted || false
          };
        }
        return task;
      });

      // Update the main task if all subtasks are completed
      const updatedTask = updatedTasks.find(t => t.id === taskId);
      if (updatedTask && updatedTask.subtasks && updatedTask.subtasks.length > 0) {
        const allSubtasksCompleted = updatedTask.subtasks.every(s => s.completed);

        const { error: taskError } = await supabase
          .from('tasks')
          .update({ completed: allSubtasksCompleted })
          .eq('id', taskId);

        if (taskError) {
          console.error('Error updating task:', taskError);
          Alert.alert('Error', 'Failed to update task');
          return;
        }
      }

      setTasks(updatedTasks);
    } catch (error) {
      console.error('Unexpected error:', error);
      Alert.alert('Error', 'An unexpected error occurred');
    }
  };

  const deleteSubtask = async (subtaskId: string, taskId: string) => {
    try {
      const { error } = await supabase
        .from('subtasks')
        .delete()
        .eq('id', subtaskId);

      if (error) {
        console.error('Error deleting subtask:', error);
        Alert.alert('Error', 'Failed to delete subtask');
        return;
      }

      // Update local state
      setTasks(tasks.map(task => {
        if (task.id === taskId) {
          return {
            ...task,
            subtasks: task.subtasks?.filter(s => s.id !== subtaskId)
          };
        }
        return task;
      }));
    } catch (error) {
      console.error('Unexpected error:', error);
      Alert.alert('Error', 'An unexpected error occurred');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ThemedView style={styles.innerContainer}>
        <ThemedView style={styles.header}>
          <ThemedText type="title">Dashboard</ThemedText>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setShowAddTask(true)}
          >
            <ThemedText style={styles.addButtonText}>+ Add Task</ThemedText>
          </TouchableOpacity>
        </ThemedView>

        {showAddTask && (
          <ThemedView style={styles.addTaskContainer}>
            <TextInput
              style={styles.input}
              placeholder="Enter task title..."
              value={newTaskTitle}
              onChangeText={setNewTaskTitle}
              placeholderTextColor={colors.placeholder}
              autoFocus
            />
            <TextInput
              style={styles.input}
              placeholder="Enter reward (optional)..."
              value={newTaskReward}
              onChangeText={setNewTaskReward}
              placeholderTextColor={colors.placeholder}
            />
            <TouchableOpacity
              style={styles.input}
              onPress={() => setShowTaskDatePicker(true)}
            >
              <ThemedText style={{ color: newTaskDeadline ? colors.text : colors.placeholder }}>
                {newTaskDeadline ? newTaskDeadline.toLocaleDateString() : 'Select deadline (optional)...'}
              </ThemedText>
            </TouchableOpacity>
            {showTaskDatePicker && (
              <DateTimePicker
                value={newTaskDeadline || new Date()}
                mode="date"
                display="default"
                onChange={(event: any, selectedDate?: Date) => {
                  setShowTaskDatePicker(false);
                  if (selectedDate) {
                    setNewTaskDeadline(selectedDate);
                  }
                }}
              />
            )}
            <ThemedView style={styles.addTaskButtons}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => {
                  setShowAddTask(false);
                  setNewTaskTitle('');
                  setNewTaskDeadline(null);
                  setNewTaskReward('');
                }}
              >
                <ThemedText style={styles.cancelButtonText}>Cancel</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.saveButton]}
                onPress={addTask}
              >
                <ThemedText style={styles.saveButtonText}>Save</ThemedText>
              </TouchableOpacity>
            </ThemedView>
          </ThemedView>
        )}

        <ScrollView style={styles.taskList}>
          {loading ? (
            <ThemedView style={styles.emptyState}>
              <ThemedText style={styles.emptyText}>Loading tasks...</ThemedText>
            </ThemedView>
          ) : tasks.length === 0 ? (
            <ThemedView style={styles.emptyState}>
              <ThemedText style={styles.emptyText}>No tasks yet. Add your first task!</ThemedText>
            </ThemedView>
          ) : (
            tasks.map(task => (
              <ThemedView key={task.id} style={styles.taskItem}>
                {/* Main Task Row */}
                <ThemedView style={styles.taskRow}>
                  <TouchableOpacity
                    style={styles.taskContent}
                    onPress={() => toggleTask(task.id)}
                  >
                    <ThemedView style={[
                      styles.checkbox,
                      task.completed && styles.checkboxChecked
                    ]}>
                      {task.completed && (
                        <ThemedText style={styles.checkmark}>✓</ThemedText>
                      )}
                    </ThemedView>
                    <ThemedView style={styles.taskTitleContainer}>
                      <ThemedText style={[
                        styles.taskTitle,
                        task.completed && styles.taskTitleCompleted
                      ]}>
                        {task.title}
                      </ThemedText>
                      {task.deadline && (
                        <ThemedText style={styles.deadlineText}>
                          📅 Due: {new Date(task.deadline).toLocaleDateString()}
                        </ThemedText>
                      )}
                      {task.reward && (
                        <ThemedText style={styles.rewardText}>
                          🎁 Reward: {task.reward}
                        </ThemedText>
                      )}
                      <ProgressBar task={task} />
                    </ThemedView>
                  </TouchableOpacity>
                  <ThemedView style={styles.taskActions}>
                    <TouchableOpacity
                      style={styles.expandButton}
                      onPress={() => toggleTaskExpansion(task.id)}
                    >
                      <ThemedText style={styles.expandButtonText}>
                        {expandedTasks.has(task.id) ? '▼' : '▶'}
                      </ThemedText>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => deleteTask(task.id)}
                    >
                      <ThemedText style={styles.deleteButtonText}>×</ThemedText>
                    </TouchableOpacity>
                  </ThemedView>
                </ThemedView>

                {/* Subtasks Section */}
                {expandedTasks.has(task.id) && (
                  <ThemedView style={styles.subtasksContainer}>
                    {/* Add Subtask Form */}
                    {showAddSubtask[task.id] && (
                      <ThemedView style={styles.addSubtaskContainer}>
                        <TextInput
                          style={styles.subtaskInput}
                          placeholder="Enter subtask title..."
                          value={newSubtaskTitles[task.id] || ''}
                          onChangeText={(text) => setNewSubtaskTitles(prev => ({ ...prev, [task.id]: text }))}
                          placeholderTextColor={colors.placeholder}
                          autoFocus
                        />
                        <TouchableOpacity
                          style={styles.subtaskInput}
                          onPress={() => setShowSubtaskDatePicker(prev => ({ ...prev, [task.id]: true }))}
                        >
                          <ThemedText style={{ color: newSubtaskDeadlines[task.id] ? colors.text : colors.placeholder }}>
                            {newSubtaskDeadlines[task.id] ? newSubtaskDeadlines[task.id]!.toLocaleDateString() : 'Select deadline (optional)...'}
                          </ThemedText>
                        </TouchableOpacity>
                        {showSubtaskDatePicker[task.id] && (
                          <DateTimePicker
                            value={newSubtaskDeadlines[task.id] || new Date()}
                            mode="date"
                            display="default"
                            onChange={(event: any, selectedDate?: Date) => {
                              setShowSubtaskDatePicker(prev => ({ ...prev, [task.id]: false }));
                              if (selectedDate) {
                                setNewSubtaskDeadlines(prev => ({ ...prev, [task.id]: selectedDate }));
                              }
                            }}
                          />
                        )}
                        <ThemedView style={styles.addSubtaskButtons}>
                          <TouchableOpacity
                            style={[styles.button, styles.cancelButton]}
                            onPress={() => {
                              setShowAddSubtask(prev => ({ ...prev, [task.id]: false }));
                              setNewSubtaskTitles(prev => ({ ...prev, [task.id]: '' }));
                              setNewSubtaskDeadlines(prev => ({ ...prev, [task.id]: null }));
                            }}
                          >
                            <ThemedText style={styles.cancelButtonText}>Cancel</ThemedText>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={[styles.button, styles.saveButton]}
                            onPress={() => addSubtask(task.id)}
                          >
                            <ThemedText style={styles.saveButtonText}>Add</ThemedText>
                          </TouchableOpacity>
                        </ThemedView>
                      </ThemedView>
                    )}

                    {/* Subtask List */}
                    {task.subtasks?.map(subtask => (
                      <ThemedView key={subtask.id} style={styles.subtaskItem}>
                        <TouchableOpacity
                          style={styles.subtaskContent}
                          onPress={() => toggleSubtask(subtask.id, task.id)}
                        >
                          <ThemedView style={[
                            styles.checkbox,
                            styles.subtaskCheckbox,
                            subtask.completed && styles.checkboxChecked
                          ]}>
                            {subtask.completed && (
                              <ThemedText style={styles.checkmark}>✓</ThemedText>
                            )}
                          </ThemedView>
                          <ThemedView style={styles.subtaskTitleContainer}>
                            <ThemedText style={[
                              styles.subtaskTitle,
                              subtask.completed && styles.taskTitleCompleted
                            ]}>
                              {subtask.title}
                            </ThemedText>
                            {subtask.deadline && (
                              <ThemedText style={styles.subtaskDeadlineText}>
                                📅 Due: {new Date(subtask.deadline).toLocaleDateString()}
                              </ThemedText>
                            )}
                          </ThemedView>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.deleteButton}
                          onPress={() => deleteSubtask(subtask.id, task.id)}
                        >
                          <ThemedText style={styles.deleteButtonText}>×</ThemedText>
                        </TouchableOpacity>
                      </ThemedView>
                    ))}

                    {/* Add Subtask Button */}
                    {!showAddSubtask[task.id] && (
                      <TouchableOpacity
                        style={styles.addSubtaskButton}
                        onPress={() => setShowAddSubtask(prev => ({ ...prev, [task.id]: true }))}
                      >
                        <ThemedText style={styles.addSubtaskButtonText}>+ Add Subtask</ThemedText>
                      </TouchableOpacity>
                    )}
                  </ThemedView>
                )}
              </ThemedView>
            ))
          )}
        </ScrollView>
      </ThemedView>
    </SafeAreaView>
  );
}

