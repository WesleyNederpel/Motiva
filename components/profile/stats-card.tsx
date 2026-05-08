import React from 'react';

import { LabeledRow } from '@/components/common/labeled-row';
import { SectionCard } from '@/components/common/section-card';
import { useProfileStats } from '@/features/profile/use-profile-stats';

interface StatsCardProps {
  memberSince: string | null;
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

export function StatsCard({ memberSince }: StatsCardProps) {
  const { stats, loading } = useProfileStats();

  return (
    <SectionCard title="Stats">
      <LabeledRow label="Member since" value={formatMemberSince(memberSince)} />
      <LabeledRow
        label="Total tasks"
        value={loading ? '…' : String(stats.totalTasks)}
      />
      <LabeledRow
        label="Completed tasks"
        value={loading ? '…' : String(stats.completedTasks)}
      />
      <LabeledRow
        label="Rewards earned"
        value={loading ? '…' : String(stats.rewardsEarned)}
        isLast
      />
    </SectionCard>
  );
}
