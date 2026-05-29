import { useCallback, useEffect, useRef, useState } from 'react';
import { Alert } from 'react-native';

import { supabase } from '@/lib/supabase';
import { triggerCelebration } from './celebration';
import { Task } from './types';
import { calculateTaskPoints, getTaskProgress, sortSubtasksByDeadline, sortTasksByDeadline } from './utils';

export interface AddTaskInput {
  title: string;
  deadline: Date | null;
  reward: string;
}

export interface UpdateTaskInput {
  title: string;
  deadline: Date | null;
  reward: string;
}

export interface AddSubtaskInput {
  title: string;
  deadline: Date | null;
}

export interface UpdateSubtaskInput {
  title: string;
  deadline: Date | null;
}

export function useTasks() {
  const serializeDeadline = (date: Date | null): string | null => {
    if (!date) return null;
    const d = new Date(date);
    d.setHours(12, 0, 0, 0); // normalize to local noon to avoid UTC day shift
    return d.toISOString();
  };
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set());

  const tasksRef = useRef<Task[]>([]);
  useEffect(() => {
    tasksRef.current = tasks;
  }, [tasks]);

  const awardPoints = useCallback(async (earned: number) => {
    if (earned <= 0) return;
    const { data } = await supabase.auth.getUser();
    const current = data.user?.user_metadata?.points ?? 0;
    await supabase.auth.updateUser({ data: { points: current + earned } });
  }, []);

  const checkUser = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      Alert.alert('Authentication Required', 'Please log in to access your tasks');
      setLoading(false);
      return null;
    }
    return user;
  }, []);

  const fetchTasks = useCallback(async () => {
    try {
      const user = await checkUser();
      if (!user) return;

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
    }
  }, [checkUser]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const addTask = useCallback(async ({ title, deadline, reward }: AddTaskInput) => {
    if (title.trim() === '') {
      Alert.alert('Error', 'Please enter a task title');
      return false;
    }

    try {
      const user = await checkUser();
      if (!user) return false;

      const { data, error } = await supabase
        .from('tasks')
        .insert({
          title: title.trim(),
          completed: false,
          user_id: user.id,
          deadline: serializeDeadline(deadline),
          reward: reward.trim() || null,
        })
        .select()
        .single();

      if (error) {
        console.error('Error adding task:', error);
        Alert.alert('Error', 'Failed to add task');
        return false;
      }

      setTasks(prev => {
        const updated = [...prev, data];
        updated.sort(sortTasksByDeadline);
        return updated;
      });
      return true;
    } catch (error) {
      console.error('Unexpected error:', error);
      Alert.alert('Error', 'An unexpected error occurred');
      return false;
    }
  }, [checkUser]);

  const toggleTask = useCallback(async (taskId: string) => {
    const task = tasksRef.current.find(t => t.id === taskId);
    if (!task) return;

    const newCompletedState = !task.completed;
    const prevProgress = getTaskProgress(task);
    const completedAt = newCompletedState ? new Date().toISOString() : null;

    try {
      const { error: taskError } = await supabase
        .from('tasks')
        .update({ completed: newCompletedState, completed_at: completedAt })
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

      let pointsJustAwarded = false;
      if (newCompletedState && !task.points_awarded && prevProgress < 100) {
        const { error: flagError } = await supabase
          .from('tasks')
          .update({ points_awarded: true })
          .eq('id', taskId);
        if (!flagError) {
          pointsJustAwarded = true;
        }
      }

      const nextTasks = tasksRef.current.map(t => {
        if (t.id === taskId) {
          return {
            ...t,
            completed: newCompletedState,
            completed_at: completedAt,
            points_awarded: pointsJustAwarded ? true : t.points_awarded,
            subtasks: t.subtasks?.map(s => ({ ...s, completed: newCompletedState })),
          };
        }
        return t;
      });
      setTasks(nextTasks);

      const nextTask = nextTasks.find(t => t.id === taskId);
      if (nextTask && prevProgress < 100 && getTaskProgress(nextTask) === 100) {
        triggerCelebration();
        if (pointsJustAwarded) {
          await awardPoints(calculateTaskPoints(nextTask));
        }
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      Alert.alert('Error', 'An unexpected error occurred');
    }
  }, [awardPoints]);

  const deleteTask = useCallback(async (taskId: string) => {
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

              setTasks(prev => prev.filter(task => task.id !== taskId));
            } catch (error) {
              console.error('Unexpected error:', error);
              Alert.alert('Error', 'An unexpected error occurred');
            }
          },
        },
      ]
    );
  }, []);

  const updateTask = useCallback(async (taskId: string, { title, deadline, reward }: UpdateTaskInput) => {
    if (title.trim() === '') {
      Alert.alert('Error', 'Please enter a task title');
      return false;
    }
    const trimmedReward = reward.trim() || null;
    try {
      const { error } = await supabase
        .from('tasks')
        .update({
          title: title.trim(),
          deadline: serializeDeadline(deadline),
          reward: trimmedReward,
        })
        .eq('id', taskId);

      if (error) {
        console.error('Error updating task:', error);
        Alert.alert('Error', 'Failed to update task');
        return false;
      }

      setTasks(prev => prev.map(t =>
        t.id === taskId
          ? { ...t, title: title.trim(), deadline: serializeDeadline(deadline), reward: trimmedReward }
          : t
      ));
      return true;
    } catch (error) {
      console.error('Unexpected error:', error);
      Alert.alert('Error', 'An unexpected error occurred');
      return false;
    }
  }, []);

  const toggleTaskExpansion = useCallback((taskId: string) => {
    setExpandedTasks(prev => {
      const next = new Set(prev);
      if (next.has(taskId)) {
        next.delete(taskId);
      } else {
        next.add(taskId);
      }
      return next;
    });
  }, []);

  const addSubtask = useCallback(async (taskId: string, { title, deadline }: AddSubtaskInput) => {
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
          deadline: serializeDeadline(deadline),
        })
        .select()
        .single();

      if (error) {
        console.error('Error adding subtask:', error);
        Alert.alert('Error', 'Failed to add subtask');
        return false;
      }

      setTasks(prev => prev.map(task => {
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
  }, []);

  const toggleSubtask = useCallback(async (subtaskId: string, taskId: string) => {
    const task = tasksRef.current.find(t => t.id === taskId);
    const subtask = task?.subtasks?.find(s => s.id === subtaskId);
    if (!task || !subtask) return;

    const newSubtaskCompleted = !subtask.completed;
    const prevProgress = getTaskProgress(task);

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

      const updatedTasks = tasksRef.current.map(t => {
        if (t.id === taskId) {
          const updatedSubtasks = t.subtasks?.map(s =>
            s.id === subtaskId ? { ...s, completed: newSubtaskCompleted } : s
          );
          const allSubtasksCompleted = updatedSubtasks?.length
            ? updatedSubtasks.every(s => s.completed)
            : false;
          return { ...t, subtasks: updatedSubtasks, completed: allSubtasksCompleted };
        }
        return t;
      });

      const updatedTask = updatedTasks.find(t => t.id === taskId);
      const willComplete = updatedTask ? getTaskProgress(updatedTask) === 100 : false;
      const wasComplete = prevProgress === 100;
      let newCompletedAt: string | null | undefined = undefined;
      if (willComplete && !wasComplete) {
        newCompletedAt = new Date().toISOString();
      } else if (!willComplete && wasComplete) {
        newCompletedAt = null;
      }

      let pointsJustAwarded = false;
      if (updatedTask?.subtasks?.length) {
        const updates: Record<string, unknown> = { completed: updatedTask.completed };
        if (newCompletedAt !== undefined) {
          updates.completed_at = newCompletedAt;
        }
        if (willComplete && prevProgress < 100 && !task.points_awarded) {
          updates.points_awarded = true;
        }
        const { error: taskError } = await supabase
          .from('tasks')
          .update(updates)
          .eq('id', taskId);

        if (taskError) {
          console.error('Error updating task:', taskError);
          Alert.alert('Error', 'Failed to update task');
          return;
        }
        if (updates.points_awarded) {
          pointsJustAwarded = true;
        }
      }

      const finalTasks = updatedTasks.map(t => {
        if (t.id !== taskId) return t;
        const next = { ...t };
        if (pointsJustAwarded) next.points_awarded = true;
        if (newCompletedAt !== undefined) next.completed_at = newCompletedAt;
        return next;
      });
      setTasks(finalTasks);

      if (updatedTask && prevProgress < 100 && willComplete) {
        triggerCelebration();
        if (pointsJustAwarded) {
          await awardPoints(calculateTaskPoints(updatedTask));
        }
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      Alert.alert('Error', 'An unexpected error occurred');
    }
  }, [awardPoints]);

  const deleteSubtask = useCallback(async (subtaskId: string, taskId: string) => {
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

      setTasks(prev => prev.map(task => {
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
  }, []);

  const updateSubtask = useCallback(async (
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
          deadline: serializeDeadline(deadline),
        })
        .eq('id', subtaskId);

      if (error) {
        console.error('Error updating subtask:', error);
        Alert.alert('Error', 'Failed to update subtask');
        return false;
      }

      setTasks(prev => prev.map(t =>
        t.id === taskId
          ? {
            ...t,
            subtasks: t.subtasks?.map(s =>
              s.id === subtaskId
                ? { ...s, title: title.trim(), deadline: serializeDeadline(deadline) }
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
  }, []);

  return {
    tasks,
    loading,
    expandedTasks,
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
