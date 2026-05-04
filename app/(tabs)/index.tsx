import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BaseStyles, DashboardStyles } from '@/constants/styles';
import { supabase } from '@/lib/supabase';

interface Task {
  id: string;
  title: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
  deadline?: string | null;
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
  const [newSubtaskDeadlines, setNewSubtaskDeadlines] = useState<{ [key: string]: Date | null }>({});
  const [showTaskDatePicker, setShowTaskDatePicker] = useState(false);
  const [showSubtaskDatePicker, setShowSubtaskDatePicker] = useState<{ [key: string]: boolean }>({});

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
      setShowAddTask(false);
    } catch (error) {
      console.error('Unexpected error:', error);
      Alert.alert('Error', 'An unexpected error occurred');
    }
  };

  const toggleTask = async (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    try {
      const { error } = await supabase
        .from('tasks')
        .update({ completed: !task.completed })
        .eq('id', taskId);

      if (error) {
        console.error('Error updating task:', error);
        Alert.alert('Error', 'Failed to update task');
        return;
      }

      setTasks(tasks.map(t =>
        t.id === taskId ? { ...t, completed: !t.completed } : t
      ));
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

    try {
      const { error } = await supabase
        .from('subtasks')
        .update({ completed: !subtask.completed })
        .eq('id', subtaskId);

      if (error) {
        console.error('Error updating subtask:', error);
        Alert.alert('Error', 'Failed to update subtask');
        return;
      }

      // Update local state
      setTasks(tasks.map(task => {
        if (task.id === taskId) {
          return {
            ...task,
            subtasks: task.subtasks?.map(s =>
              s.id === subtaskId ? { ...s, completed: !s.completed } : s
            )
          };
        }
        return task;
      }));
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
    <SafeAreaView style={BaseStyles.container}>
      <ThemedView style={BaseStyles.innerContainer}>
        <ThemedView style={DashboardStyles.header}>
          <ThemedText type="title">Dashboard</ThemedText>
          <TouchableOpacity
            style={DashboardStyles.addButton}
            onPress={() => setShowAddTask(true)}
          >
            <ThemedText style={DashboardStyles.addButtonText}>+ Add Task</ThemedText>
          </TouchableOpacity>
        </ThemedView>

        {showAddTask && (
          <ThemedView style={DashboardStyles.addTaskContainer}>
            <TextInput
              style={BaseStyles.input}
              placeholder="Enter task title..."
              value={newTaskTitle}
              onChangeText={setNewTaskTitle}
              autoFocus
            />
            <TouchableOpacity
              style={BaseStyles.input}
              onPress={() => setShowTaskDatePicker(true)}
            >
              <ThemedText style={{ color: newTaskDeadline ? '#000' : '#999' }}>
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
            <ThemedView style={DashboardStyles.addTaskButtons}>
              <TouchableOpacity
                style={[BaseStyles.button, DashboardStyles.cancelButton]}
                onPress={() => {
                  setShowAddTask(false);
                  setNewTaskTitle('');
                  setNewTaskDeadline(null);
                }}
              >
                <ThemedText style={DashboardStyles.cancelButtonText}>Cancel</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                style={[BaseStyles.button, DashboardStyles.saveButton]}
                onPress={addTask}
              >
                <ThemedText style={DashboardStyles.saveButtonText}>Save</ThemedText>
              </TouchableOpacity>
            </ThemedView>
          </ThemedView>
        )}

        <ScrollView style={DashboardStyles.taskList}>
          {loading ? (
            <ThemedView style={DashboardStyles.emptyState}>
              <ThemedText style={DashboardStyles.emptyText}>Loading tasks...</ThemedText>
            </ThemedView>
          ) : tasks.length === 0 ? (
            <ThemedView style={DashboardStyles.emptyState}>
              <ThemedText style={DashboardStyles.emptyText}>No tasks yet. Add your first task!</ThemedText>
            </ThemedView>
          ) : (
            tasks.map(task => (
              <ThemedView key={task.id} style={BaseStyles.taskItem}>
                {/* Main Task Row */}
                <ThemedView style={DashboardStyles.taskRow}>
                  <TouchableOpacity
                    style={DashboardStyles.taskContent}
                    onPress={() => toggleTask(task.id)}
                  >
                    <ThemedView style={[
                      BaseStyles.checkbox,
                      task.completed && BaseStyles.checkboxChecked
                    ]}>
                      {task.completed && (
                        <ThemedText style={BaseStyles.checkmark}>✓</ThemedText>
                      )}
                    </ThemedView>
                    <ThemedView style={DashboardStyles.taskTitleContainer}>
                      <ThemedText style={[
                        DashboardStyles.taskTitle,
                        task.completed && DashboardStyles.taskTitleCompleted
                      ]}>
                        {task.title}
                      </ThemedText>
                      {task.deadline && (
                        <ThemedText style={DashboardStyles.deadlineText}>
                          📅 Due: {new Date(task.deadline).toLocaleDateString()}
                        </ThemedText>
                      )}
                      {task.subtasks && task.subtasks.length > 0 && (
                        <ThemedText style={DashboardStyles.subtaskCount}>
                          {task.subtasks.filter(st => st.completed).length}/{task.subtasks.length} completed
                        </ThemedText>
                      )}
                    </ThemedView>
                  </TouchableOpacity>
                  <ThemedView style={DashboardStyles.taskActions}>
                    <TouchableOpacity
                      style={DashboardStyles.expandButton}
                      onPress={() => toggleTaskExpansion(task.id)}
                    >
                      <ThemedText style={DashboardStyles.expandButtonText}>
                        {expandedTasks.has(task.id) ? '▼' : '▶'}
                      </ThemedText>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={BaseStyles.deleteButton}
                      onPress={() => deleteTask(task.id)}
                    >
                      <ThemedText style={BaseStyles.deleteButtonText}>×</ThemedText>
                    </TouchableOpacity>
                  </ThemedView>
                </ThemedView>

                {/* Subtasks Section */}
                {expandedTasks.has(task.id) && (
                  <ThemedView style={DashboardStyles.subtasksContainer}>
                    {/* Add Subtask Form */}
                    {showAddSubtask[task.id] && (
                      <ThemedView style={DashboardStyles.addSubtaskContainer}>
                        <TextInput
                          style={DashboardStyles.subtaskInput}
                          placeholder="Enter subtask title..."
                          value={newSubtaskTitles[task.id] || ''}
                          onChangeText={(text) => setNewSubtaskTitles(prev => ({ ...prev, [task.id]: text }))}
                          autoFocus
                        />
                        <TouchableOpacity
                          style={DashboardStyles.subtaskInput}
                          onPress={() => setShowSubtaskDatePicker(prev => ({ ...prev, [task.id]: true }))}
                        >
                          <ThemedText style={{ color: newSubtaskDeadlines[task.id] ? '#000' : '#999' }}>
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
                        <ThemedView style={DashboardStyles.addSubtaskButtons}>
                          <TouchableOpacity
                            style={[BaseStyles.button, DashboardStyles.cancelButton]}
                            onPress={() => {
                              setShowAddSubtask(prev => ({ ...prev, [task.id]: false }));
                              setNewSubtaskTitles(prev => ({ ...prev, [task.id]: '' }));
                              setNewSubtaskDeadlines(prev => ({ ...prev, [task.id]: null }));
                            }}
                          >
                            <ThemedText style={DashboardStyles.cancelButtonText}>Cancel</ThemedText>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={[BaseStyles.button, DashboardStyles.saveButton]}
                            onPress={() => addSubtask(task.id)}
                          >
                            <ThemedText style={DashboardStyles.saveButtonText}>Add</ThemedText>
                          </TouchableOpacity>
                        </ThemedView>
                      </ThemedView>
                    )}

                    {/* Subtask List */}
                    {task.subtasks?.map(subtask => (
                      <ThemedView key={subtask.id} style={DashboardStyles.subtaskItem}>
                        <TouchableOpacity
                          style={DashboardStyles.subtaskContent}
                          onPress={() => toggleSubtask(subtask.id, task.id)}
                        >
                          <ThemedView style={[
                            BaseStyles.checkbox,
                            BaseStyles.subtaskCheckbox,
                            subtask.completed && BaseStyles.checkboxChecked
                          ]}>
                            {subtask.completed && (
                              <ThemedText style={BaseStyles.checkmark}>✓</ThemedText>
                            )}
                          </ThemedView>
                          <ThemedView style={DashboardStyles.subtaskTitleContainer}>
                            <ThemedText style={[
                              DashboardStyles.subtaskTitle,
                              subtask.completed && DashboardStyles.taskTitleCompleted
                            ]}>
                              {subtask.title}
                            </ThemedText>
                            {subtask.deadline && (
                              <ThemedText style={DashboardStyles.subtaskDeadlineText}>
                                📅 Due: {new Date(subtask.deadline).toLocaleDateString()}
                              </ThemedText>
                            )}
                          </ThemedView>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={BaseStyles.deleteButton}
                          onPress={() => deleteSubtask(subtask.id, task.id)}
                        >
                          <ThemedText style={BaseStyles.deleteButtonText}>×</ThemedText>
                        </TouchableOpacity>
                      </ThemedView>
                    ))}

                    {/* Add Subtask Button */}
                    {!showAddSubtask[task.id] && (
                      <TouchableOpacity
                        style={DashboardStyles.addSubtaskButton}
                        onPress={() => setShowAddSubtask(prev => ({ ...prev, [task.id]: true }))}
                      >
                        <ThemedText style={DashboardStyles.addSubtaskButtonText}>+ Add Subtask</ThemedText>
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

