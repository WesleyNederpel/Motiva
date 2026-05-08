import React from 'react';
import { View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { useThemedStyles } from '@/hooks/use-themed-styles';
import { Task } from '@/features/tasks/types';
import { formatDeadline, getTaskProgress } from '@/features/tasks/utils';

interface TaskProgressProps {
  task: Task;
}

export function TaskProgress({ task }: TaskProgressProps) {
  const styles = useThemedStyles();
  const progress = getTaskProgress(task);

  return (
    <>
      <View style={styles.progressTrackContainer}>
        <View
          style={[styles.progressFillBar, { width: `${progress}%` as any }]}
        />
      </View>

      {task.deadline ? (
        <ThemedText style={styles.dateLabel}>
          {formatDeadline(task.deadline)}
        </ThemedText>
      ) : null}

      {task.reward ? (
        <ThemedText style={styles.rewardText}>{task.reward}</ThemedText>
      ) : null}
    </>
  );
}
