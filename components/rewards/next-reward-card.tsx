import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Task } from '@/features/tasks/types';
import { getTaskProgress } from '@/features/tasks/utils';
import { useThemeColors } from '@/hooks/use-themed-styles';

interface NextRewardCardProps {
  task: Task | null;
}

export function NextRewardCard({ task }: NextRewardCardProps) {
  const theme = useThemeColors();
  const isDark = theme.background === '#111820';

  if (!task) {
    return (
      <View style={[styles.emptyCard, { backgroundColor: theme.surface, shadowColor: theme.shadow }]}>
        <Text style={[styles.emptyText, { color: theme.muted }]}>No upcoming rewards yet.</Text>
      </View>
    );
  }

  const progress = getTaskProgress(task);
  const gradientColors: [string, string] = isDark
    ? ['#8B6914', '#4A3008']
    : ['#F5C842', '#C47A1E'];

  return (
    <LinearGradient
      colors={gradientColors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.card}
    >
      <Text style={styles.label}>🎯 Your Next Reward</Text>
      <Text style={styles.rewardName}>{task.reward}</Text>
      <Text style={styles.taskTitle}>{task.title}</Text>

      <View style={styles.progressSection}>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${progress}%` as any }]} />
        </View>
        <Text style={styles.progressLabel}>{progress}%</Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 10,
    elevation: 6,
  },
  emptyCard: {
    borderRadius: 18,
    padding: 20,
    marginBottom: 24,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.85)',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  rewardName: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  taskTitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 16,
  },
  progressSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  progressTrack: {
    flex: 1,
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.35)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
  },
  progressLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
    minWidth: 36,
    textAlign: 'right',
  },
  emptyText: {
    fontSize: 14,
  },
});
