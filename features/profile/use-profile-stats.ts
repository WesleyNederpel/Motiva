import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';

import { supabase } from '@/lib/supabase';

export interface ProfileStats {
  totalTasks: number;
  completedTasks: number;
  rewardsEarned: number;
  points: number;
}

const EMPTY_STATS: ProfileStats = {
  totalTasks: 0,
  completedTasks: 0,
  rewardsEarned: 0,
  points: 0,
};

export function useProfileStats() {
  const [stats, setStats] = useState<ProfileStats>(EMPTY_STATS);
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    try {
      const [tasksResult, userResult] = await Promise.all([
        supabase.from('tasks').select('completed, reward'),
        supabase.auth.getUser(),
      ]);

      if (tasksResult.error) {
        console.error('Error fetching profile stats:', tasksResult.error);
        return;
      }

      const rows = tasksResult.data ?? [];
      const completed = rows.filter(t => t.completed);
      const points = userResult.data.user?.user_metadata?.points ?? 0;

      setStats({
        totalTasks: rows.length,
        completedTasks: completed.length,
        rewardsEarned: completed.filter(
          t => typeof t.reward === 'string' && t.reward.trim() !== ''
        ).length,
        points,
      });
    } catch (err) {
      console.error('Unexpected error fetching profile stats:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchStats();
    }, [fetchStats])
  );

  return { stats, loading, refetch: fetchStats };
}
