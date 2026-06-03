import React from 'react';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ScreenHeader } from '@/components/common/screen-header';
import { EarnedRewardCard } from '@/components/rewards/earned-reward-card';
import { NextRewardCard } from '@/components/rewards/next-reward-card';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useTasksContext } from '@/features/tasks/tasks-context';
import { getTaskProgress, isOverdue, sortByDeadline } from '@/features/tasks/utils';
import { useThemeColors, useThemedStyles } from '@/hooks/use-themed-styles';

export default function RewardsScreen() {
  const { tasks } = useTasksContext();
  const styles = useThemedStyles();
  const theme = useThemeColors();

  const nextRewardTask = tasks
    .filter(t => !t.completed && t.reward && t.reward.trim() !== '' && !isOverdue(t.deadline, false))
    .sort((a, b) => {
      const diff = getTaskProgress(b) - getTaskProgress(a);
      if (diff !== 0) return diff;
      return sortByDeadline(a, b);
    })[0] ?? null;

  const startOfDay = (d: Date) => {
    const x = new Date(d);
    x.setHours(0, 0, 0, 0);
    return x;
  };
  const earnedTasks = tasks.filter(t => {
    if (!t.completed) return false;
    if (!t.deadline) return true;
    const due = new Date(t.deadline);
    if (isNaN(due.getTime())) return true;
    if (t.completed_at) {
      // Earned if the task was completed on or before its deadline day.
      return startOfDay(new Date(t.completed_at)).getTime() <= startOfDay(due).getTime();
    }
    // Legacy tasks without completed_at: keep visible unless deadline has already passed.
    return !isOverdue(t.deadline, false);
  });

  return (
    <SafeAreaView style={styles.container}>
      <ThemedView style={styles.innerContainer}>
        <ScreenHeader title="Rewards" />

        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
          <ThemedText style={{ fontSize: 18, fontWeight: '800', marginBottom: 10, letterSpacing: 0.3, color: theme.rewardColor }}>
            🎯 Next Reward
          </ThemedText>
          <NextRewardCard task={nextRewardTask} />

          <ThemedText style={{ fontSize: 18, fontWeight: '800', marginBottom: 10, letterSpacing: 0.3, color: theme.rewardColor }}>
            🏆 Earned Rewards
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
      </ThemedView>
    </SafeAreaView>
  );
}

