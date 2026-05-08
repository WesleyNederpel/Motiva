import { useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ScreenHeader } from '@/components/common/screen-header';
import { EarnedRewardCard } from '@/components/rewards/earned-reward-card';
import { NextRewardCard } from '@/components/rewards/next-reward-card';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Task } from '@/features/tasks/types';
import { getTaskProgress, sortByDeadline } from '@/features/tasks/utils';
import { useThemedStyles } from '@/hooks/use-themed-styles';
import { supabase } from '@/lib/supabase';

export default function RewardsScreen() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const styles = useThemedStyles();

  const fetchTasks = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        Alert.alert('Authentication Required', 'Please log in to view rewards');
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('tasks')
        .select('*, subtasks (*)')
        .order('deadline', { ascending: true });

      if (error) {
        console.error('Error fetching tasks:', error);
        Alert.alert('Error', 'Failed to load rewards');
        return;
      }

      setTasks(data || []);
    } catch (error) {
      console.error('Unexpected error:', error);
      Alert.alert('Error', 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchTasks();
    }, [])
  );

  // Task with highest progress that is incomplete and has a reward set
  const nextRewardTask = tasks
    .filter(t => !t.completed && t.reward && t.reward.trim() !== '')
    .sort((a, b) => {
      const diff = getTaskProgress(b) - getTaskProgress(a);
      if (diff !== 0) return diff;
      return sortByDeadline(a, b);
    })[0] ?? null;

  const earnedTasks = tasks.filter(t => t.completed);

  return (
    <SafeAreaView style={styles.container}>
      <ThemedView style={styles.innerContainer}>
        <ScreenHeader title="Rewards" />

        {loading ? (
          <ThemedView style={styles.emptyState}>
            <ThemedText style={styles.emptyText}>Loading rewards...</ThemedText>
          </ThemedView>
        ) : (
          <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
            <ThemedText style={[styles.taskTitle, { fontWeight: '700', fontSize: 16, marginBottom: 10 }]}>
              Next Reward
            </ThemedText>
            <NextRewardCard task={nextRewardTask} />

            <ThemedText style={[styles.taskTitle, { fontWeight: '700', fontSize: 16, marginBottom: 10 }]}>
              Earned Rewards
            </ThemedText>

            {earnedTasks.length === 0 ? (
              <ThemedView style={styles.taskItem}>
                <ThemedText style={styles.emptyText}>No rewards earned yet.</ThemedText>
              </ThemedView>
            ) : (
              earnedTasks.map(task => (
                <EarnedRewardCard key={task.id} task={task} />
              ))
            )}
          </ScrollView>
        )}
      </ThemedView>
    </SafeAreaView>
  );
}
