import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';

import { supabase } from '@/lib/supabase';

export interface ProfileStats {
  totalTasks: number;
  completedTasks: number;
  rewardsEarned: number;
}

const EMPTY_STATS: ProfileStats = {
  totalTasks: 0,
  completedTasks: 0,
  rewardsEarned: 0,
};

export function useProfileStats() {
  const [stats, setStats] = useState<ProfileStats>(EMPTY_STATS);
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('completed, reward');

      if (error) {
        console.error('Error fetching profile stats:', error);
        return;
      }

      const rows = data ?? [];
      const completed = rows.filter(t => t.completed);
      setStats({
        totalTasks: rows.length,
        completedTasks: completed.length,
        rewardsEarned: completed.filter(
          t => typeof t.reward === 'string' && t.reward.trim() !== ''
        ).length,
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
