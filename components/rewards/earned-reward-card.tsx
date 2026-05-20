import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Task } from '@/features/tasks/types';
import { useThemeColors } from '@/hooks/use-themed-styles';

interface EarnedRewardCardProps {
  task: Task;
}

export function EarnedRewardCard({ task }: EarnedRewardCardProps) {
  const theme = useThemeColors();
  const isDark = theme.background === '#111820';

  const gradientColors: [string, string] = isDark
    ? ['#2E2000', '#4A3008']
    : ['#FEF3C7', '#FDE08A'];

  const rewardTextColor = isDark ? '#F5C842' : '#92400E';
  const titleColor = isDark ? 'rgba(245,200,66,0.7)' : '#78350F';
  const badgeBg = isDark ? 'rgba(245,200,66,0.15)' : 'rgba(146,64,14,0.12)';
  const badgeText = isDark ? '#F5C842' : '#92400E';

  return (
    <LinearGradient
      colors={gradientColors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.card}
    >
      <View style={styles.row}>
        <View style={styles.textArea}>
          {task.reward ? (
            <Text style={[styles.rewardName, { color: rewardTextColor }]}>{task.reward}</Text>
          ) : null}
          <Text style={[styles.taskTitle, { color: titleColor }]}>{task.title}</Text>
        </View>
        <View style={[styles.badge, { backgroundColor: badgeBg }]}>
          <Text style={[styles.badgeText, { color: badgeText }]}>✓ Earned</Text>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
    shadowColor: '#C47A1E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  textArea: {
    flex: 1,
  },
  rewardName: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  },
  taskTitle: {
    fontSize: 13,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
});
