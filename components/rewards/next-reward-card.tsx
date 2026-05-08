import React from 'react';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemedStyles } from '@/hooks/use-themed-styles';
import { Task } from '@/features/tasks/types';
import { getTaskProgress } from '@/features/tasks/utils';

interface NextRewardCardProps {
  task: Task | null;
}

export function NextRewardCard({ task }: NextRewardCardProps) {
  const styles = useThemedStyles();

  if (!task) {
    return (
      <ThemedView style={[styles.taskItem, { marginBottom: 24 }]}>
        <ThemedText style={styles.emptyText}>No upcoming rewards yet.</ThemedText>
      </ThemedView>
    );
  }

  const progress = getTaskProgress(task);

  return (
    <ThemedView style={[styles.taskItem, { marginBottom: 24 }]}>
      <ThemedText style={[styles.rewardText, { fontSize: 18, fontWeight: '700', marginBottom: 4 }]}>
        {task.reward}
      </ThemedText>
      <ThemedText style={[styles.taskTitle, { marginBottom: 12 }]}>
        {task.title}
      </ThemedText>

      <ThemedView style={styles.progressContainer}>
        <ThemedView style={styles.progressBar}>
          <ThemedView style={[styles.progressFill, { width: `${progress}%` }]} />
        </ThemedView>
        <ThemedText style={styles.progressText}>{progress}%</ThemedText>
      </ThemedView>
    </ThemedView>
  );
}
