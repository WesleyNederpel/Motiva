import React from 'react';
import { Text, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Task } from '@/features/tasks/types';
import { formatDeadline, getTaskProgress } from '@/features/tasks/utils';
import { useThemedStyles } from '@/hooks/use-themed-styles';

interface TaskProgressProps {
  task: Task;
}

export const TaskProgress = React.memo(function TaskProgress({ task }: TaskProgressProps) {
  const styles = useThemedStyles();
  const progress = getTaskProgress(task);
  const pointsValue = 10 + (task.subtasks?.length ?? 0) * 5;

  return (
    <>
      <View style={styles.progressRow}>
        <View style={[styles.progressTrackContainer, { flex: 1, marginBottom: 0 }]}>
          <View
            style={[styles.progressFillBar, { width: `${progress}%` as any }]}
          />
        </View>
        <ThemedText style={[styles.dateLabel, { fontWeight: '600', minWidth: 32, textAlign: 'right', marginBottom: 0 }]}>
          {progress}%
        </ThemedText>
      </View>

      {task.deadline ? (
        <ThemedText style={styles.dateLabel}>
          {formatDeadline(task.deadline)}
        </ThemedText>
      ) : null}

      {task.reward ? (
        <View style={styles.rewardPill}>
          <Text style={styles.rewardPillText}>🎁 {task.reward}</Text>
        </View>
      ) : null}

      {!task.completed && (
        <View style={styles.pointsPill}>
          <Text style={styles.pointsPillText}>⭐ {pointsValue} pts</Text>
        </View>
      )}
    </>
  );
});
