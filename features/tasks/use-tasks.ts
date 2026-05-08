import { useEffect, useState } from 'react';
import { Alert } from 'react-native';

import { supabase } from '@/lib/supabase';
import { Subtask, Task } from './types';
import { sortSubtasksByDeadline, sortTasksByDeadline } from './utils';

export interface AddTaskInput {
  title: string;
  deadline: Date | null;
  reward: string;
}

export interface UpdateTaskInput {
  title: string;
  deadline: Date | null;
}

export interface AddSubtaskInput {
  title: string;
  deadline: Date | null;
}

export interface UpdateSubtaskInput {
  title: string;
  deadline: Date | null;
}

/**
 * Owns dashboard task data and Supabase mutations.
 *
 * Returns the task list, loading state, expansion state, and all mutation
 * helpers used by the dashboard screen.
 */
export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set());

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
        .order('deadline', { ascending: true });

      if (error) {
        console.error('Error fetching tasks:', error);
        Alert.alert('Error', 'Failed to load tasks');
        return;
      }

      // Sort subtasks by deadline within each task
      const sortedData = (data || []).map(task => ({
        ...task,
        subtasks: task.subtasks?.sort(sortSubtasksByDeadline),
      }));

      setTasks(sortedData);
    } catch (error) {
      console.error('Unexpected error:', error);
      Alert.alert('Error', 'An unexpected error occurred');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const addTask = async ({ title, deadline, reward }: AddTaskInput) => {
    if (title.trim() === '') {
      Alert.alert('Error', 'Please enter a task title');
      return false;
    }

    try {
      const isAuthenticated = await checkUser();
      if (!isAuthenticated) return false;

      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        Alert.alert('Error', 'User authentication failed');
        return false;
      }

      const { data, error } = await supabase
        .from('tasks')
        .insert({
          title: title.trim(),
          completed: false,
          user_id: user.id,
          deadline: deadline ? deadline.toISOString() : null,
          reward: reward.trim() || null,
        })
        .select()
        .single();

      if (error) {
        console.error('Error adding task:', error);
        Alert.alert('Error', 'Failed to add task');
        return false;
      }

      const updatedTasks = [...tasks, data];
      updatedTasks.sort(sortTasksByDeadline);
      setTasks(updatedTasks);
      return true;
    } catch (error) {
      console.error('Unexpected error:', error);
      Alert.alert('Error', 'An unexpected error occurred');
      return false;
    }
  };

  const toggleTask = async (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const newCompletedState = !task.completed;

    try {
      const { error: taskError } = await supabase
        .from('tasks')
        .update({ completed: newCompletedState })
        .eq('id', taskId);

      if (taskError) {
        console.error('Error updating task:', taskError);
        Alert.alert('Error', 'Failed to update task');
        return;
      }

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

      setTasks(tasks.map(t => {
        if (t.id === taskId) {
          return {
            ...t,
            completed: newCompletedState,
            subtasks: t.subtasks?.map(s => ({ ...s, completed: newCompletedState })),
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

  const updateTask = async (taskId: string, { title, deadline }: UpdateTaskInput) => {
    if (title.trim() === '') {
      Alert.alert('Error', 'Please enter a task title');
      return false;
    }
    try {
      const { error } = await supabase
        .from('tasks')
        .update({
          title: title.trim(),
          deadline: deadline ? deadline.toISOString() : null,
        })
        .eq('id', taskId);

      if (error) {
        console.error('Error updating task:', error);
        Alert.alert('Error', 'Failed to update task');
        return false;
      }

      setTasks(tasks.map(t =>
        t.id === taskId
          ? { ...t, title: title.trim(), deadline: deadline ? deadline.toISOString() : null }
          : t
      ));
      return true;
    } catch (error) {
      console.error('Unexpected error:', error);
      Alert.alert('Error', 'An unexpected error occurred');
      return false;
    }
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

  const addSubtask = async (taskId: string, { title, deadline }: AddSubtaskInput) => {
    const trimmed = title.trim();

    if (trimmed === '') {
      Alert.alert('Error', 'Please enter a subtask title');
      return false;
    }

    try {
      const { data, error } = await supabase
        .from('subtasks')
        .insert({
          task_id: taskId,
          title: trimmed,
          completed: false,
          deadline: deadline ? deadline.toISOString() : null,
        })
        .select()
        .single();

      if (error) {
        console.error('Error adding subtask:', error);
        Alert.alert('Error', 'Failed to add subtask');
        return false;
      }

      setTasks(tasks.map(task => {
        if (task.id === taskId) {
          const updatedSubtasks = [...(task.subtasks || []), data];
          updatedSubtasks.sort(sortSubtasksByDeadline);
          return { ...task, subtasks: updatedSubtasks };
        }
        return task;
      }));
      return true;
    } catch (error) {
      console.error('Unexpected error:', error);
      Alert.alert('Error', 'An unexpected error occurred');
      return false;
    }
  };

  const toggleSubtask = async (subtaskId: string, taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    const subtask = task?.subtasks?.find(s => s.id === subtaskId);
    if (!subtask) return;

    const newSubtaskCompleted = !subtask.completed;

    try {
      const { error: subtaskError } = await supabase
        .from('subtasks')
        .update({ completed: newSubtaskCompleted })
        .eq('id', subtaskId);

      if (subtaskError) {
        console.error('Error updating subtask:', subtaskError);
        Alert.alert('Error', 'Failed to update subtask');
        return;
      }

      const updatedTasks = tasks.map(task => {
        if (task.id === taskId) {
          const updatedSubtasks = task.subtasks?.map(s =>
            s.id === subtaskId ? { ...s, completed: newSubtaskCompleted } : s
          );

          const allSubtasksCompleted = updatedSubtasks && updatedSubtasks.length > 0 &&
            updatedSubtasks.every(s => s.completed);

          return {
            ...task,
            subtasks: updatedSubtasks,
            completed: allSubtasksCompleted || false,
          };
        }
        return task;
      });

      const updatedTask = updatedTasks.find(t => t.id === taskId);
      if (updatedTask && updatedTask.subtasks && updatedTask.subtasks.length > 0) {
        const allSubtasksCompleted = updatedTask.subtasks.every((s: Subtask) => s.completed);

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

      setTasks(tasks.map(task => {
        if (task.id === taskId) {
          return {
            ...task,
            subtasks: task.subtasks?.filter(s => s.id !== subtaskId),
          };
        }
        return task;
      }));
    } catch (error) {
      console.error('Unexpected error:', error);
      Alert.alert('Error', 'An unexpected error occurred');
    }
  };

  const updateSubtask = async (
    subtaskId: string,
    taskId: string,
    { title, deadline }: UpdateSubtaskInput
  ) => {
    if (title.trim() === '') {
      Alert.alert('Error', 'Please enter a subtask title');
      return false;
    }
    try {
      const { error } = await supabase
        .from('subtasks')
        .update({
          title: title.trim(),
          deadline: deadline ? deadline.toISOString() : null,
        })
        .eq('id', subtaskId);

      if (error) {
        console.error('Error updating subtask:', error);
        Alert.alert('Error', 'Failed to update subtask');
        return false;
      }

      setTasks(tasks.map(t =>
        t.id === taskId
          ? {
            ...t,
            subtasks: t.subtasks?.map(s =>
              s.id === subtaskId
                ? { ...s, title: title.trim(), deadline: deadline ? deadline.toISOString() : null }
                : s
            ),
          }
          : t
      ));
      return true;
    } catch (error) {
      console.error('Unexpected error:', error);
      Alert.alert('Error', 'An unexpected error occurred');
      return false;
    }
  };

  return {
    // state
    tasks,
    loading,
    refreshing,
    user,
    expandedTasks,
    // actions
    fetchTasks,
    addTask,
    toggleTask,
    deleteTask,
    updateTask,
    toggleTaskExpansion,
    addSubtask,
    toggleSubtask,
    deleteSubtask,
    updateSubtask,
  };
}
