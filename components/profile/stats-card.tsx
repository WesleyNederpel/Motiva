import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { LabeledRow } from '@/components/common/labeled-row';
import { SectionCard } from '@/components/common/section-card';
import { useProfileStats } from '@/features/profile/use-profile-stats';
import { useThemeColors } from '@/hooks/use-themed-styles';

interface StatsCardProps {
  memberSince: string | null;
  points?: number;
}

function formatMemberSince(iso: string | null): string {
  if (!iso) return '—';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

interface StatTileProps {
  label: string;
  value: string;
}

function StatTile({ label, value }: StatTileProps) {
  const colors = useThemeColors();
  return (
    <View style={[styles.tile, { backgroundColor: colors.background, borderColor: colors.border }]}>
      <Text style={[styles.tileValue, { color: colors.text }]}>{value}</Text>
      <Text style={[styles.tileLabel, { color: colors.muted }]}>{label}</Text>
    </View>
  );
}

export function StatsCard({ memberSince, points: pointsProp }: StatsCardProps) {
  const { stats, loading } = useProfileStats();
  const v = loading ? '…' : undefined;
  const pointsValue = pointsProp !== undefined ? pointsProp : stats.points;

  return (
    <SectionCard title="Stats">
      <View style={styles.grid}>
        <View style={styles.tilesRow}>
          <StatTile label="Total" value={v ?? String(stats.totalTasks)} />
          <StatTile label="Done" value={v ?? String(stats.completedTasks)} />
        </View>
        <View style={styles.tilesRow}>
          <StatTile label="Rewards" value={v ?? String(stats.rewardsEarned)} />
          <StatTile label="Points" value={loading ? '…' : `⭐ ${pointsValue}`} />
        </View>
      </View>
      <LabeledRow
        label="Member since"
        value={formatMemberSince(memberSince)}
        isLast
      />
    </SectionCard>
  );
}

const styles = StyleSheet.create({
  grid: {
    padding: 16,
    paddingBottom: 8,
    gap: 8,
  },
  tilesRow: {
    flexDirection: 'row',
    gap: 8,
  },
  tile: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  tileValue: {
    fontSize: 22,
    fontWeight: '800',
    lineHeight: 28,
  },
  tileLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
});
