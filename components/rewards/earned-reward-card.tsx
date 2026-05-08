import React from 'react';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemedStyles } from '@/hooks/use-themed-styles';
import { Task } from '@/features/tasks/types';

interface EarnedRewardCardProps {
  task: Task;
}

export function EarnedRewardCard({ task }: EarnedRewardCardProps) {
  const styles = useThemedStyles();

  return (
    <ThemedView style={[styles.taskItem, { marginBottom: 10 }]}>
      {task.reward ? (
        <ThemedText style={[styles.rewardText, { fontSize: 16, fontWeight: '700', marginBottom: 4 }]}>
          {task.reward}
        </ThemedText>
      ) : null}
      <ThemedText style={styles.taskTitle}>{task.title}</ThemedText>
    </ThemedView>
  );
}
